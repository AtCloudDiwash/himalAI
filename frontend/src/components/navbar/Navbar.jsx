import styles from "./Navbar.module.css";
import sidePanelOpen from "./../../assets/navbar_assets/left_panel_open.svg";
import userDefaultAvatar from "./../../assets/navbar_assets/user_avatar_default.svg";
import Sidebar from "../sidebar/Sidebar";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
  
    navigate("/");
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.leftSection}>
          <div className={styles.toggleIcon} onClick={toggleSidebar}>
            <img src={sidePanelOpen} alt="panel open icon" />
          </div>
          <h1 className={styles.title} onClick={()=>navigate("/")}>MemoryVault</h1>
        </div>
        <div className={styles.rightSection}>
          
          <div className={styles.avatar}>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
      </AnimatePresence>
    </>
  );
}
