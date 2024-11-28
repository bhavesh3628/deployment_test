import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import League from "./components/Pages/League/league.js";
import { AppSidebar } from "./components/Pages/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Home } from "./components/Pages/Home";

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/league" element={<League />} />
          <Route path="/edition" element={<League />} />
          <Route path="/franchise" element={<League />} />
          <Route path="/players" element={<League />} />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;
