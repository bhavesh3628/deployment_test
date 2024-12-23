import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LeagueComponent from "./components/Pages/League/League";
import { AppSidebar } from "./components/Pages/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Home } from "./components/Pages/Home";
import EditionComponent from "./components/Pages/Edition/edition";
import { AuctionProvider } from "./components/Pages/AuctionProvider.js";
import FranchiseComponent from "./components/Pages/franchise/Franchise.js";
import PlayerComponent from "./components/Pages/player/Player.js";
import PlayerApplicationList from "./components/Pages/application/player/applicationList.js";

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
            <Route path="/player" element={<PlayerComponent />} />
            <Route
              path="/playerApplicationList"
              element={<PlayerApplicationList />}
            />
          </Routes>
        </Router>
      </SidebarProvider>
    </AuctionProvider>
  );
}

export default App;
