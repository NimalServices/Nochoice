// SearchCarrier.jsx

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/SearchCarrier.module.css";
import logo from "../assets/logo_Carryz.png";

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa",
  "Colombo", "Galle", "Gampaha", "Hambantota",
  "Jaffna", "Kalutara", "Kandy", "Kegalle",
  "Kilinochchi", "Kurunegala", "Mannar", "Matale",
  "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee",
  "Vavuniya"
];

function AutocompleteInput({ name, value, onChange, placeholder, excludeValue }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync external value reset
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const handleInput = (e) => {
    const typed = e.target.value;
    setQuery(typed);

    if (typed.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      onChange({ target: { name, value: "" } });
      return;
    }

    const filtered = SRI_LANKA_DISTRICTS.filter(
      (d) =>
        d.toLowerCase().startsWith(typed.toLowerCase()) &&
        d !== excludeValue
    );
    setSuggestions(filtered);
    setShowDropdown(true);
    // If typed exactly matches a district, commit it
    const exact = SRI_LANKA_DISTRICTS.find(
      (d) => d.toLowerCase() === typed.toLowerCase()
    );
    onChange({ target: { name, value: exact || "" } });
  };

  const handleSelect = (district) => {
    setQuery(district);
    setSuggestions([]);
    setShowDropdown(false);
    onChange({ target: { name, value: district } });
  };

  return (
    <div ref={wrapperRef} className={styles.autocompleteWrapper}>
      <input
        type="text"
        value={query}
        onChange={handleInput}
        onFocus={() => query && suggestions.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={styles.autocompleteInput}
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((d) => (
            <li
              key={d}
              onMouseDown={() => handleSelect(d)}   // mousedown fires before blur
              className={styles.suggestionItem}
            >
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchCarrier() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ from: "", to: "", date: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const { from, to, date } = formData;

    if (!from || !to || !date) {
      alert("Fill all fields!");
      return;
    }
    if (!SRI_LANKA_DISTRICTS.includes(from) || !SRI_LANKA_DISTRICTS.includes(to)) {
      alert("Please select a valid district from the list.");
      return;
    }
    if (from === to) {
      alert("Locations cannot be the same!");
      return;
    }

    const query = new URLSearchParams({ from, to, date }).toString();
    navigate(`/carriers?${query}`, { state: formData });
  };

  return (
    <div className={styles.page}>
      <div className={styles.phone}>
        <a href="tel:+94775320757">+94 775 320 757</a>
      </div>
      <div className={styles.card}>
        <div className={styles.nav}>
          <Link className={styles.navLink} to="/login">Login</Link>
          <Link className={styles.navLink} to="/signin">Register</Link>
        </div>

        <div>
          <img src={logo} alt="Carryz Logo" className={styles.logo} />
        </div>

        <label>From</label>
        <AutocompleteInput
          name="from"
          value={formData.from}
          onChange={handleChange}
          placeholder="Type a district..."
          excludeValue={formData.to}
        />

        <label>To</label>
        <AutocompleteInput
          name="to"
          value={formData.to}
          onChange={handleChange}
          placeholder="Type a district..."
          excludeValue={formData.from}
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default SearchCarrier;