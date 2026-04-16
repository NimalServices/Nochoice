import React from "react";
import styles from "../css/Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {
  const [nic,setNic] =useState("");
  const [password,setPassword] =useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {nic, password }  )
      .then(result => {
        console.log(result)
        localStorage.setItem("token", result.data.token);
        if(result.data.message === "Login successful"){
          navigate('/careerhome');
      }    })
      .catch(err => {
        console.error(err);
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
            <input  type="submit" value="Login" />
        </form>
    </div>
  );
}

export default Login;