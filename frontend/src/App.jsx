import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import CommitPage from "./pages/CommitPage";
import ScaffoldPage from "./pages/ScaffoldPage";
import ReadmePage from "./pages/ReadmePage";
import ErrorPage from "./pages/ErrorPage";
import AnalyzerPage from "./pages/AnalyzerPage";

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<CommitPage />} />
          <Route path="/scaffold" element={<ScaffoldPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/readme" element={<ReadmePage />} />
          <Route path="/analyzer" element={<AnalyzerPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;