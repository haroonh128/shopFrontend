import MenuList from "./MenuList";

interface SidebarProps {
  collapsed?: boolean;
  mobileActive?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ collapsed, mobileActive, onCloseMobile }: SidebarProps) {
  return (
    <>
      <nav
        className={`pc-sidebar${collapsed ? " pc-sidebar-mini" : ""}${
          mobileActive ? " mob-sidebar-active" : ""
        }`}
      >
        <div className="navbar-wrapper">
          <div className="m-header flex items-center py-4 px-6 h-header-height">
            <a href="/modules" className="b-brand flex items-center gap-3">
              <img src="/images/logo-white.svg" className="img-fluid logo logo-lg" alt="logo" />
              <img src="/images/favicon.svg" className="img-fluid logo logo-sm" alt="logo" />
            </a>
          </div>
          <div className="navbar-content h-[calc(100vh_-_74px)] py-2.5">
            <ul className="pc-navbar">
              <MenuList />
            </ul>
          </div>
        </div>
        {mobileActive && (
          <div className="pc-menu-overlay lg:hidden" onClick={onCloseMobile}></div>
        )}
      </nav>
    </>
  );
}
