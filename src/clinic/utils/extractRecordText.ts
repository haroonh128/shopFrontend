import { createWorker, type Worker } from "tesseract.js";
import {
  RECORD_FILE_LIMITS,
  hasReadableText,
  isPdfFile,
  joinExtractedParts,
  validateRecordFiles,
} from "./recordText";

type PdfTextItem = { str?: string };
type PdfPage = {
  getTextContent: () => Promise<{ items: PdfTextItem[] }>;
  getViewport: (params: { scale: number }) => { width: number; height: number };
  render: (params: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => { promise: Promise<void> };
};
type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
  destroy: () => Promise<void>;
};

let workerPromise: Promise<Worker> | null = null;

function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = createWorker("eng").catch((error: unknown) => {
      workerPromise = null;
      throw error;
    });
  }
  return workerPromise;
}

async function recognize(image: File | HTMLCanvasElement): Promise<string> {
  try {
    const worker = await getWorker();
    const result = await worker.recognize(image);
    return (result.data.text || "").trim();
  } catch {
    const failed = workerPromise;
    workerPromise = null;
    if (failed) {
      failed.then((worker) => worker.terminate()).catch(() => undefined);
    }
    throw new Error("The text could not be read. Check your connection and try a clearer photo.");
  }
}

function pageText(items: PdfTextItem[]): string {
  return items
    .map((item) => item.str || "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

async function renderPage(page: PdfPage): Promise<HTMLCanvasElement> {
  const base = page.getViewport({ scale: 1 });
  const scale = Math.min(2, 1800 / Math.max(base.width, 1));
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This page could not be read in the browser.");
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

async function loadPdf(data: Uint8Array): Promise<PdfDocument> {
  await import("pdfjs-dist/legacy/build/pdf.worker.entry");
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
  const loadingTask = pdfjs.getDocument({ data, isEvalSupported: false });
  return loadingTask.promise;
}

async function extractPdf(file: File, onProgress: (message: string) => void): Promise<string> {
  const data = new Uint8Array(await file.arrayBuffer());
  const document = await loadPdf(data);
  const pageCount = Math.min(document.numPages, RECORD_FILE_LIMITS.maxPdfPages);
  const parts: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      onProgress(`Reading page ${pageNumber} of ${pageCount}...`);
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const printed = pageText(content.items);
      if (hasReadableText(printed)) {
        parts.push(printed);
        continue;
      }
      const canvas = await renderPage(page);
      parts.push(await recognize(canvas));
      canvas.width = 0;
      canvas.height = 0;
    }
  } finally {
    await document.destroy();
  }

  if (document.numPages > RECORD_FILE_LIMITS.maxPdfPages) {
    parts.push(`Only the first ${RECORD_FILE_LIMITS.maxPdfPages} pages were read.`);
  }

  return joinExtractedParts(parts);
}

async function extractImage(file: File, onProgress: (message: string) => void): Promise<string> {
  onProgress(`Reading ${file.name}...`);
  return recognize(file);
}

export async function extractRecordFiles(
  files: File[],
  onProgress: (message: string) => void = () => undefined
): Promise<string> {
  const problem = validateRecordFiles(files);
  if (problem) throw new Error(problem);

  const parts: string[] = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const prefix = files.length > 1 ? `File ${index + 1} of ${files.length}: ` : "";
    let text: string;
    try {
      text = isPdfFile(file)
        ? await extractPdf(file, (message) => onProgress(`${prefix}${message}`))
        : await extractImage(file, (message) => onProgress(`${prefix}${message}`));
    } catch (error) {
      if (error instanceof Error && /could not be read|could not be read in the browser/i.test(error.message)) {
        throw error;
      }
      throw new Error("The file could not be read. Use a JPG, PNG, or PDF.");
    }
    parts.push(files.length > 1 ? `${file.name}\n${text}` : text);
  }

  return joinExtractedParts(parts);
}
