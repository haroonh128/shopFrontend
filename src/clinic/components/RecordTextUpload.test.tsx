import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecordTextUpload from "./RecordTextUpload";
import { extractRecordFiles } from "../utils/extractRecordText";

jest.mock("../utils/extractRecordText", () => ({
  extractRecordFiles: jest.fn(),
}));

const extractRecordFilesMock = extractRecordFiles as jest.MockedFunction<typeof extractRecordFiles>;

describe("RecordTextUpload", () => {
  beforeEach(() => {
    extractRecordFilesMock.mockReset();
  });

  it("hides the text editor until a file is uploaded", () => {
    render(<RecordTextUpload />);

    expect(screen.queryByLabelText("Extracted text")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Upload paper record")).toBeInTheDocument();
  });

  it("shows the extracted text in an editor after a file is read", async () => {
    extractRecordFilesMock.mockResolvedValue("Fever for 3 days. Allergic to penicillin.");
    render(<RecordTextUpload />);

    const notes = new File(["page"], "record.jpg", { type: "image/jpeg" });
    await userEvent.upload(screen.getByLabelText("Upload paper record"), notes);

    expect(await screen.findByLabelText("Extracted text")).toHaveValue(
      "Fever for 3 days. Allergic to penicillin."
    );
    expect(extractRecordFilesMock).toHaveBeenCalledWith([notes], expect.any(Function));
  });

  it("keeps the editor hidden when the file has no readable text", async () => {
    extractRecordFilesMock.mockResolvedValue("   ");
    render(<RecordTextUpload />);

    await userEvent.upload(
      screen.getByLabelText("Upload paper record"),
      new File(["page"], "blank.jpg", { type: "image/jpeg" })
    );

    expect(await screen.findByText(/No text could be read/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Extracted text")).not.toBeInTheDocument();
  });
});
