import React, { useState } from "react";
import CarrierDetails from "./CarrierDetails";
import "../css/Carrier.css";

function CarrierConfirm() {
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  const carriers = [
    {
      name: "Anban",
      university: "University of Jaffna",
      date: "22 March 2026",
      time: "2:00 PM",
      from: "Jaffna",
      to: "Colombo",
      contact: "0771234567",
      method: "Meet at bus stand"
    },
    {
      name: "Kumar",
      university: "University of Colombo",
      date: "23 March 2026",
      time: "5:30 PM",
      from: "Colombo",
      to: "Kandy",
      contact: "0719876543",
      method: "Hand over at university gate"
    },
    {
      name: "Priya",
      university: "University of Peradeniya",
      date: "24 March 2026",
      time: "3:15 PM",
      from: "Kandy",
      to: "Colombo",
      contact: "0767654321",
      method: "Pickup from hostel"
    },
    {
      name: "Sanjana",
      university: "University of Kelaniya",
      date: "25 March 2026",
      time: "7:00 AM",
      from: "Colombo",
      to: "Matara",
      contact: "0776543210",
      method: "Meet at central bus station"
    },
    {
      name: "Rajesh",
      university: "University of Sri Jayewardenepura",
      date: "26 March 2026",
      time: "4:45 PM",
      from: "Colombo",
      to: "Galle",
      contact: "0778901234",
      method: "Pickup from residence"
    },
    {
      name: "Aisha",
      university: "University of Ruhuna",
      date: "27 March 2026",
      time: "1:30 PM",
      from: "Matara",
      to: "Colombo",
      contact: "0721234567",
      method: "Hand over at main junction"
    },
    {
      name: "Vikram",
      university: "University of Moratuwa",
      date: "28 March 2026",
      time: "6:00 PM",
      from: "Colombo",
      to: "Negombo",
      contact: "0779876543",
      method: "Meet at university main entrance"
    },
    {
      name: "Deepa",
      university: "University of the Visual & Performing Arts",
      date: "29 March 2026",
      time: "9:30 AM",
      from: "Colombo",
      to: "Jaffna",
      contact: "0765432109",
      method: "Pickup from campus"
    },
    {
      name: "Hassan",
      university: "University of Colombo",
      date: "30 March 2026",
      time: "2:30 PM",
      from: "Kandy",
      to: "Colombo",
      contact: "0774567890",
      method: "Hand over near railway station"
    }
  ];

  // 👉 If clicked → show details
  if (selectedCarrier) {
    return (
      <CarrierDetails
        carrier={selectedCarrier}
        goBack={() => setSelectedCarrier(null)}
      />
    );
  }

  // 👉 Default view → show list
  return (
    <div className="page">
      <h1 className="title">Available Carriers</h1>

      <div className="container">
        {carriers.map((carrier, index) => (
          <div
            key={index}
            className="card"
            onClick={() => setSelectedCarrier(carrier)}
          >
            <h3>{carrier.name}</h3>
            <p><b>University:</b> {carrier.university}</p>
            <p><b>Date:</b> {carrier.date}</p>
            <p><b>Call Time:</b> {carrier.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarrierConfirm;