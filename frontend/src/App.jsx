import "./assets/styles/global.css";
import Dashboard from "./pages/dashboard";
import { BrowserRouter } from "react-router-dom";


export default function App(){
    return (
      <>
        <BrowserRouter>
          <Dashboard></Dashboard>
        </BrowserRouter>
      </>
    );
}