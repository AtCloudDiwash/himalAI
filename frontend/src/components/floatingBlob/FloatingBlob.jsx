// FloatingBlob.jsx
import { color, motion } from "framer-motion";
import "./FloatingBlob.css"; // CSS for blur + gradient

const FloatingBlob = ({
  delay = 0,
  size = "20rem",
  top,
  left,
  backgroundColor,
}) => {
  return (
    <motion.div
      className="floating-blob"
      initial={{ x: 0, y: 0 }}
      animate={{
        x: [0, 60, -40, 0],
        y: [0, -30, 40, 0],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 8,
        ease: "easeInOut",
        delay,
      }}
      style={{
        width: size,
        height: size,
        top,
        left,
        background: backgroundColor,
      }}
    />
  );
};

export default FloatingBlob;
