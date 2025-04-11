import Spline from "@splinetool/react-spline";
import styles from "./ParticleNebula.module.css";

export default function App() {
  return (
    <>
      <div className={styles.particleBackground}>
        <Spline scene="https://prod.spline.design/bsMlctD1w9gDb2zM/scene.splinecode" />
      </div>
    </>
  );
}

