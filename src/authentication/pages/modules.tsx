import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks";
import { getModuleHomePath, getVisibleModules } from "../config/modules";
import ModuleRow, { type Pill } from "./ModuleRow";
import { setSelectedModuleId } from "../utils/selectedModule";

export default function Modules() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const visibleModules = useMemo(() => getVisibleModules(user), [user]);

  useEffect(() => {
    if (visibleModules.length !== 1) return;
    const only = visibleModules[0];
    setSelectedModuleId(only.id);
    const home = getModuleHomePath(only);
    if (home) navigate(home, { replace: true });
  }, [visibleModules, navigate]);

  const [activeModuleId, setActiveModuleId] = useState(
    visibleModules[0]?.id ?? ""
  );
  const [activePillByModule, setActivePillByModule] = useState<
    Record<string, string>
  >({});

  const handlePill = (moduleId: string, pill: Pill) => {
    setActiveModuleId(moduleId);
    setSelectedModuleId(moduleId);
    setActivePillByModule((prev) => ({ ...prev, [moduleId]: pill.id }));
    if (pill.to) navigate(pill.to);
  };

  if (visibleModules.length === 1) return null;

  return (
    <div className="mx-auto max-w-6xl px-3 py-2 sm:px-6 sm:py-4 md:px-10 lg:px-14 xl:px-16">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0d7a68]">Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold">Where would you like to work?</h1>
        <p className="mt-1 text-sm text-theme-secondarytextcolor dark:text-themedark-secondarytextcolor">
          Open a module and continue from the last place you left it.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleModules.map((m) => (
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
