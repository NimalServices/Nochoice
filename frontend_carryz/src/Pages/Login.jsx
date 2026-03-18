import React from "react";
import styles from "../css/Login.module.css";


function Login() {

  return (
    <div className={styles.loginBackground}>
    <h2>Carryz</h2>
    <h5>Welcome back!</h5>
        <form className={styles.formLogin}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="submit" value="Login" />
        </form>
    </div>
  );
}

export default Login;