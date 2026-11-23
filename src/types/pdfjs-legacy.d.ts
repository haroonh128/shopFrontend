declare module "pdfjs-dist/legacy/build/pdf" {
  export function getDocument(src: {
    data: Uint8Array;
    isEvalSupported?: boolean;
  }): {
    promise: Promise<{
      numPages: number;
      getPage: (pageNumber: number) => Promise<{
        getTextContent: () => Promise<{ items: Array<{ str?: string }> }>;
        getViewport: (params: { scale: number }) => { width: number; height: number };
        render: (params: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
        }) => { promise: Promise<void> };
      }>;
      destroy: () => Promise<void>;
    }>;
  };
}

declare module "pdfjs-dist/legacy/build/pdf.worker.entry";
