import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "./BlockMemoriesFetch.module.css";

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

const BlockMemoriesFetch = () => {
  const [account, setAccount] = useState(null);
  const [memories, setMemories] = useState([]);
  const [counter, setCounter] = useState(0);
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

      // Fetch memories
      const data = await contract.getAllUserData(account);
      const formattedMemories = data.map((item) => ({
        title: item.title,
        ipfsHash: item.ipfsHash,
        timestamp: item.date,
        mvPoints: ethers.formatUnits(item.mvPoints, 0), // Convert uint256 to string
        ipfsUrl: `https://ipfs.io/ipfs/${item.ipfsHash}`,
      }));

      // Fetch transaction counter
      const counterValue = await contract.getTransactionCounter(account);
      setCounter(ethers.formatUnits(counterValue, 18)); // Convert from 1e18 to decimal

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
      {account && (
        <p className={styles.counter}>Transaction Counter: {counter}</p>
      )}

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
              <p className={styles.memoryPoints}>Points: {memory.mvPoints}</p>
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
