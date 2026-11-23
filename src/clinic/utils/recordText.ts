const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_FILES = 10;
const MAX_PDF_PAGES = 10;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
  "image/gif",
]);

export const RECORD_FILE_LIMITS = {
  maxFileBytes: MAX_FILE_BYTES,
  maxFiles: MAX_FILES,
  maxPdfPages: MAX_PDF_PAGES,
};

export function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return file.type === "application/pdf" || name.endsWith(".pdf");
}

export function isSupportedRecordFile(file: File): boolean {
  if (isPdfFile(file)) return true;
  if (IMAGE_TYPES.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif"].some((ext) => name.endsWith(ext));
}

export function validateRecordFiles(files: File[]): string | null {
  if (files.length === 0) return "Choose a photo or PDF to read.";
  if (files.length > MAX_FILES) return `Upload up to ${MAX_FILES} files at a time.`;
  const unsupported = files.find((file) => !isSupportedRecordFile(file));
  if (unsupported) return "Use a JPG, PNG, WEBP, GIF, or PDF.";
  const tooBig = files.find((file) => file.size > MAX_FILE_BYTES);
  if (tooBig) return "Each file must be 20 MB or smaller.";
  return null;
}

/** Printed text is usable when it has enough letters to skip a second OCR pass. */
export function hasReadableText(text: string): boolean {
  const letters = text.replace(/[^a-z0-9]/gi, "");
  return letters.length >= 20;
}

export function joinExtractedParts(parts: string[]): string {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}
