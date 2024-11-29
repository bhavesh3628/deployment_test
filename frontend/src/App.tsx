import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LeagueComponent from "./components/Pages/league/Leagues.js";
import { AppSidebar } from "./components/Pages/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Home } from "./components/Pages/Home";
import { EditionComponent } from "./components/Pages/edition/Edition.js";

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/league" element={<LeagueComponent />} />
          <Route path="/edition" element={<EditionComponent />} />
          <Route path="/franchise" element={<LeagueComponent />} />
          <Route path="/players" element={<LeagueComponent />} />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;
