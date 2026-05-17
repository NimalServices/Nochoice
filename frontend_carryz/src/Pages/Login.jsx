import React from "react";
import styles from "../css/Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../utils/api";
import loadingGif from "../assets/Loading.gif";

function Login() {
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    axios
      .post(buildApiUrl("/api/auth/login"), { nic, password })
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem(
          "carrier",
          JSON.stringify(result.data.carrier)
        );

        if (result.data.message === "Login successful") {

          // 2 second loading timer
          setTimeout(() => {
            setLoading(false);
            navigate("/careerhome");
          }, 2000);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className={styles.loginBackground}>
      <h2>Carryz</h2>
      <h5>Welcome back!</h5>

      <form className={styles.formLogin} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="NIC Number"
          value={nic}
          onChange={(e) => setNic(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="submit"
          value={loading ? "Loading..." : "Login"}
          disabled={loading}
        />

        {/* Loading GIF */}
        {loading && (
          <div className={styles.loaderContainer}>
            <img
              src={loadingGif}
              alt="Loading"
              className={styles.loader}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;