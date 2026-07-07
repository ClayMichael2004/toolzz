import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">T</div>
        <div>
          <div className="brand-title">Toolzz</div>
          <p className="brand-copy">Premium AI workspace</p>
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
              Commit Generator
            </NavLink>
          </li>
          <li>
            <NavLink to="/error" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
              Error Explainer
            </NavLink>
          </li>
          <li>
            <NavLink to="/readme" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
              README Generator
            </NavLink>
          </li>
          <li>
            <NavLink to="/analyzer" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
              Project Analyzer
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;