import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../css/CarrierConfirm.module.css";import { buildApiUrl } from "../utils/api";
function CarrierConfirm() {
  const location = useLocation();

  const searchData = useMemo(() => {
    if (location.state) return location.state;

    const urlParams = new URLSearchParams(location.search);
    const from = urlParams.get("from") || "";
    const to = urlParams.get("to") || "";
    const date = urlParams.get("date") || "";

    return from && to && date ? { from, to, date } : null;
  }, [location.search, location.state]);

  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchData) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(buildApiUrl("/api/travels"), {
          params: searchData
        });

        setCarriers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch carriers.");
        setCarriers([]);
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
  if (!searchData)
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Search parameters missing</h2>
        <p>
          This page requires a route search query. Please use the search form to look for available carriers.
        </p>
        <Link to="/" className={styles.link}>
          Back to Search
        </Link>
      </div>
    );

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
            <div className={styles.contact}>
              📞 {c.carrierId?.phone || "N/A"}
            </div>
            {/* <button className={styles.button}>
              View Details
            </button> */}
          </div>
        ))
      )}
    </div>
  );
}

export default CarrierConfirm;