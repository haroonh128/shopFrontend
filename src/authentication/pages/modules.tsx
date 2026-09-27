import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks";
import { ADMIN_MODULE_ID, MODULES, isAdminFromAuth } from "../config/modules";
import ModuleRow, { type Pill } from "./ModuleRow";
import { setSelectedModuleId } from "../utils/selectedModule";

export default function Modules() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = isAdminFromAuth(user);

  const visibleModules = useMemo(() => {
    const productModules = MODULES.filter((m) => m.id !== ADMIN_MODULE_ID);
    const scoped = user?.moduleId
      ? productModules.filter((m) => m.id === user.moduleId)
      : productModules;

    if (isAdmin) {
      const adminModule = MODULES.find((m) => m.id === ADMIN_MODULE_ID);
      return adminModule ? [...scoped, adminModule] : scoped;
    }

    return scoped;
  }, [user?.moduleId, isAdmin]);

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

  return (
    <div className="mx-auto max-w-6xl px-3 py-2 sm:px-6 sm:py-4 md:px-10 lg:px-14 xl:px-16">
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
