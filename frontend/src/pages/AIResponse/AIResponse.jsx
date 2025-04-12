import React, { useState } from "react";
import styles from "./AIResponse.module.css";

function JournalForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      setResponse(data.response); // ✅ This is the message from FastAPI
    } catch (error) {
      console.error("Error:", error);
      setResponse("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }} className={styles.wrapper}>
      <h1>Journal Entry</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <textarea
          placeholder="Write your description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            display: "block",
            marginBottom: "1rem",
            width: "100%",
            height: "100px",
          }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: "2rem", whiteSpace: "pre-line" }}>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default JournalForm;
