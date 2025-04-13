import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./AddMemoryBlockchain.module.css";

const apiKey = import.meta.env.VITE_PINATA_API_KEY;
const secretKey = import.meta.env.VITE_PINATA_SECRET_KEY;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const contractABI = [
  {
    inputs: [
      { name: "_ipfsHash", type: "string" },
      { name: "_title", type: "string" },
      { name: "_date", type: "string" },
      { name: "_mvPoints", type: "uint256" },
    ],
    name: "storeData",
    outputs: [],
    stateMutability: "nonpayable",
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

const AddMemoryBlockchain = () => {
  const [title, setTitle] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [account, setAccount] = useState(null);
  const [counter, setCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const connectWallet = async () => {
      if (!window.ethereum) {
        alert("MetaMask is not installed");
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        // Fetch transaction counter
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );
        const counterValue = await contract.getTransactionCounter(accounts[0]);
        setCounter(ethers.formatUnits(counterValue, 18)); // Convert from 1e18 scale to decimal
      } catch (error) {
        alert("Failed to connect wallet");
      }
    };
    connectWallet();
  }, []);

  const handleMediaChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !mediaFile || !account) {
      alert("Please fill all fields and connect wallet");
      return;
    }

    setIsLoading(true);
    try {
      // Upload to Pinata
      const formData = new FormData();
      formData.append("file", mediaFile);
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: apiKey,
            pinata_secret_api_key: secretKey,
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
      const mvPoints = 0; // Default mvPoints, adjust as needed

      // Interact with contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tx = await contract.storeData(ipfsHash, title, timestamp, mvPoints);
      await tx.wait();

      // Update counter
      const newCounter = await contract.getTransactionCounter(account);
      setCounter(ethers.formatUnits(newCounter, 18));

      setIsSuccess(true);
      setTimeout(() => navigate("/addblock"), 1500);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setTimeout(() => setIsError(false), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonVariants = {
    hover: { scale: 1.025, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className={styles.addMemoryBlockchainWrapper}>
      <motion.div
        className={styles.addMemoryBlockchain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className={styles.title}>Add Memory</h1>
        <p className={styles.counter}>Transaction Counter: {counter}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="Enter memory title"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="media" className={styles.label}>
              Add Media (Single file)
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
            {mediaFile && <p className={styles.fileName}>{mediaFile.name}</p>}
          </div>
          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || !account}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className={styles.loaderSpinner}></div>
          <p>Confirming Transaction...</p>
        </motion.div>
      )}
      {isSuccess && (
        <motion.div
          className={styles.successMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Memory Stored!
        </motion.div>
      )}
      {isError && (
        <motion.div
          className={styles.errorMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Transaction Failed!
        </motion.div>
      )}
    </div>
  );
};

export default AddMemoryBlockchain;
