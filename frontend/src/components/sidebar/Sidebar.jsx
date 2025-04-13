import { motion } from "framer-motion";
import { memo, useState } from "react"; // Added useState
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; // Import useEffect and useState
import { fetchRecentMemories } from "./RecentMemoriesapi";
import styles from "./Sidebar.module.css";
import sidePanelClose from "./../../assets/navbar_assets/left_panel_close.svg";
import addIcon from "./../../assets/more_icons/add_icon.svg";
import blockIcon from "./../../assets/more_icons/block_icon.svg";
import exploreIcon from "./../../assets/more_icons/explore_icon.svg";
import shareIcon from "./../../assets/more_icons/share_button.svg";
import clockIcon from "./../../assets/more_icons/clock_icon.svg";
import { useBlockchainContext } from "../../context/BlockchainContext";

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

const RecentMemories = memo(({ isBlockchainMode, navigate }) => {
  const [recentMemories, setRecentMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecentMemories = async () => {
      try {
        const memories = await fetchRecentMemories();
        setRecentMemories(memories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecentMemories();
  }, []);

  if (loading) return <p>Loading recent memories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.sidebar__recent}>
      <span className={styles.sidebar__label}>Recent Memories</span>
      <div className={styles.sidebar__memoryList}>
        {recentMemories.map((memory) => (
          <div key={memory._id} className={styles.sidebar__memoryItem}>
            <p className={styles.sidebar__memoryTitle}>{memory.title}</p>
            <p className={styles.sidebar__memoryDate}>
              {new Date(memory.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <button
        className={styles.sidebar__seeAll}
        onClick={() => navigate("/explore")}
      >
        See All
      </button>
    </div>
  );
});

function Sidebar({ onClose }) {
  const {
    blockchainMode: isBlockchainMode,
    updateBlockchainMode: setIsBlockchainMode,
  } = useBlockchainContext();

  const navigate = useNavigate();

  const handleToggleStorage = () => {
    setIsBlockchainMode(); // Call the context function directly
    navigate("/addblock");
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
          onClick={() =>
            !isBlockchainMode ? navigate("/addmemory") : navigate("/addblock")
          }
        >
          <img src={addIcon} alt="plus icon" />
          Add Your Memory
        </button>
      </div>

      <RecentMemories isBlockchainMode={isBlockchainMode} navigate={navigate} />

      <div className={styles.sidebar__actions}>
        <button
          className={[styles.sidebar__actionBtn, styles.sidebar_explore].join(
            " "
          )}
          onClick={() => {
            navigate("/explore");
          }}
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
