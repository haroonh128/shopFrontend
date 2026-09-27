import type { Doctor, Practice } from "../models/clinic.models";

type Props = {
  practice?: Practice | null;
  doctor?: Doctor | null;
};

export default function MedicalDocumentHeader({ practice, doctor }: Props) {
  return (
    <header className="text-center mb-2">
      {practice?.name && <div className="text-xl font-bold tracking-wide uppercase">{practice.name}</div>}
      {practice && (
        <div className="text-xs text-slate-700 mt-1">
          {[practice.address, practice.phone, practice.email, practice.website].filter(Boolean).join(" · ")}
        </div>
      )}
      <div className="my-3 border-t border-black" />
      {doctor && (
        <div>
          <div className="text-2xl font-bold uppercase">{doctor.fullName}</div>
          {doctor.qualifications && <div className="text-sm">{doctor.qualifications}</div>}
          {doctor.specialization && <div className="text-sm font-semibold">{doctor.specialization}</div>}
          <div className="text-xs mt-1">
            {[doctor.registrationNumber && `Reg: ${doctor.registrationNumber}`, doctor.phone, doctor.email]
              .filter(Boolean)
              .join(" · ")}
          </div>
          {doctor.address && <div className="text-xs">{doctor.address}</div>}
        </div>
      )}
    </header>
  );
}
