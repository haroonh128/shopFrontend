import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hooks";
import {
  ADMIN_MODULE_ID,
  findModuleById,
  findModuleByPath,
  getModuleNavItems,
  isAdminFromAuth,
} from "../../authentication/config/modules";
import {
  getSelectedModuleId,
  setSelectedModuleId,
} from "../../authentication/utils/selectedModule";

function isActivePath(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function MenuList() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const selectedId = getSelectedModuleId();
  const selectedModule = findModuleById(selectedId);
  const pathModule = findModuleByPath(pathname);
  const isAdmin = isAdminFromAuth(user);

  // Prefer the selected module; fall back to path when selection is missing/stale.
  const activeModule =
    selectedModule && getModuleNavItems(selectedModule).length > 0
      ? selectedModule
      : pathModule ?? selectedModule;

  const navItems = getModuleNavItems(activeModule).filter((item) => {
    if (activeModule?.id === ADMIN_MODULE_ID) return isAdmin;
    return true;
  });

  useEffect(() => {
    if (!selectedId && pathModule) {
      setSelectedModuleId(pathModule.id);
    }
  }, [selectedId, pathModule]);

  return (
    <>
      <li className="pc-item">
        <NavLink to="/modules" className="pc-link">
          <span className="pc-micon">
            <i className="pi pi-th-large" />
          </span>
          <span className="pc-mtext">All Modules</span>
        </NavLink>
      </li>

      {activeModule ? (
        <li className="pc-item pc-caption">
          <label>{activeModule.title}</label>
          <i className={activeModule.icon} />
        </li>
      ) : (
        <li className="pc-item pc-caption">
          <label>Navigation</label>
        </li>
      )}

      {navItems.length === 0 ? (
        <li className="pc-item">
          <span className="pc-link text-slate-400 cursor-default">
            <span className="pc-mtext">No pages for this module</span>
          </span>
        </li>
      ) : (
        navItems.map((item) => (
          <li
            key={item.id}
            className={`pc-item${isActivePath(pathname, item.to!) ? " active" : ""}`}
          >
            <NavLink
              to={item.to!}
              className={({ isActive }) =>
                `pc-link${isActive || isActivePath(pathname, item.to!) ? " active" : ""}`
              }
            >
              <span className="pc-micon">
                <i className={item.icon ?? activeModule?.icon ?? "pi pi-circle"} />
              </span>
              <span className="pc-mtext">{item.label}</span>
            </NavLink>
          </li>
        ))
      )}
    </>
  );
}
