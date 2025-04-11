import { createContext, useContext, useState } from "react";

const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [blockchainMode, setBlockchainMode] = useState(false);

  const updateBlockchainMode = () => {
    setBlockchainMode((prev) => !prev);
  };

  return (
    <BlockchainContext.Provider
      value={{ blockchainMode, updateBlockchainMode }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};


export const useBlockchainContext = () => {
  return useContext(BlockchainContext);
};
