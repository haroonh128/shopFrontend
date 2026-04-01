import MenuList from "./MenuList";

export default function Sidebar() {
  return (
    <>
<nav className="pc-sidebar">
  <div className="navbar-wrapper">
    <div className="m-header flex items-center py-4 px-6 h-header-height">
      <a href="../dashboard/index.html" className="b-brand flex items-center gap-3">
        <img src="/images/logo-white.svg" className="img-fluid logo logo-lg" alt="logo" />
        <img src="/images/favicon.svg" className="img-fluid logo logo-sm" alt="logo" />
      </a>
    </div>
    <div className="navbar-content h-[calc(100vh_-_74px)] py-2.5">
      <ul className="pc-navbar">
        {/* @@include('./menu-list.html') */}
        <MenuList />
      </ul>
    </div>
  </div>
</nav>
</>
  );
}