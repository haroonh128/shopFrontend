import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }: any) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);

  return (
    <div className="bg-theme-bodybg dark:bg-themedark-bodybg min-h-screen text-theme-bodycolor dark:text-themedark-bodycolor">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileActive={mobileActive}
        onCloseMobile={() => setMobileActive(false)}
      />
      <Header
        onToggleDesktop={() => setSidebarCollapsed((v) => !v)}
        onToggleMobile={() => setMobileActive((v) => !v)}
      />
      <main className="pc-container">
        <div className="pc-content">
          {children}
        </div>
      </main>
    </div>
  );
}
