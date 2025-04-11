import "./assets/styles/global.css";
import Dashboard from "./pages/dashboard";
import { BrowserRouter } from "react-router-dom";
import { BlockchainProvider } from "./context/BlockchainContext";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <BlockchainProvider>
          <Dashboard></Dashboard>
        </BlockchainProvider>
      </BrowserRouter>
    </>
  );
}
