import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LeagueComponent from "./components/Pages/league/League.js";
import { AppSidebar } from "./components/Pages/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Home } from "./components/Pages/Home";
import EditionComponent from "./components/Pages/edition/Edition.js";
import { AuctionProvider } from "./components/Pages/AuctionProvider.js";
import FranchiseComponent from "./components/Pages/franchise/Franchise.js";

function App() {
  return (
    <AuctionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/league" element={<LeagueComponent />} />
            <Route path="/edition" element={<EditionComponent />} />
            <Route path="/franchise" element={<FranchiseComponent />} />
            <Route path="/players" element={<LeagueComponent />} />
          </Routes>
        </Router>
      </SidebarProvider>
    </AuctionProvider>
  );
}

export default App;
