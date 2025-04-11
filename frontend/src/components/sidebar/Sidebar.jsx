

import { motion } from "framer-motion";
import { memo, useState } from "react"; // Added useState
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import sidePanelClose from "./../../assets/navbar_assets/left_panel_close.svg";
import addIcon from "./../../assets/more_icons/add_icon.svg";
import blockIcon from "./../../assets/more_icons/block_icon.svg";
import exploreIcon from "./../../assets/more_icons/explore_icon.svg";
import shareIcon from "./../../assets/more_icons/share_button.svg";
import clockIcon from "./../../assets/more_icons/clock_icon.svg";


const sidebarVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};


const RecentMemories = memo(() => (
  <div className={styles.sidebar__recent}>
    <span className={styles.sidebar__label}>Recent Memories</span>
    <div className={styles.sidebar__memoryList}>
      {[1, 2, 3].map((_, index) => (
        <div key={index} className={styles.sidebar__memoryItem}>
          <p className={styles.sidebar__memoryTitle}>Memory Title</p>
          <p className={styles.sidebar__memoryDate}>Mar 29, 2025</p>
        </div>
      ))}
    </div>
    <a href="#" className={styles.sidebar__seeAll}>
      See All
    </a>
  </div>
));

const RecentTransactions = memo(() => (
  <div className={styles.sidebar__recent}>
    <span className={styles.sidebar__label}>Recent Transactions</span>
    <div className={styles.sidebar__memoryList}>
      {[1, 2, 3].map((_, index) => (
        <div key={index} className={styles.sidebar__memoryItem}>
          <p className={styles.sidebar__memoryTitle}>
            Transaction #{index + 1}
          </p>
          <p className={styles.sidebar__memoryDate}>Mar 29, 2025</p>
        </div>
      ))}
    </div>
    <a href="#" className={styles.sidebar__seeAll}>
      See All
    </a>
  </div>
));

function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const [isBlockchainMode, setIsBlockchainMode] = useState(false); 

  const handleToggleStorage = () => {
    setIsBlockchainMode((prev) => !prev);
    navigate('/');
  };

  

  return (
    <motion.aside
      className={styles.sidebar}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={sidebarVariants}
    >

      <div className={styles.sidebar__top}>
        <img
          src={sidePanelClose}
          alt="Close sidebar"
          className={styles.sidebar__close}
          onClick={onClose}
        />
        <button className={styles.sidebar__searchBtn}>Search</button>
      </div>

      <div className={styles.sidebar__add}>
        <button
          className={styles.sidebar__addBtn}
          onClick={() => navigate("/addmemory")}
        >
          <img src={addIcon} alt="plus icon" />
          Add Your Memory
        </button>
      </div>


      {isBlockchainMode ? <RecentTransactions /> : <RecentMemories />}

      <div className={styles.sidebar__actions}>
        <button
          className={[styles.sidebar__actionBtn, styles.sidebar_explore].join(
            " "
          )}
        >
          <img src={exploreIcon} alt="explore icon" />
          Explore Memories
        </button>
        {!isBlockchainMode && (
          <>
            <button className={styles.sidebar__actionBtn}>
              <img src={clockIcon} alt="clock icon" />
              Memory Lane
            </button>
            <button className={styles.sidebar__actionBtn}>
              <img src={shareIcon} alt="share icon" />
              Share Your Lane
            </button>
          </>
        )}
      </div>

    
      <div className={styles.sidebar__footer}>
        <button
          className={styles.sidebar__blockchainBtn}
          onClick={handleToggleStorage}
        >
          <img src={blockIcon} alt="block icon" />
          {isBlockchainMode
            ? "Switch to Normal Storage"
            : "Switch to Blockchain Storage"}
        </button>
      </div>
    </motion.aside>
  );
}

export default memo(Sidebar);
