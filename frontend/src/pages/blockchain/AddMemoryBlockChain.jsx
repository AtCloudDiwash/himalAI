import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import styles from "./AddMemoryBlockchain.module.css";
import { useBlockchainContext } from "../../context/BlockchainContext";

const apiKey = import.meta.env.VITE_PINATA_API_KEY;
const secretKey = import.meta.env.VITE_PINATA_SECRET_KEY;

// Pinata IPFS client setup
const ipfs = create({
  host: "api.pinata.cloud",
  port: 443,
  protocol: "https",
  headers: {
    pinata_api_key: apiKey,
    pinata_secret_api_key: secretKey,
  },
});

// Smart contract details
const contractAddress = "0x406AB5033423Dcb6391Ac9eEEad73294FA82Cfbc"; 
const contractABI = [
  "function storeMemory(string memory title, string memory mediaHash) public",
  "function getMemories(address user) public view returns (string[] memory titles, string[] memory mediaHashes)",
];

const AddMemoryBlockchain = () => {
  const [title, setTitle] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const { blockchainMode } = useBlockchainContext();

  // Redirect if not in blockchain mode
  useEffect(() => {
    if (!blockchainMode) {
      navigate("/addmemory");
    }
  }, [blockchainMode, navigate]);

  // Connect to MetaMask
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
          alert("Please connect to MetaMask");
        }
      } else {
        alert(
          "MetaMask is not installed. Please install it to use blockchain storage."
        );
      }
    };
    connectWallet();
  }, []);

  // Handle media file selection (single file)
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please enter a title.");
      return;
    }
    if (!mediaFile) {
      alert("Please upload a media file.");
      return;
    }

    try {
      // Upload the media file to IPFS via Pinata
      const mediaResult = await ipfs.add(mediaFile);
      const mediaHash = mediaResult.path;

      // Store the title and IPFS hash on Ethereum
      if (!window.ethereum) throw new Error("MetaMask not installed");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tx = await contract.storeMemory(title, mediaHash);
      await tx.wait();

      alert("Memory stored on blockchain successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error storing memory:", error);

    }
  };

  return (
    <div className={styles.addMemoryBlockchain}>
      <h1 className={styles.title}>Add Memory (Blockchain)</h1>
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
            Add Media (Single File)
          </label>
          <input
            type="file"
            id="media"
            accept="image/*,video/*,audio/*,text/*"
            onChange={handleMediaChange}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={!account}>
          Add Memory
        </button>
      </form>
    </div>
  );
};

export default AddMemoryBlockchain;
