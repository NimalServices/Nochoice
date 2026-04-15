import React, { useState } from "react";
import "../css/SearchCarrier.css";

function SearchCarrier() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    size: ""
  });

  const locations = ["Jaffna", "Colombo", "Kandy", "Galle"];
  const sizes = ["Small", "Medium", "Large"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSearch = () => {
  if (!formData.from || !formData.to || !formData.date || !formData.size) {
    alert("Please fill all fields!");
    return;
  }

  if (formData.from === formData.to) {
    alert("From and To locations cannot be the same!");
    return;
  }

  alert("Searching carriers...");
};

  return (
    <div className="search-page">
      <div className="search-card">
        <h2>Search Carrier</h2>

        {/* From */}
        <label>From</label>
        <select name="from" value={formData.from} onChange={handleChange}>
          <option value="">Select location</option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>

        {/* To */}
         <label>To</label>
       <select name="to" value={formData.to} onChange={handleChange}>
            <option value="">Select location</option>
  {locations.map((loc, index) => (
    <option
      key={index}
      value={loc}
      disabled={formData.from === loc}  // 🚀 prevents same selection
    >
      {loc}
             </option>
  ))}
        </select>

        {/* Date */}
        <label>Date of Travel</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        {/* Parcel Size */}
        <label>Parcel Size</label>
        <select name="size" value={formData.size} onChange={handleChange}>
          <option value="">Select size</option>
          {sizes.map((size, index) => (
            <option key={index} value={size}>{size}</option>
          ))}
        </select>

        {/* Search Button */}
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default SearchCarrier;