import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import type { FollowUpListItem } from "../models/clinic.models";
import { getFollowUps } from "../services/clinic.service";
import { whatsAppUrl } from "../../core/utils/phone";

function dateKey(value?: string | null): string | null {
  if (!value) return null;
  const key = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : null;
}

function todayKey(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function formatFollowUpDate(value?: string | null): string {
  const key = dateKey(value);
  if (!key) return "—";
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function followUpStatus(value?: string | null): { text: string; className: string } {
  const key = dateKey(value);
  if (!key) return { text: "No date", className: "text-slate-500" };
  const today = todayKey();
  if (key < today) return { text: "Overdue", className: "text-amber-700 font-semibold" };
  if (key === today) return { text: "Due today", className: "font-semibold" };
  return { text: "Upcoming", className: "text-slate-600" };
}

function doctorLabel(name?: string | null): string {
  const trimmed = (name || "").trim();
  if (!trimmed) return "your doctor";
  if (/^dr\.?\s/i.test(trimmed)) return trimmed;
  return `Dr ${trimmed}`;
}

function buildFollowUpMessage(item: FollowUpListItem): string {
  const reason = item.followUpNotes?.trim() || "a further visit";
  const when = dateKey(item.followUpDate) ? formatFollowUpDate(item.followUpDate) : "the advised date";
  return `Assalam o Alaikum ${item.patientName.trim()}, this is a reminder from ${doctorLabel(item.doctorName)}. Your follow-up (${reason}) was advised for ${when}. Please book an appointment at the clinic.`;
}

export default function FollowUpsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<FollowUpListItem[]>([]);
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [doctorLinked, setDoctorLinked] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<FollowUpListItem | null>(null);
  const [messageFor, setMessageFor] = useState<FollowUpListItem | null>(null);
  const [draft, setDraft] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getFollowUps();
      setItems(result?.items ?? []);
      setDoctorName(result?.doctorName ?? null);
      setDoctorLinked(result?.doctorLinked !== false);
      setNotice(result?.notice ?? null);
    } catch {
      setItems([]);
      setDoctorLinked(false);
      setNotice("Follow-ups could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openMessage = (item: FollowUpListItem) => {
    setMessageFor(item);
    setDraft(buildFollowUpMessage(item));
  };

  const openWhatsApp = () => {
    if (!messageFor) return;
    const url = whatsAppUrl(messageFor.contactNumber, draft.trim());
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const messageUrl = messageFor ? whatsAppUrl(messageFor.contactNumber, draft.trim()) : null;
  const heading = doctorName ? `Follow-ups · ${doctorLabel(doctorName)}` : "Follow-ups";

  return (
    <div className="card p-6 border-2 border-gray-300 rounded-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="text-sm text-slate-600 mt-1">
            Patients whose latest visit with you still needs a follow-up.
          </p>
        </div>
        <div className="text-sm text-slate-600">{loading ? "Loading..." : `${items.length} patient(s)`}</div>
      </div>

      {!loading && !doctorLinked && (
        <p className="mb-4 text-sm text-slate-700">{notice}</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">Patient</th>
              <th className="p-2">MR Number</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Follow-up date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">Loading follow-ups...</td>
              </tr>
            )}
            {!loading && doctorLinked && items.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">
                  No patients are waiting on a follow-up.
                </td>
              </tr>
            )}
            {!loading && !doctorLinked && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">No follow-ups to show.</td>
              </tr>
            )}
            {items.map((item) => {
              const status = followUpStatus(item.followUpDate);
              return (
                <tr key={item.consultationId} className="border-b hover:bg-slate-50">
                  <td className="p-2 font-semibold">{item.patientName}</td>
                  <td className="p-2">{item.patientMRNumber || "—"}</td>
                  <td className="p-2">{item.contactNumber || "—"}</td>
                  <td className="p-2">{formatFollowUpDate(item.followUpDate)}</td>
                  <td className={`p-2 ${status.className}`}>{status.text}</td>
                  <td className="p-2 max-w-xs truncate" title={item.followUpNotes || ""}>
                    {item.followUpNotes?.trim() || "—"}
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        label="Details"
                        className="form-button-secondary p-button-sm"
                        onClick={() => setDetails(item)}
                      />
                      <Button
                        type="button"
                        label="WhatsApp"
                        icon="pi pi-whatsapp"
                        className="form-button-primary p-button-sm"
                        onClick={() => openMessage(item)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog
        header={details ? details.patientName : "Follow-up"}
        visible={Boolean(details)}
        style={{ width: "40rem", maxWidth: "95vw" }}
        onHide={() => setDetails(null)}
        footer={
          details ? (
            <div className="flex flex-wrap justify-end gap-2">
              <Button label="Close" className="form-button-secondary" onClick={() => setDetails(null)} />
              <Button
                label="Open profile"
                className="form-button-secondary"
                onClick={() => navigate(`/clinic/patients/${details.patientId}?from=follow-ups`)}
              />
              <Button
                label="WhatsApp"
                icon="pi pi-whatsapp"
                className="form-button-primary"
                onClick={() => openMessage(details)}
              />
            </div>
          ) : null
        }
      >
        {details && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><span className="font-semibold">MR Number:</span> {details.patientMRNumber || "—"}</div>
              <div><span className="font-semibold">Phone:</span> {details.contactNumber || "—"}</div>
              <div><span className="font-semibold">Visit:</span> {formatFollowUpDate(details.visitDate)} · {details.visitNumber}</div>
              <div><span className="font-semibold">Follow-up date:</span> {formatFollowUpDate(details.followUpDate)}</div>
            </div>
            {details.allergies && (
              <div className="border border-amber-700 bg-amber-50 px-3 py-2 rounded">
                <span className="font-semibold">Allergies: </span>{details.allergies}
              </div>
            )}
            <div>
              <div className="font-semibold">Reason</div>
              <div className="whitespace-pre-wrap">{details.followUpNotes?.trim() || "—"}</div>
            </div>
            <div>
              <div className="font-semibold">Chief complaint</div>
              <div className="whitespace-pre-wrap">{details.chiefComplaint?.trim() || "—"}</div>
            </div>
            <div>
              <div className="font-semibold">Advice</div>
              <div className="whitespace-pre-wrap">{details.advice?.trim() || "—"}</div>
            </div>
            <div>
              <div className="font-semibold">Ordered tests</div>
              <div>{details.tests?.length ? details.tests.join(", ") : "—"}</div>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        header={messageFor ? `Message ${messageFor.patientName}` : "WhatsApp"}
        visible={Boolean(messageFor)}
        style={{ width: "36rem", maxWidth: "95vw" }}
        onHide={() => setMessageFor(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button label="Cancel" className="form-button-secondary" onClick={() => setMessageFor(null)} />
            <Button
              label="Open WhatsApp"
              icon="pi pi-whatsapp"
              className="form-button-primary"
              disabled={!messageUrl}
              onClick={openWhatsApp}
            />
          </div>
        }
      >
        {messageFor && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Check the message, change it if you need to, then open WhatsApp. It is sent only after you press send there.
              {" "}Number: {messageFor.contactNumber || "none on file"}.
            </p>
            {!messageUrl && (
              <p className="text-sm text-amber-800">
                This number cannot be opened in WhatsApp. Use a number starting with 03 or +92.
              </p>
            )}
            <InputTextarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={6}
              className="form-input w-full"
            />
          </div>
        )}
      </Dialog>
    </div>
  );
}
