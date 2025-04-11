import styles from "./Dashboard.module.css";
import FloatingBlob from "../components/floatingBlob/FloatingBlob";
import Navbar from "../components/navbar/Navbar";
import ParticleNebula from "../components/spline/ParticleNebula";
import AddMemory from "./AddMemory";
import ExploreMemories from "./ExploreMemories";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./landingPage/LandingPage";
import Signup from "./signup/Signup";
import Login from "./login/Login";

export default function Dashboard() {
  const location = useLocation();
  const hideNavbarRoutes = ["/landing", "/signup", "/login"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className={styles.wrapper}>
      {/* Only show navbar if NOT on landing or signup */}
      {!shouldHideNavbar && <Navbar />}

      {/* Floating blobs (keep if you want these globally) */}
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
        <Route path="/" element={<ParticleNebula />} />
        <Route path="/addmemory" element={<AddMemory />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
