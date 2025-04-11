import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); 
        navigate("/addmemory");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.authPage}>
      <h1 className={styles.titleHome} onClick={()=>navigate("/landing")}>MemoryVault</h1>
      <div className={styles.card}>

        <h2 className={styles.title}>Welcome Back To,</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.toggleText}>
          Don’t have an account?
          <Link className={styles.toggleBtn} to="/signup">
            {" "}
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};