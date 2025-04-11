import styles from "./Signup.module.css";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create an Account</h2>
        <form className={styles.form}>
          <input className={styles.input} type="text" placeholder="Name" />
          <input className={styles.input} type="email" placeholder="Email" />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
          />
          <button className={styles.button} type="submit">
            Sign Up
          </button>
        </form>
        <p className={styles.toggleText}>
          Already have an account?
          <Link className={styles.toggleBtn} to="/login">
            {" "}
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
