import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "./BlockMemoriesFetch.module.css";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const contractABI = [
  "function storeMemory(string calldata title, string calldata ipfsHash, string calldata timestamp) external",
  "function getMemories(address user) external view returns (string[] memory titles, string[] memory ipfsHashes, string[] memory timestamps)",
  "event MemoryStored(address indexed user, string title, string ipfsHash, string timestamp)",
];

const BlockMemoriesFetch = () => {
  const [account, setAccount] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      window.ethereum.on("accountsChanged", (newAccounts) => {
        setAccount(newAccounts[0] || null);
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMemories = async () => {
    if (!account) return;

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const [titles, ipfsHashes, timestamps] = await contract.getMemories(
        account
      );

      const formattedMemories = titles.map((title, index) => ({
        title,
        ipfsHash: ipfsHashes[index],
        timestamp: timestamps[index],
        ipfsUrl: `https://ipfs.io/ipfs/${ipfsHashes[index]}`,
      }));

      setMemories(formattedMemories);
    } catch (err) {
      setError(
        "Failed to fetch memories. Ensure you're connected to the correct network."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (account) fetchMemories();
  }, [account]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Memories</h2>

      {!account ? (
        <button onClick={connectWallet} className={styles.connectWalletBtn}>
          Connect Wallet
        </button>
      ) : loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.error}>{error}</p>
          <button onClick={fetchMemories} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      ) : memories.length === 0 ? (
        <p className={styles.noMemories}>No memories found.</p>
      ) : (
        <div className={styles.memoriesList}>
          {memories.map((memory, index) => (
            <div key={index} className={styles.memoryItem}>
              <h3 className={styles.memoryTitle}>{memory.title}</h3>
              <p className={styles.memoryIpfsHash}>IPFS: {memory.ipfsHash}</p>
              <p className={styles.memoryTimestamp}>Date: {memory.timestamp}</p>
              <a
                href={memory.ipfsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ipfsLink}
              >
                View on IPFS
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockMemoriesFetch;
