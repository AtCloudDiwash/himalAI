import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./AddMemoryBlockchain.module.css";
import { useBlockchainContext } from "../../context/BlockchainContext";

// Pinata credentials from .env
const apiKey = import.meta.env.VITE_PINATA_API_KEY;
const secretKey = import.meta.env.VITE_PINATA_SECRET_KEY;

// Smart contract details
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const contractABI = [
  "function storeMemory(string memory title, string memory mediaHash) public",
  "function getMemories(address user) public view returns (string[] memory titles, string[] memory mediaHashes)",
];

const AddMemoryBlockchain = () => {
  const [title, setTitle] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false); // State for error message
  const navigate = useNavigate();
  const { blockchainMode } = useBlockchainContext();

  useEffect(() => {
    if (!blockchainMode) {
      navigate("/addmemory");
    }
  }, [blockchainMode, navigate]);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0]);
        } catch (error) {
          console.error("MetaMask error:", error);
          alert("Please connect to MetaMask.");
        }
      } else {
        alert("MetaMask is not installed.");
      }
    };
    connectWallet();
  }, []);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !mediaFile) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", mediaFile);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: apiKey,
            pinata_secret_api_key: secretKey,
          },
        }
      );

      const mediaHash = response.data.IpfsHash;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tx = await contract.storeMemory(title, mediaHash);
      await tx.wait();

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        navigate("/addblock");
      }, 1500); // 1.5 seconds
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setIsError(true); 

      setTimeout(() => {
        setIsError(false);
      }, 1500); 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.025, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const loaderVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const errorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  return (
    <div className={styles.addMemoryBlockchainWrapper}>
      <motion.div
        className={styles.addMemoryBlockchain}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Add Memory (Blockchain)
        </motion.h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <motion.input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="Enter memory title"
              required
              whileFocus={{ borderColor: "var(--color-primary1)" }}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="media" className={styles.label}>
              Add Media (Only single file)
            </label>
            <motion.label
              htmlFor="media"
              className={styles.uploadBtn}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span>Upload Media</span>
              <input
                type="file"
                id="media"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className={styles.hiddenInput}
              />
            </motion.label>
            {mediaFile && (
              <motion.p
                className={styles.fileName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Selected: {mediaFile.name}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={!account || isLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Add Memory
          </motion.button>
        </form>
      </motion.div>

      {isLoading && (
        <motion.div
          className={styles.loaderOverlay}
          variants={loaderVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.loaderSpinner}></div>
          <p>Confirming Transaction...</p>
        </motion.div>
      )}

      {isSuccess && (
        <motion.div
          className={styles.successMessage}
          variants={successVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p>Memory Stored Successfully!</p>
        </motion.div>
      )}

      {isError && (
        <motion.div
          className={styles.errorMessage}
          variants={errorVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p>Transaction Failed!</p>
        </motion.div>
      )}
    </div>
  );
};

export default AddMemoryBlockchain;
