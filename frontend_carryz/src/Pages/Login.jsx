import React from "react";
import styles from "../css/Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {
  const [username,setUsername] =useState("");
  const [password,setPassword] =useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/auth/login', {username, password }  )
      .then(result => {
        console.log(result)
        if(result.data.message === "Login successful"){
          navigate('/home');
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
              placeholder="userName" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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