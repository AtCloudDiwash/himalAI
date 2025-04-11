import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";
import ParticleNebula from "./../../components/spline/ParticleNebula";
// import { AuthContext } from "./../../context/AuthContext"; adjust path if needed - just in case

const LandingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = true; // adjust based on your setup

  const handleVaultClick = () => {
    if (isAuthenticated) {
      navigate("/addmemory");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className={styles.landingContainer}>
      <div className={styles.nebulaWrapper}>
        <ParticleNebula />
      </div>

      <nav className={styles.landingNav}>
        <h1 className={styles.logo}>Memory Vault</h1>
        <div className={styles.navLinks}>
          <a href="/signup" className={styles.btnNotGradient}>
            Signup
          </a>
          <a href="/login" className={styles.btnGradient}>
            Login
          </a>
        </div>
      </nav>

      <header className={styles.landingHero}>
        <div className={styles.heroContent}>
          <h2>Store Your Most Precious Memories Forever</h2>
          <p>
            Your moments, stored safely with AI and Blockchain technology.
            Anytime. Anywhere.
          </p>
          <div className={styles.heroButtons}>
            <button onClick={handleVaultClick} className={styles.btnGradient}>
              Try Vault Now!
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default LandingPage;
