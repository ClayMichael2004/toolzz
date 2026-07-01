import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import CommitPage from "./pages/CommitPage";
import ReadmePage from "./pages/ReadmePage";
import ErrorPage from "./pages/ErrorPage";

function App(){
  return (
    <BrowserRouter>
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<CommitPage/>}/>
        <Route path="/error" element={<ErrorPage/>}/>
        <Route path="/readme" element={<ReadmePage/>}/>
      </Routes>
      </DashboardLayout>
      </BrowserRouter>
  );
}

export default App;