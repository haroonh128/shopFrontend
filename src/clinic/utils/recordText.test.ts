import { hasReadableText, joinExtractedParts, validateRecordFiles } from "./recordText";

function file(name: string, type: string, size = 100): File {
  const contents = new Uint8Array(size);
  return new File([contents], name, { type });
}

describe("record text upload rules", () => {
  it("rejects an empty selection", () => {
    expect(validateRecordFiles([])).toBe("Choose a photo or PDF to read.");
  });

  it("rejects unsupported files", () => {
    expect(validateRecordFiles([file("notes.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")])).toMatch(/JPG, PNG/);
  });

  it("accepts a photo and a pdf", () => {
    expect(validateRecordFiles([file("page.jpg", "image/jpeg"), file("scan.pdf", "application/pdf")])).toBeNull();
  });

  it("rejects more than 10 files and files over 20 MB", () => {
    const many = Array.from({ length: 11 }, (_, index) => file(`page-${index}.jpg`, "image/jpeg"));
    expect(validateRecordFiles(many)).toMatch(/10 files/);
    expect(validateRecordFiles([file("huge.png", "image/png", 20 * 1024 * 1024 + 1)])).toMatch(/20 MB/);
  });

  it("treats a short OCR fragment as unreadable and keeps real sentences", () => {
    expect(hasReadableText("a b")).toBe(false);
    expect(hasReadableText("Patient complained of fever for three days.")).toBe(true);
  });

  it("joins page text and drops blank pages", () => {
    expect(joinExtractedParts(["  Fever  ", "   ", "Cough"])).toBe("Fever\n\nCough");
  });
});
