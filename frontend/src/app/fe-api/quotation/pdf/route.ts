import { NextResponse } from "next/server";
import puppeteer, { type Browser } from "puppeteer-core";

/**
 * Renders the v2 quotation to a PDF with real Chrome.
 *
 * The document is a pixel-exact Figma export that relies on gradients,
 * percentage-sized background images, clip-paths, border-radius clipping and
 * nested transforms. Rasterising it in JS (html2canvas) reproduces only a
 * subset of those and quietly gets the rest wrong, so instead Chrome loads the
 * real /quotation/v2 page and prints it. What the browser shows is what the
 * customer receives, and the text stays selectable rather than being 12 JPEGs.
 */

export const runtime = "nodejs";
// Chrome needs longer than the default for a cold page compile in dev.
export const maxDuration = 120;

const CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium-browser";

/** Where Chrome should reach this app from inside the container. */
function selfOrigin(): string {
  if (process.env.PDF_RENDER_ORIGIN) return process.env.PDF_RENDER_ORIGIN;
  // Chrome runs in the same container, so the app is always on localhost —
  // the public host in the request may not resolve from in here.
  const port = process.env.PORT || "3000";
  return `http://127.0.0.1:${port}`;
}

function safeFileName(name: unknown): string {
  const cleaned =
    typeof name === "string" ? name.trim().replace(/[^a-zA-Z0-9]+/g, "-") : "";
  return cleaned || "Customer";
}

export async function POST(request: Request) {
  let browser: Browser | undefined;

  try {
    const quotationData = await request.json();

    if (!quotationData || typeof quotationData !== "object") {
      return NextResponse.json(
        { error: "Missing quotation data." },
        { status: 400 },
      );
    }

    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      protocolTimeout: 120_000,
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
        // Crashpad (Chrome's crash-report handler) needs to create a
        // database directory on disk before the browser will finish
        // starting up. In a container with a read-only filesystem outside
        // a few mounted paths, that write fails and Chrome never launches
        // at all ("chrome_crashpad_handler: --database is required"). We
        // don't need crash reports in a server context, so disable the
        // handler entirely rather than depend on a writable path for it.
        "--disable-crash-reporter",
      ],
    });

    const page = await browser.newPage();
    // Render at the sheet's CSS width so layout matches the on-screen document.
    // deviceScaleFactor stays at 1: in a PDF, text and vector art are
    // resolution independent, so raising it buys nothing. Photograph size in
    // the output is driven by the source assets and the percentage
    // `background-size` rules that upscale them, not by this.
    await page.setViewport({ width: 900, height: 1400, deviceScaleFactor: 1 });

    // The page reads `quotationData` from sessionStorage on mount, exactly as
    // it does for a real visitor. Seeding it before any page script runs means
    // the route needs no special "render mode" and cannot drift from what the
    // browser shows.
    const payload = JSON.stringify(quotationData);
    await page.evaluateOnNewDocument((data: string) => {
      window.sessionStorage.setItem("quotationData", data);
    }, payload);

    await page.goto(`${selfOrigin()}/quotation/v2`, {
      waitUntil: "networkidle0",
      timeout: 90_000,
    });

    // All twelve sheets must be in the DOM before printing.
    await page.waitForSelector(".qv2-sheet", { timeout: 30_000 });
    await page.waitForFunction(
      () => document.querySelectorAll(".qv2-sheet").length >= 12,
      { timeout: 30_000 },
    );
    await page.evaluateHandle("document.fonts.ready");

    const pdf = await page.pdf({
      // `@page { size: A4; margin: 0 }` already lives in quotation-v2.css, so
      // the stylesheet stays the single source of truth for page geometry.
      preferCSSPageSize: true,
      printBackground: true,
      timeout: 90_000,
    });

    const fileName = `Flarize-Quotation-${safeFileName(
      (quotationData as { customerName?: string }).customerName,
    )}.pdf`;

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Quotation PDF generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate the quotation PDF." },
      { status: 500 },
    );
  } finally {
    await browser?.close();
  }
}
