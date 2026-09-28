import { NextResponse } from "next/server";
import puppeteer, { type Browser } from "puppeteer-core";

import { resolveChromePath } from "@/lib/chromePath";
import { attachmentHeader, quotationFileName } from "@/lib/quotationFileName";
import { pageCountFor, parseVariant } from "@/components/QuotationV2/pageSets";

/**
 * Render a quotation page to a PDF with real Chrome — shared by the English
 * (/fe-api/quotation/pdf) and Malayalam (/fe-api/quotation/pdf-malayalam)
 * routes, which differ only in the page they load.
 *
 * The document is a pixel-exact Figma export that relies on gradients,
 * percentage-sized background images, clip-paths, border-radius clipping and
 * nested transforms. Rasterising it in JS (html2canvas) reproduces only a
 * subset of those and quietly gets the rest wrong, so instead Chrome loads the
 * real page and prints it. What the browser shows is what the customer
 * receives, and the text stays selectable.
 *
 * Timing: nginx gives the route 60 s. Chrome prints as soon as the page marks
 * itself ready (`<html data-quotation-ready>`, set once the document and its
 * neighbourhood stats have settled — every API call the page makes is capped
 * at 8 s), then allows images a short, bounded moment to finish. It never
 * waits for the network to go fully quiet: a request that hangs from inside
 * the server (analytics, or the public API unreachable from the container)
 * used to hold the PDF until nginx timed out.
 */

/** Where Chrome should reach this app from inside the container. */
function selfOrigin(): string {
  if (process.env.PDF_RENDER_ORIGIN) return process.env.PDF_RENDER_ORIGIN;
  // Chrome runs in the same container, so the app is always on localhost —
  // the public host in the request may not resolve from in here.
  const port = process.env.PORT || "3000";
  return `http://127.0.0.1:${port}`;
}

const READY_TIMEOUT_MS = 35_000;
/** Best-effort wait for photos after the page is ready; never fails the PDF. */
const IMAGE_SETTLE_MS = 6_000;

export async function renderQuotationPdf(
  request: Request,
  { path, label }: { path: string; label: string },
): Promise<NextResponse> {
  let browser: Browser | undefined;
  const started = Date.now();
  let stage = "reading request";
  const mark = (next: string) => {
    stage = next;
  };

  try {
    const quotationData = await request.json();
    if (!quotationData || typeof quotationData !== "object") {
      return NextResponse.json({ error: "Missing quotation data." }, { status: 400 });
    }
    // `?variant=accounting` is the Studio's short copy (pages 1, 5, 7, 8).
    const variant = parseVariant(new URL(request.url).searchParams.get("variant"));
    const expectedPages = pageCountFor(variant);

    mark("launching Chrome");
    browser = await puppeteer.launch({
      executablePath: resolveChromePath(),
      headless: true,
      protocolTimeout: 60_000,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        // The default 64MB /dev/shm in a container is too small for Chrome.
        "--disable-dev-shm-usage",
        // Without these two, GPU/EGL initialisation fails inside the container
        // and the browser stops answering CDP — `newPage()` then hangs until
        // the protocol timeout rather than erroring.
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--no-zygote",
        "--no-first-run",
        "--font-render-hinting=none",
        // Crashpad needs a writable database directory before Chrome will
        // start; the container's filesystem is read-only outside a few
        // mounts, and crash reports are no use on a server.
        "--disable-crash-reporter",
      ],
    });

    // If the customer closes the popup before the PDF finishes, stop.
    request.signal.addEventListener("abort", () => {
      browser?.close().catch(() => {});
    });

    mark("opening the page");
    const page = await browser.newPage();
    // Render at the sheet's CSS width so layout matches the on-screen
    // document. deviceScaleFactor 1: text and vector art in a PDF are
    // resolution independent.
    await page.setViewport({ width: 900, height: 1400, deviceScaleFactor: 1 });

    // The page reads `quotationData` from sessionStorage on mount, exactly as
    // it does for a real visitor, so the route needs no special render mode.
    await page.evaluateOnNewDocument((data: string) => {
      window.sessionStorage.setItem("quotationData", data);
    }, JSON.stringify(quotationData));

    await page.goto(`${selfOrigin()}${path}?variant=${variant}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    mark("waiting for the quotation to be ready");
    await page.waitForSelector("html[data-quotation-ready]", { timeout: READY_TIMEOUT_MS });
    await page.waitForFunction(
      (count: number) => document.querySelectorAll(".qv2-sheet").length >= count,
      { timeout: 10_000 },
      expectedPages,
    );

    mark("loading images and fonts");
    await page.evaluateHandle("document.fonts.ready");
    // Photos and CSS background art come from the CDN. Give them a bounded
    // moment; a request that never completes must not cost the whole PDF.
    await page.waitForNetworkIdle({ idleTime: 500, timeout: IMAGE_SETTLE_MS }).catch(() => {});

    mark("printing");
    const pdf = await page.pdf({
      // `@page { size: A4; margin: 0 }` lives in quotation-v2.css, so the
      // stylesheet stays the single source of truth for page geometry.
      preferCSSPageSize: true,
      printBackground: true,
      timeout: 30_000,
    });

    const { customerName, systemSize } = quotationData as {
      customerName?: string;
      systemSize?: string;
    };
    const fileName = quotationFileName(customerName, systemSize, variant);
    console.info(`${label} PDF rendered in ${Date.now() - started} ms (${variant}, ${expectedPages} pages)`);

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": attachmentHeader(fileName),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(`${label} PDF generation failed while ${stage} after ${Date.now() - started} ms:`, error);
    return NextResponse.json({ error: "Failed to generate the quotation PDF." }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
