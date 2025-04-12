import styles from "./Dashboard.module.css";
import FloatingBlob from "../components/floatingBlob/FloatingBlob";
import Navbar from "../components/navbar/Navbar";
import ParticleNebula from "../components/spline/ParticleNebula";
import AddMemory from "./normalStorage/AddMemory";
import ExploreMemories from "./ExploreMemories";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import Signup from "./signup/Signup";
import Login from "./login/Login";
import AddMemoryBlockChain from "./blockchain/AddMemoryBlockChain";
import BlockMemoriesFetch from "./../feature/BlockMemoriesFetch";
import { useBlockchainContext } from "../context/BlockchainContext"; // 👈 import your context

export default function Dashboard() {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/signup", "/login"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const { blockchainMode } = useBlockchainContext(); 

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className={styles.wrapper}>
      {!shouldHideNavbar && <Navbar />}

      {/* Floating blobs */}
      <FloatingBlob
        top="0%"
        left="80%"
        delay={0}
        size="300px"
        backgroundColor="#6B88FF"
      />
      <FloatingBlob
        top="65%"
        left="70%"
        delay={2}
        size="220px"
        backgroundColor="#6B88FF"
      />
      <FloatingBlob
        top="70%"
        left="-5%"
        delay={2}
        size="350px"
        backgroundColor="#EC36C4"
      />

      <Routes>
        <Route
          path="/addmemory"
          element={
            <ProtectedRoute>
              {blockchainMode ? <AddMemoryBlockChain /> : <AddMemory />}
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addblock" element={<AddMemoryBlockChain />} />
        <Route path="/explore" element={<BlockMemoriesFetch/>} />
      </Routes>
    </div>
  );
}
