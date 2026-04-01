import React from 'react'

export default function MenuList() {
  return (
    <>
<li className="pc-item pc-caption">
  <label>Navigation</label>
</li>
<li className="pc-item">
<li className="pc-item">
  <a href="/dashboard" className="pc-link">
    <span className="pc-micon">
      <i data-feather="home"></i>
    </span>
    <span className="pc-mtext">Dashboard</span>
  </a>
</li>
<li className="pc-item pc-caption">
  <label>UI Components</label>
  <i data-feather="feather"></i>
</li>
<li className="pc-item pc-hasmenu">
  <a href="../elements/bc_color.html" className="pc-link">
    <span className="pc-micon"> <i data-feather="edit"></i></span>
    <span className="pc-mtext">Color</span>
  </a>
</li>
<li className="pc-item pc-hasmenu">
  <a href="../elements/bc_typography.html" className="pc-link">
    <span className="pc-micon"> <i data-feather="type"></i></span>
    <span className="pc-mtext">Typography</span>
  </a>
</li>
<li className="pc-item pc-hasmenu">
  <a href="../elements/icon-feather.html" className="pc-link">
    <span className="pc-micon"> <i data-feather="feather"></i></span>
    <span className="pc-mtext">Icons</span>
  </a>
</li>

<li className="pc-item pc-caption">
  <label>Pages</label>
  <i data-feather="monitor"></i>
</li>
<li className="pc-item pc-hasmenu">
  <a href="../pages/login-v1.html" className="pc-link" target="_blank">
    <span className="pc-micon"> <i data-feather="lock"></i></span>
    <span className="pc-mtext">Login</span>
  </a>
</li>
<li className="pc-item pc-hasmenu">
  <a href="../pages/register-v1.html" className="pc-link" target="_blank">
    <span className="pc-micon"> <i data-feather="user-plus"></i></span>
    <span className="pc-mtext">Register</span>
  </a>
</li>
<li className="pc-item pc-caption">
  <label>Other</label>
  <i data-feather="sidebar"></i>
</li>
<li className="pc-item pc-hasmenu">
  <a href="#!" className="pc-link"><span className="pc-micon"> <i data-feather="align-right"></i> </span><span
      className="pc-mtext">Menu levels</span><span className="pc-arrow"><i className="ti ti-chevron-right"></i></span></a>
  <ul className="pc-submenu">
    <li className="pc-item"><a className="pc-link" href="#!">Level 2.1</a></li>
    <li className="pc-item pc-hasmenu">
      <a href="#!" className="pc-link">Level 2.2<span className="pc-arrow"><i className="ti ti-chevron-right"></i></span></a>
      <ul className="pc-submenu">
        <li className="pc-item"><a className="pc-link" href="#!">Level 3.1</a></li>
        <li className="pc-item"><a className="pc-link" href="#!">Level 3.2</a></li>
        <li className="pc-item pc-hasmenu">
          <a href="#!" className="pc-link">Level 3.3<span className="pc-arrow"><i className="ti ti-chevron-right"></i></span></a>
          <ul className="pc-submenu">
            <li className="pc-item"><a className="pc-link" href="#!">Level 4.1</a></li>
            <li className="pc-item"><a className="pc-link" href="#!">Level 4.2</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li className="pc-item pc-hasmenu">
      <a href="#!" className="pc-link">Level 2.3<span className="pc-arrow"><i className="ti ti-chevron-right"></i></span></a>
      <ul className="pc-submenu">
        <li className="pc-item"><a className="pc-link" href="#!">Level 3.1</a></li>
        <li className="pc-item"><a className="pc-link" href="#!">Level 3.2</a></li>
        <li className="pc-item pc-hasmenu">
          <a href="#!" className="pc-link">Level 3.3<span className="pc-arrow"><i className="ti ti-chevron-right"></i></span></a>
          <ul className="pc-submenu">
            <li className="pc-item"><a className="pc-link" href="#!">Level 4.1</a></li>
            <li className="pc-item"><a className="pc-link" href="#!">Level 4.2</a></li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</li>
<li className="pc-item">
  <a href="../other/sample-page.html" className="pc-link">
    <span className="pc-micon">
      <i data-feather="sidebar"></i>
    </span>
    <span className="pc-mtext">Sample page</span>
  </a>
</li> 

    </li>
    
    </>
);
}   