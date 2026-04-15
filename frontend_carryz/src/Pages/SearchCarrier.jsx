// SearchCarrier.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    navigate("/carriers", { state: formData });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
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
        <input type="date" name="date" onChange={handleChange} />

        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default SearchCarrier;