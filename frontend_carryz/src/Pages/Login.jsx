import React from "react";
import styles from "../css/Login.module.css";


function Login() {

  return (
    <>
    <h2>LogIn</h2>
        <form className={styles.formLogin}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="submit" value="Login" />
        </form>
    </>
  );
}

export default Login;