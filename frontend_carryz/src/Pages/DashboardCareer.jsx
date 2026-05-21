import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import styles from "../css/DashboardCareer.module.css";
import { buildApiUrl } from "../utils/api";
import { jwtDecode } from "jwt-decode";

const API_URL = buildApiUrl("/api/travels");

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa",
  "Colombo", "Galle", "Gampaha", "Hambantota",
  "Jaffna", "Kalutara", "Kandy", "Kegalle",
  "Kilinochchi", "Kurunegala", "Mannar", "Matale",
  "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee",
  "Vavuniya"
];

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours = String(Math.floor(i / 2)).padStart(2, "0");
  const mins = i % 2 === 0 ? "00" : "30";
  return `${hours}:${mins}`;
});

// ── Reusable Autocomplete Component ──────────────────────────────
function Autocomplete({ placeholder, options, value, onChange, required }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  // Sync external value (e.g. on Edit)
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (option) => {
    setQuery(option);
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    if (e.key === "ArrowUp")   setHighlighted((h) => Math.max(h - 1, 0));
    if (e.key === "Enter") { e.preventDefault(); if (filtered[highlighted]) select(filtered[highlighted]); }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className={styles.autocompleteWrapper} ref={wrapperRef}>
      <input
        className={styles.autocompleteInput}
        type="text"
        placeholder={placeholder}
        value={query}
        required={required}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange("");        // clear valid value until a suggestion is picked
          setOpen(true);
          setHighlighted(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className={styles.autocompleteDropdown}>
          {filtered.map((option, idx) => (
            <li
              key={option}
              className={`${styles.autocompleteItem} ${idx === highlighted ? styles.autocompleteItemActive : ""}`}
              onMouseDown={() => select(option)}
              onMouseEnter={() => setHighlighted(idx)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
function DashboardCareer() {
  const token = localStorage.getItem("token");
  const carrier = JSON.parse(localStorage.getItem("carrier") || "{}");

  const carrierId = useMemo(() => {
    if (!token) return null;
    try { return jwtDecode(token).id; }
    catch (e) { console.error("Invalid token", e); return null; }
  }, [token]);

  const [travels, setTravels] = useState([]);
  const [form, setForm] = useState({
    fromWhere: "", toWhere: "", travelDate: "", price: "", BusTime: ""
  });
  const [editId, setEditId] = useState(null);

  const fetchTravels = async () => {
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setTravels(res.data.filter((t) => t.carrierId?.nic === carrier.nic));
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchTravels(); }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setEditId(null);
      } else {
        await axios.post(API_URL, { ...form, carrierId }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ fromWhere: "", toWhere: "", travelDate: "", price: "", BusTime: "" });
      fetchTravels();
    } catch (err) { console.log(err); }
  };

  const handleEdit = (travel) => {
    setForm({
      fromWhere: travel.fromWhere,
      toWhere: travel.toWhere,
      travelDate: travel.travelDate.split("T")[0],
      price: travel.price,
      BusTime: travel.BusTime || ""
    });
    setEditId(travel._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchTravels();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Travel Management</h2>

      <form onSubmit={handleSubmit} className={styles.form}>

        <Autocomplete
          placeholder="From (District)"
          options={SRI_LANKA_DISTRICTS}
          value={form.fromWhere}
          onChange={(val) => setForm((f) => ({ ...f, fromWhere: val }))}
          required
        />

        <Autocomplete
          placeholder="To (District)"
          options={SRI_LANKA_DISTRICTS}
          value={form.toWhere}
          onChange={(val) => setForm((f) => ({ ...f, toWhere: val }))}
          required
        />

        <input
          type="date"
          name="travelDate"
          value={form.travelDate}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price Rs.200 - Rs.500"
          value={form.price}
          onChange={handleChange}
          required
        />

        <Autocomplete
          placeholder="Bus Time (e.g. 09:00)"
          options={TIME_SLOTS}
          value={form.BusTime}
          onChange={(val) => setForm((f) => ({ ...f, BusTime: val }))}
          required
        />

        <button type="submit" className={styles.submitBtn}>
          {editId ? "Update Travel" : "Add Travel"}
        </button>
      </form>

      <div className={styles.list}>
        {travels.map((t) => (
          <div key={t._id} className={styles.card}>
            <p><strong>{t.fromWhere}</strong> → {t.toWhere}</p>
            <p>Date: {new Date(t.travelDate).toLocaleDateString()}</p>
            <p>Price: Rs. {t.price}</p>
            <p>Bus Time: {t.BusTime || "N/A"}</p>
            <div className={styles.actions}>
              <button onClick={() => handleEdit(t)} className={styles.editBtn}>Edit</button>
              <button onClick={() => handleDelete(t._id)} className={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardCareer;