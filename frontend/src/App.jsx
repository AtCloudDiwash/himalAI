import "./assets/styles/global.css";
import Dashboard from "./pages/Dashboard.jsx";
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