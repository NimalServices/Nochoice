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
  const [error, setError] = useState(""); // ← add this

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // ← clear error on each attempt

    axios
      .post(buildApiUrl("/api/auth/login"), { nic, password })
      .then((result) => {
        const { token, carrier } = result.data;

        // ← check approved status
        if (carrier && carrier.approved === false) {
          setError("Your account is pending admin approval. Please wait.");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("carrier", JSON.stringify(carrier));

        setTimeout(() => {
          setLoading(false);
          navigate("/careerhome");
        }, 2000);
      })
      .catch((err) => {
        setError("Invalid NIC or password"); // ← show error on wrong credentials
        setLoading(false);
      });
  };

  return (
    <div className={styles.loginBackground}>
      <h2>Carryz</h2>
      <h5>Welcome back!</h5>

      {/* ← add this error message */}
      {error && (
        <p style={{ color: "#f87171", fontSize: "14px", textAlign: "center" }}>
          {error}
        </p>
      )}

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

        {loading && (
          <div className={styles.loaderContainer}>
            <img src={loadingGif} alt="Loading" className={styles.loader} />
          </div>
        )}
      </form>
    </div>
  );
}
export default Login;