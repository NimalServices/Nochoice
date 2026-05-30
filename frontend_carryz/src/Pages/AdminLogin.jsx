import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../utils/api";
import styles from "../css/AdminLogin.module.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    axios
      .post(buildApiUrl("/api/auth/login"), { username, password })
      .then((result) => {
        const { token, user } = result.data;

        if (!user || user.role !== "admin") {
          setError("Access denied. Admins only.");
          setLoading(false);
          return;
        }

        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));

        setTimeout(() => {
          setLoading(false);
          navigate("/admin/dashboard");
        }, 1000);
      })
      .catch(() => {
        setError("Invalid username or password");
        setLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>C</div>
          <h1 className={styles.title}>Carryz</h1>
          <p className={styles.subtitle}>Admin Portal</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;