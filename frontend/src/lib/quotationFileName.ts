/**
 * Quotation PDF file name: "Customer Name_System Capacity.pdf",
 * e.g. "Shaithya_5kW.pdf". Shared by the details popup (which names the
 * download) and the PDF routes (Content-Disposition), so they cannot disagree.
 */
export function quotationFileName(
  customerName: unknown,
  systemSize: unknown,
  /** "accounting" marks the Studio's short copy, e.g. "Shaithya_5kW_Accounting.pdf". */
  variant: "customer" | "accounting" = "customer",
): string {
  const clean = (value: unknown) =>
    (typeof value === "string" ? value : "")
      // Characters no filesystem accepts, plus control characters.
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const name = clean(customerName) || "Customer";
  // "5 kW" -> "5kW"
  const size = clean(systemSize).replace(/\s+/g, "");
  const suffix = variant === "accounting" ? "_Accounting" : "";
  return size ? `${name}_${size}${suffix}.pdf` : `${name}${suffix}.pdf`;
}

/** Content-Disposition for that name; non-ASCII names (e.g. Malayalam) via RFC 5987. */
export function attachmentHeader(fileName: string): string {
  const ascii = fileName.replace(/[^\x20-\x7e]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}
