import { NavLink } from "react-router-dom";
import { GitCommit, AlertOctagon, FileText, BarChart3, FolderTree } from "lucide-react";
import AgentSwitcher from "./AgentSwitcher.jsx";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Commit Generator", icon: GitCommit, end: true },
    { path: "/scaffold", label: "Folder Scaffolder", icon: FolderTree },
    { path: "/error", label: "Error Explainer", icon: AlertOctagon },
    { path: "/readme", label: "README Generator", icon: FileText },
    { path: "/analyzer", label: "Project Analyzer", icon: BarChart3 },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="brand-icon">T</div>
          <div>
            <div className="brand-title">Toolzz AI</div>
            <div className="brand-subtitle">Developer Suite</div>
          </div>
        </div>

        <nav>
          <ul className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <AgentSwitcher />
      </div>

      <div className="sidebar-footer">
        <div className="status-badge">
          <span className="status-dot"></span>
          <span>Multi-Agent Engine</span>
        </div>
        <span className="version-tag">v1.2</span>
      </div>
    </aside>
  );
};

export default Sidebar;