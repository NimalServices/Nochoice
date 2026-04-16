import React, { useState } from "react";
import styles from "../css/Login.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

function SignIn() {
  const [name, setName] = useState("");
  const [nic, setNic] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(buildApiUrl("/api/carriers/register"), {
      name,
      nic,
      category,
      phone,
      password
    })
    .then((res) => {
      console.log(res.data);
      alert("Carrier registered successfully!");
      navigate("/careerhome");
    })
    .catch((err) => {
      console.error(err);
      alert("Error registering carrier");
    });
  };

  return (
    <div className={styles.loginBackground}>
      <h2>Carryz</h2>
      <h5>Register as Carrier</h5>

      <form className={styles.formLogin} onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="NIC Number"
          value={nic}
          onChange={(e) => setNic(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="university_traveler">University Traveler</option>
          <option value="usual_traveler">Usual Traveler</option>
        </select>

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {/* NEW PASSWORD FIELD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default SignIn;