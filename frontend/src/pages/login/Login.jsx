import styles from "./Login.module.css";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        <form className={styles.form}>
          <input className={styles.input} type="email" placeholder="Email" />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
          />
          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
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
}
