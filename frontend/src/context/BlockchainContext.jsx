import { createContext, useContext, useState } from "react";

const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [blockchainMode, setBlockchainMode] = useState(false);

  const updateBlockchainMode = () => {
    setBlockchainMode((prev) => !prev);
  };

  const modeDescription = blockchainMode
    ? "You are currently in Blockchain Mode."
    : "You are not in Blockchain Mode.";

  return (
    <BlockchainContext.Provider
      value={{ blockchainMode, updateBlockchainMode, modeDescription }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchainContext = () => {
  return useContext(BlockchainContext);
};
