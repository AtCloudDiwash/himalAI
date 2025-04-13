import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect, memo } from "react";
import styles from "./AddMemory.module.css";
import calenderIcon from "./../../assets/more_icons/calendar_icon.svg";
import { useNavigate } from "react-router-dom"; 

// Main AddMemory component 
function AddMemory({ onClose }) {
  const shouldReduceMotion = useReducedMotion();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const recordButtonVariants = {
    recording: {
      opacity: [1, 0.9, 1],
      transition: { repeat: Infinity, duration: 1.2 },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const memoryData = {
      title: document.getElementById("title").value,
      date: document.getElementById("date").value,
      description: document.getElementById("description").value,
      mood,
    };

    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      console.log("Token sent in request:", token); // Debugging log

      const response = await fetch("http://localhost:3000/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
        body: JSON.stringify(memoryData),
      });

      if (response.ok) {
        console.log("Memory saved successfully");

        // Reset form fields
        document.getElementById("title").value = "";
        document.getElementById("date").value = "";
        document.getElementById("description").value = "";
        setMood(0); // Reset mood slider
        setMediaFiles([]); // Clear media files if applicable
      } else {
        const errorData = await response.json();
        console.error("Error saving memory:", errorData.error);
        alert("Failed to save memory: " + errorData.error);
      }
    } catch (error) {
      console.error("Error saving memory:", error);
      alert("An error occurred while saving the memory.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      mediaFiles.forEach((media) => URL.revokeObjectURL(media.url));
    };
  }, [isRecording, mediaFiles]);

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.focus();
      dateInputRef.current.showPicker();
    }
  };

  const MAX_PREVIEWS = 4;
  const [mood, setMood] = useState(0);

  return (
    <div className={styles.wrapper}>
      <AnimatePresence>
        <motion.div
          className={styles.addMemory}
          variants={shouldReduceMotion ? {} : formVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? false : "visible"}
          exit={shouldReduceMotion ? false : "exit"}
        >
          <div className={styles.header}>
            <h2>Add Memory</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <motion.div variants={inputVariants} className={styles.formField}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter memory title"
              />
            </motion.div>

            <motion.div variants={inputVariants} className={styles.formField}>
              <label htmlFor="date">Date</label>
              <div className={styles.dateInputWrapper}>
                <input
                  type="date"
                  id="date"
                  name="date"
                  defaultValue="2024-02-05"
                  ref={dateInputRef}
                />
                <img
                  src={calenderIcon}
                  className={styles.calendarIcon}
                  alt="calendar icon"
                  onClick={openDatePicker}
                />
              </div>
            </motion.div>

            <motion.div variants={inputVariants} className={styles.formField}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your memory"
              />
            </motion.div>

            <motion.div variants={inputVariants} className={styles.formField}>
              <label htmlFor="mood">Mood: {mood}</label>
              <input
                type="range"
                id="mood"
                name="mood"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className={styles.moodSlider}
              />
            </motion.div>

            <div className={styles.formButtons}>
              <motion.button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className={styles.saveButton}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default memo(AddMemory);
