import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/DashboardCareer.module.css"; // ? module import
// import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/travels";
const token = localStorage.getItem("token");
const decoded = jwtDecode(token);
const carrierId = decoded.id;

function DashboardCareer() {
  const [travels, setTravels] = useState([]);
  const [form, setForm] = useState({
    fromWhere: "",
    toWhere: "",
    travelDate: "",
    price: ""
  });

  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch travels
  const fetchTravels = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTravels(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTravels();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditId(null);
      } else {
        await axios.post(API_URL, {
          ...form,
          carrierId   // ? REQUIRED FIX
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setForm({ fromWhere: "", toWhere: "", travelDate: "", price: "" });
      fetchTravels();
    } catch (err) {
      console.log(err);
    }
  };

  // Edit
  const handleEdit = (travel) => {
    setForm({
      fromWhere: travel.fromWhere,
      toWhere: travel.toWhere,
      travelDate: travel.travelDate.split("T")[0],
      price: travel.price
    });
    setEditId(travel._id);
  };

  // Delete
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTravels();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Travel Management</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="fromWhere"
          placeholder="From"
          value={form.fromWhere}
          onChange={handleChange}
          required
        />
        <input
          name="toWhere"
          placeholder="To"
          value={form.toWhere}
          onChange={handleChange}
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
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <button type="submit" className={styles.submitBtn}>
          {editId ? "Update Travel" : "Add Travel"}
        </button>
      </form>

      <div className={styles.list}>
        {travels.map((t) => (
          <div key={t._id} className={styles.card}>
            <p><strong>{t.fromWhere}</strong> ? {t.toWhere}</p>
            <p>Date: {new Date(t.travelDate).toLocaleDateString()}</p>
            <p>Price: Rs. {t.price}</p>

            <div className={styles.actions}>
              <button onClick={() => handleEdit(t)} className={styles.editBtn}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardCareer;
