import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ModuleRow, { type ModuleEntry, type Pill } from "./ModuleRow";

const MODULES: ModuleEntry[] = [
  { id: "accounting", title: "Accounting", icon: "pi pi-wallet" },
  {
    id: "administration",
    title: "Administration",
    icon: "pi pi-user-edit",
    pills: [
      { id: "users", label: "User Management", to: "/dashboard" },
      { id: "activity", label: "Activity Tracker" },
      { id: "login-report", label: "Login Activity Report" },
      { id: "email", label: "Email Workflow" },
    ],
  },
  {
    id: "buyer",
    title: "Buyer",
    icon: "pi pi-id-card",
    pills: [{ id: "dash", label: "Dashboard", to: "/dashboard" }],
  },
  { id: "dsm", title: "DSM", icon: "pi pi-chart-bar" },
  {
    id: "executive",
    title: "Executive Console",
    icon: "pi pi-briefcase",
    pills: [{ id: "dash", label: "Dashboard", to: "/dashboard" }],
  },
  {
    id: "files",
    title: "File Management",
    icon: "pi pi-folder-open",
    pills: [
      { id: "all", label: "All Files" },
      { id: "recent", label: "Recent Folders" },
      { id: "deleted", label: "Deleted Files" },
    ],
  },
  {
    id: "home-building",
    title: "Home Building",
    icon: "pi pi-home",
    pills: [
      { id: "projects", label: "Projects" },
      { id: "lots", label: "Lots", to: "/dashboard" },
      { id: "template-doc", label: "Template Document" },
      { id: "products", label: "Products" },
      { id: "takeoff", label: "Sales Takeoff" },
    ],
  },
  {
    id: "sales",
    title: "Sales",
    icon: "pi pi-chart-line",
    pills: [
      { id: "aps", label: "APS" },
      { id: "prospects", label: "Prospects" },
      { id: "calendar", label: "Calendar" },
    ],
  },
  {
    id: "scheduler",
    title: "Scheduler",
    icon: "pi pi-calendar",
    pills: [
      { id: "import", label: "Tasks Import" },
      { id: "create", label: "Create Schedule" },
      { id: "project-sched", label: "Create Project Schedule" },
      { id: "schedule-lots", label: "Schedule Lots" },
    ],
  },
  {
    id: "warranty",
    title: "Warranty",
    icon: "pi pi-shield",
    pills: [
      { id: "wo", label: "Work Order Management" },
      { id: "w-sched", label: "Warranty Scheduler" },
      { id: "categories", label: "Categories" },
    ],
  },
];

export default function Modules() {
  const navigate = useNavigate();
  const [activeModuleId, setActiveModuleId] = useState("home-building");
  const [activePillByModule, setActivePillByModule] = useState<
    Record<string, string>
  >({
    "home-building": "lots",
  });

  const handlePill = (moduleId: string, pill: Pill) => {
    setActiveModuleId(moduleId);
    setActivePillByModule((prev) => ({ ...prev, [moduleId]: pill.id }));
    if (pill.to) navigate(pill.to);
  };

  return (
    <div className="mx-auto max-w-6xl px-3 py-2 sm:px-6 sm:py-4 md:px-10 lg:px-14 xl:px-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => (
          <ModuleRow
            key={m.id}
            entry={m}
            isActive={activeModuleId === m.id}
            activePillId={activePillByModule[m.id] ?? null}
            onActivate={() => setActiveModuleId(m.id)}
            onPill={(pill) => handlePill(m.id, pill)}
          />
        ))}
      </div>
    </div>
  );
}
