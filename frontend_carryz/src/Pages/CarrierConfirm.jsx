import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../css/CarrierConfirm.module.css";

function CarrierConfirm() {
  const location = useLocation();
  const searchData = location.state;

  const [carriers, setCarriers] = useState([]); // ✅ always start as array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Guard: don't fetch if no search data
    if (!searchData) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/travels`, {
          params: searchData
        });

        // ✅ Safety check
        setCarriers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch carriers.");
        setCarriers([]); // ✅ reset to empty on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchData]);

  // ✅ Loading state
  if (loading) return <p>Loading carriers...</p>;

  // ✅ Error state
  if (error) return <p>{error}</p>;

  // ✅ No search data
  if (!searchData) return <p>No search data provided.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Carriers</h2>

      {carriers.length === 0 ? (
        <p>No carriers available</p>
      ) : (
        carriers.map((c) => (
          <div key={c._id} className={styles.card}>
            <div className={styles.name}>
              {c.carrierId?.name || "Carrier"}
            </div>
            <div className={styles.route}>
              📍 {c.fromWhere} → {c.toWhere}
            </div>
            <div className={styles.date}>
              📅 {new Date(c.travelDate).toDateString()}
            </div>
            <div className={styles.price}>
              💰 Rs. {c.price}
            </div>
            <button className={styles.button}>
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default CarrierConfirm;