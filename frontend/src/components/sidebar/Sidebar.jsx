import { motion } from "framer-motion";
import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import styles from "./Sidebar.module.css";
import sidePanelClose from "./../../assets/navbar_assets/left_panel_close.svg";
import addIcon from "./../../assets/more_icons/add_icon.svg";
import blockIcon from "./../../assets/more_icons/block_icon.svg";
import exploreIcon from "./../../assets/more_icons/explore_icon.svg";
import shareIcon from "./../../assets/more_icons/share_icon.svg";
import clockIcon from "./../../assets/more_icons/clock_icon.svg";
import { useBlockchainContext } from "../../context/BlockchainContext";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const contractABI = [
  {
    inputs: [{ name: "_user", type: "address" }],
    name: "getAllUserData",
    outputs: [
      {
        components: [
          { name: "ipfsHash", type: "string" },
          { name: "title", type: "string" },
          { name: "date", type: "string" },
          { name: "mvPoints", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_user", type: "address" }],
    name: "getTransactionCounter",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

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

const RecentMemories = memo(({ isBlockchainMode, navigate, transactions }) => (
  <div className={styles.sidebar__recent}>
    <span className={styles.sidebar__label}>
      {isBlockchainMode
        ? "Recent Transactions (0.002/step)"
        : "Recent Memories"}
    </span>
    <button
      className={styles.sidebar__seeAll}
      onClick={() => navigate(isBlockchainMode ? "/explore" : "/")}
    >
      See All
    </button>
  </div>
));

function Sidebar({ onClose }) {
  const {
    blockchainMode: isBlockchainMode,
    updateBlockchainMode: setIsBlockchainMode,
    account,
  } = useBlockchainContext();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts[0] && !account) {
        setError("Please update wallet in app");
      }
    } catch (err) {
      setError("Failed to connect wallet");
    }
  };

  const fetchRecentTransactions = async () => {
    if (!account || !isBlockchainMode) {
      setTransactions([]);
      setError(null);
      return;
    }

    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const data = await contract.getAllUserData(account);

      const recent = data
        .slice(-3)
        .reverse()
        .map((item, idx) => ({
          title: item.title,
          date: item.date,
          mvPoints: ethers.formatUnits(item.mvPoints, 0), // Whole number
          index: data.length - 1 - idx, // Store index for navigation
        }));

      setTransactions(recent);
      setError(null);
    } catch (err) {
      setError("Failed to fetch transactions");
      setTransactions([]);
    }
  };

  useEffect(() => {
    if (isBlockchainMode && !account) {
      connectWallet();
    } else {
      fetchRecentTransactions();
    }
  }, [account, isBlockchainMode]);

  const handleToggleStorage = () => {
    setIsBlockchainMode(!isBlockchainMode);
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

      {error && <p className={styles.sidebar__error}>{error}</p>}
      <RecentMemories
        isBlockchainMode={isBlockchainMode}
        navigate={navigate}
        transactions={transactions}
      />

      <div className={styles.sidebar__actions}>
        <button
          className={[styles.sidebar__actionBtn, styles.sidebar_explore].join(
            " "
          )}
          onClick={() => {isBlockchainMode? navigate("/explore"): navigate("/plainexplore")}}
        >
          <img src={exploreIcon} alt="explore icon" />
          Explore
        </button>
        {!isBlockchainMode && (
          <>
            <button
              className={styles.sidebar__actionBtn}
              onClick={() => navigate("/kriyana")}
            >
              <img src={clockIcon} alt="clock icon" />
              Use Chatbot
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
