import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ModuleRow, { type ModuleEntry, type Pill } from "./ModuleRow";
import { setSelectedModuleId } from "../utils/selectedModule";

const MODULES: ModuleEntry[] = [
  {
    id: "7f3a9c2e-1b4d-4e8f-9a6c-2d5e8f1a4b7c",
    title: "Tailoring",
    icon: "pi pi-star-half",
    pills: [
      { id: "tailor-dashboard", label: "Tailor Dashboard", to: "/tailor-dashboard" },
      { id: "measurements", label: "Measurements", to: "/measurements" },
      { id: "costs", label: "Costs", to: "/costs" },
    ],
  },
  {
    id: "a2b4c6d8-e0f1-4a2b-8c3d-4e5f6a7b8c9d",
    title: "General Store",
    icon: "pi pi-shopping-bag",
    pills: [
      { id: "company", label: "Company", to: "/dashboard" },
      { id: "users", label: "Users", to: "/dashboard" },
      { id: "products", label: "Products", to: "/dashboard" },
      { id: "sales", label: "Sales", to: "/dashboard" },
      { id: "purchases", label: "Purchases", to: "/dashboard" },
      { id: "inventory", label: "Inventory", to: "/dashboard" },
      { id: "reports", label: "Reports", to: "/dashboard" },
      { id: "settings", label: "Settings", to: "/dashboard" },
    ],
  },
  {
    id: "b3c5d7e9-f1a2-4b3c-9d4e-5f6a7b8c9d0e",
    title: "Buyer",
    icon: "pi pi-id-card",
    pills: [{ id: "dash", label: "Dashboard", to: "/dashboard" }],
  },
  {
    id: "c4d6e8f0-a2b3-4c5d-0e5f-6a7b8c9d0e1f",
    title: "DSM",
    icon: "pi pi-chart-bar",
  },
  {
    id: "d5e7f9a1-b3c4-4d6e-1f6a-7b8c9d0e1f2a",
    title: "Executive Console",
    icon: "pi pi-briefcase",
    pills: [{ id: "dash", label: "Dashboard", to: "/dashboard" }],
  },
  {
    id: "e6f8a0b2-c4d5-4e7f-2a7b-8c9d0e1f2a3b",
    title: "File Management",
    icon: "pi pi-folder-open",
    pills: [
      { id: "all", label: "All Files" },
      { id: "recent", label: "Recent Folders" },
      { id: "deleted", label: "Deleted Files" },
    ],
  },
  {
    id: "f7a9b1c3-d5e6-4f8a-3b8c-9d0e1f2a3b4c",
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
    id: "08b0c2d4-e6f7-409b-4c9d-0e1f2a3b4c5d",
    title: "Sales",
    icon: "pi pi-chart-line",
    pills: [
      { id: "aps", label: "APS" },
      { id: "prospects", label: "Prospects" },
      { id: "calendar", label: "Calendar" },
    ],
  },
  {
    id: "19c1d3e5-f7a8-410c-5d0e-1f2a3b4c5d6e",
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
    id: "2ad2e4f6-a8b9-421d-6e1f-2a3b4c5d6e7f",
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
  const [activeModuleId, setActiveModuleId] = useState(MODULES[0]?.id ?? "");
  const [activePillByModule, setActivePillByModule] = useState<Record<string, string>>({});

  const handlePill = (moduleId: string, pill: Pill) => {
    setActiveModuleId(moduleId);
    setSelectedModuleId(moduleId);
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
