import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import SignupMultiStep from "./Pages/SignupMultiStep";
import Login from "./Pages/Login";
import ProDashboard from "./Pages/ProDashboard";
import GoDashboard from "./Pages/GoDashboard";
import Client from "./Pages/Client";
import ProfilePage from "./Pages/ProfilePage";
import ProjectDetails from "./Components/ProjectDetails";
import AllProProjects from "./Pages/AllProProjects";
import Applied from "./Pages/Applied";
import YourProjects from "./Pages/YourProjects";
import AllGoProjects from "./Pages/AllGoProjects";
import ActiveGoProjects from "./Pages/ActiveGoProjects";
import CompletedTasks from "./Components/CompletedTasks";
import PendingConfirmation from "./Components/PendingConfirmation";
import ClosedProjects from "./Components/ClosedProjects";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupMultiStep />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pro" element={<ProDashboard />} />
        <Route path="/go" element={<GoDashboard />} />
        <Route path="/client" element={<Client />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/go-projects/:projectId"
          element={<ProjectDetails type="go" />}
        />
        <Route
          path="/pro-projects/:projectId"
          element={<ProjectDetails type="pro" />}
        />
        <Route path="/pro-projects" element={<AllProProjects />} />
        <Route path="/applied-projects" element={<Applied />} />
        <Route path="/your-projects" element={<YourProjects />} />
        <Route path="/all-go-projects" element={<AllGoProjects />} />
        <Route path="/active-go-projects" element={<ActiveGoProjects />} />
        <Route path="/completed-tasks" element={<CompletedTasks />} />
        <Route path="/pending-confirmation" element={<PendingConfirmation />} />
        <Route path="/closed-projects" element={<ClosedProjects />} />
      </Routes>
    </>
  );
}

export default App;
