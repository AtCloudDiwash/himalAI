import styles from "./Dashboard.module.css";
import FloatingBlob from "../components/floatingBlob/FloatingBlob";
import Navbar from "../components/navbar/Navbar";
import ParticleNebula from "../components/spline/ParticleNebula";
import AddMemory from "./AddMemory";
import ExploreMemories from "./ExploreMemories";
import {Routes, Route } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className={styles.wrapper}>
      <Navbar></Navbar>
      <FloatingBlob
        top="0%"
        left="80%"
        delay={0}
        size="300px"
        backgroundColor="#6B88FF"
      />
      <FloatingBlob
        top="65%"
        left="70%"
        delay={2}
        size="220px"
        backgroundColor="#6B88FF"
      />
      <FloatingBlob
        top="70%"
        left="-5%"
        delay={2}
        size="350px"
        backgroundColor="#EC36C4"
      />


        <Routes>
          <Route path="/" element={<ParticleNebula/>}/>
          <Route path="/addmemory" element={<AddMemory/>} />
        </Routes>


      {/* <ExploreMemories></ExploreMemories> */}
    </div>
  );
}
