import React, { useState } from "react";
import "../css/Carrier.css";
import profileImg from '../assets/student.png'

function CarrierDetails({ carrier, goBack }) {
  const [selectedMethod, setSelectedMethod] = useState("");

  const handleConfirm = () => {
    if (!selectedMethod) {
      alert("Please select a handover method first!");
      return;
    }

    alert("Carrier Notified ✅");
  };

  return (
    <div className="details-page">

      <button className="back-btn" onClick={goBack}>
        ← Back
      </button>

      <div className="details-card">

        {/* Profile Section */}
        <div className="profile-section">
          <img
            src={profileImg}
            alt={carrier.name}
            className="profile-img"
          />
          <h2>{carrier.name}</h2>
          <p className="university">{carrier.university}</p>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <p><span>📍 Travel:</span> {carrier.from} → {carrier.to}</p>
          <p><span>📅 Date:</span> {carrier.date}</p>
          <p><span>⏰ Call Time:</span> {carrier.time}</p>
          <p><span>📞 Contact:</span> {carrier.contact}</p>

          {/* Handover Selection */}
          <div className="handover-box">
            <p className="handover-title">Choose Handover Method</p>

            <div className="handover-buttons">
              <button
                className={
                  selectedMethod === "meet"
                    ? "handover-btn active"
                    : "handover-btn"
                }
                onClick={() => setSelectedMethod("meet")}
              >
                🤝 I'll hand over to the carrier
              </button>

              <button
                className={
                  selectedMethod === "pickup"
                    ? "handover-btn active"
                    : "handover-btn"
                }
                onClick={() => setSelectedMethod("pickup")}
              >
                📍 Pickup by the carrier
              </button>
            </div>

            {selectedMethod && (
              <p className="selected-text">
                Selected:{" "}
                {selectedMethod === "meet"
                  ? "You will meet the carrier"
                  : "Carrier will pick up from you"}
              </p>
            )}
          </div>

          {/* ✅ NEW Confirm Button */}
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm Carrier
          </button>

        </div>

      </div>
    </div>
  );
}

export default CarrierDetails;