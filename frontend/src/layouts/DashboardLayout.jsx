import Sidebar from "../components/Sidebar.jsx";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
};

export default DashboardLayout;