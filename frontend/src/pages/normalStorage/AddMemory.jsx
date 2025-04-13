import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import debounce from "lodash/debounce";
import styles from "./AddMemory.module.css";
import calenderIcon from "./../../assets/more_icons/calendar_icon.svg";
import uploadIcon from "./../../assets/more_icons/upload_icon.svg";
import crossIcon from "./../../assets/more_icons/cross_icon.svg";
import micIcon from "./../../assets/more_icons/mic_icon.svg";
import micActiveIcon from "./../../assets/more_icons/mic_active_icon.svg";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Separate RecordingTimer component to isolate timer re-renders
function RecordingTimer({ isRecording }) {
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <span className={styles.recordLabel}>
      {isRecording
        ? `Recording... ${formatTime(recordingTime)}`
        : "Record Voice Note"}
    </span>
  );
}

// Memoized MediaItem component to prevent re-rendering unchanged media
const MediaItem = memo(({ media, index, onRemove }) => (
  <motion.div
    className={`${styles.mediaItem} ${
      media.type === "audio" ? styles.audio : ""
    }`}
    variants={{
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
      exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
    }}
    initial={index === 0 ? "hidden" : false}
    animate={index === 0 ? "visible" : false}
    exit="exit"
  >
    {media.type === "image" ? (
      <img src={media.url} alt="Uploaded" loading="lazy" />
    ) : media.type === "video" ? (
      <video src={media.url} poster={media.url + "#t=0.1"} controls muted />
    ) : (
      <audio controls src={media.url} className={styles.audioPlayer} />
    )}
    <motion.button
      className={styles.removeButton}
      onClick={() => onRemove(index)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src={crossIcon} alt="cross icon" />
    </motion.button>
  </motion.div>
));

// Main AddMemory component
function AddMemory({ onClose }) {
  const shouldReduceMotion = useReducedMotion();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate(); // Initialize navigate

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

  // Debounced media upload handler
  const handleMediaUpload = useCallback(
    debounce((e) => {
      const files = Array.from(e.target.files);
      const newMedia = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : "audio",
      }));
      setMediaFiles((prev) => [...prev, ...newMedia]);
    }, 300),
    []
  );

  const handleRemoveMedia = (index) => {
    setMediaFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setMediaFiles((prev) => [
          ...prev,
          { file: audioBlob, url: audioUrl, type: "audio" },
        ]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRecording) stopRecording();

    // Prepare the memory data
    const memoryData = {
      title: document.getElementById("title").value,
      date: document.getElementById("date").value,
      description: document.getElementById("description").value,
      mood,
    };

    try {
      // Send the memory data to the backend
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memoryData),
      });

      if (response.ok) {
        const savedMemory = await response.json();
        console.log("Memory saved successfully:", savedMemory);

        // Reset the form fields
        document.getElementById("title").value = "";
        document.getElementById("date").value = "";
        document.getElementById("description").value = "";
        setMood(0);
        setMediaFiles([]);

        // Redirect to the same Add Memory section
        navigate("/addmemory");
      } else {
        const errorData = await response.json();
        console.error("Error saving memory:", errorData.error);
        alert("Failed to save memory: " + errorData.error);
      }
    } catch (error) {
      console.error("Error saving memory:", error);
      alert("An error occurred while saving the memory.");
    } finally {
      mediaFiles.forEach((media) => URL.revokeObjectURL(media.url));
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
