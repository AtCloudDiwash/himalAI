import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import styles from "./ExploreMemories.module.css";

const ExploreMemories = ({ memories, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [viewMode, setViewMode] = useState(null);
  const [sortedMemories, setSortedMemories] = useState([]);
  const containerRef = useRef(null);
  const pipeRefs = useRef([]);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const handleExplore = (mode) => {
    setViewMode(mode);
    setIsModalOpen(false);

    let sorted = [...memories];
    if (mode === "end") {
      sorted = sorted.reverse();
    } else if (mode === "random") {
      sorted = sorted.sort(() => Math.random() - 0.5);
    }
    setSortedMemories(sorted);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  const generateAIComment = (memory) => {
    return `This memory from ${memory.date} is so vivid! It reminds me of a similar moment...`;
  };

  return (
    <div className={styles.exploreMemories}>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Explore Your Memories</h2>
              <p>Choose how you'd like to view your memories:</p>
              <div className={styles.modalButtons}>
                <button onClick={() => handleExplore("end")}>
                  Start from End
                </button>
                <button onClick={() => handleExplore("beginning")}>
                  Start from Beginning
                </button>
                <button onClick={() => handleExplore("random")}>Random</button>
              </div>
              <button className={styles.closeButton} onClick={handleClose}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isModalOpen && viewMode && (
        <motion.div
          className={styles.timelineContainer}
          ref={containerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {sortedMemories.map((memory, index) => (
            <motion.div
              className={styles.timelineItem}
              key={memory.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className={styles.memoryContent}>{memory.content}</div>
              <div
                className={styles.timelinePipe}
                ref={(el) => (pipeRefs.current[index] = el)}
              >
                <motion.div
                  className={styles.glow}
                  style={{
                    opacity: useTransform(
                      scrollYProgress,
                      [
                        index / sortedMemories.length,
                        (index + 1) / sortedMemories.length,
                      ],
                      [0, 1]
                    ),
                  }}
                />
              </div>
              <div className={styles.aiComment}>
                {generateAIComment(memory)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ExploreMemories;
