import { useRef, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { extractRecordFiles } from "../utils/extractRecordText";

export default function RecordTextUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);

  const onFiles = async (list: FileList | null) => {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;

    setError(null);
    setText(null);
    setReading(true);
    setStatus("Reading the document...");
    try {
      const extracted = await extractRecordFiles(files, setStatus);
      if (!extracted.trim()) {
        setError("No text could be read. Use a clearer photo, or a PDF with visible writing.");
        return;
      }
      setText(extracted);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The file could not be read.");
    } finally {
      setReading(false);
      setStatus(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <section className="mb-5 border border-gray-300 rounded-md p-4">
      <h2 className="text-lg font-semibold mb-1">Paper record</h2>
      <p className="text-sm text-slate-600 mb-3">
        Upload a photo or PDF of the old notes. The file is not saved. Copy the text into the fields below.
        Printed text reads more reliably than handwriting, so check the wording before you paste it.
      </p>
      <input
        ref={inputRef}
        type="file"
        aria-label="Upload paper record"
        accept="image/jpeg,image/png,image/webp,image/bmp,image/gif,application/pdf,.pdf"
        multiple
        disabled={reading}
        className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-500 file:px-3 file:py-1.5 file:text-sm file:text-white"
        onChange={(event) => {
          void onFiles(event.target.files);
        }}
      />
      {reading && <p className="text-sm text-slate-500 mt-2">{status || "Reading the document..."}</p>}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {text !== null && (
        <div className="mt-3">
          <label className="form-input-label" htmlFor="extracted-record-text">
            Extracted text
          </label>
          <p className="text-sm text-slate-500 mb-2">
            Select what you need and paste it into the matching field. You can edit this text first. It stays on this screen only.
          </p>
          <InputTextarea
            id="extracted-record-text"
            value={text}
            rows={12}
            className="form-input w-full"
            onChange={(event) => setText(event.target.value)}
          />
        </div>
      )}
    </section>
  );
}
