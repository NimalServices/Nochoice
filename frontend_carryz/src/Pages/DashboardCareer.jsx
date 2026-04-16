import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "../css/DashboardCareer.module.css";
import jwtDecode from "jwt-decode";

const API_URL = `${import.meta.env.VITE_API_URL}/api/travels`;

function DashboardCareer() {
  const token = localStorage.getItem("token");
  const carrierId = useMemo(() => {
    if (!token) return null;

    try {
      return jwtDecode(token).id;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }, [token]);

  const [travels, setTravels] = useState([]);
  const [form, setForm] = useState({
    fromWhere: "",
    toWhere: "",
    travelDate: "",
    price: ""
  });

  const [editId, setEditId] = useState(null);

  // Fetch travels
  const fetchTravels = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTravels(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadTravels = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTravels(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadTravels();
  }, [token]);

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
