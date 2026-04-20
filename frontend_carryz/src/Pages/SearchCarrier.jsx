// SearchCarrier.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/SearchCarrier.module.css";

function SearchCarrier() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: ""
  });

  const locations = ["Jaffna", "Colombo", "Kandy", "Galle"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const { from, to, date } = formData;

    if (!from || !to || !date) {
      alert("Fill all fields!");
      return;
    }

    if (from === to) {
      alert("Locations cannot be same!");
      return;
    }

    const query = new URLSearchParams({ from, to, date }).toString();
    navigate(`/carriers?${query}`, { state: formData });
  };

  return (
    <div className={styles.page}>
      <div className={styles.phone}><a href="tel:+94775320757">+94 775 320 757</a></div>
      <div className={styles.card}>
        <div className={styles.nav}>
          <Link className={styles.navLink} to="/login">
            Login
          </Link>
          <Link className={styles.navLink} to="/signin">
            Register
          </Link>
        </div>

        <h2>Search Carrier</h2>

        <label>From</label>
        <select name="from" value={formData.from} onChange={handleChange}>
          <option value="">Select</option>
          {locations.map((loc, i) => (
            <option key={i}>{loc}</option>
          ))}
        </select>

        <label>To</label>
        <select name="to" value={formData.to} onChange={handleChange}>
          <option value="">Select</option>
          {locations.map((loc, i) => (
            <option key={i} disabled={formData.from === loc}>
              {loc}
            </option>
          ))}
        </select>

        <label>Date</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} />

        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default SearchCarrier;