import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import { IoCarSport } from "react-icons/io5";

function GarageCard({ garage }) {
  const navigate = useNavigate();

  const handleClick = (garage_id) => {
    console.log(garage_id);
    navigate(`/user/garage/${garage_id}`);
  };

  return (
    <div className="card mb-3 shadow-sm border-0">
      <div className="card-body d-flex p-3">
        <div className="me-3">
          <IoCarSport size={40} color="#0d6efd" />
        </div>
        <div className="d-flex flex-column flex-grow-1">
          <h5 className="fs-5 fw-bold mb-1 text-dark">{garage.title}</h5>
          <p className="fs-6 text-muted mb-1">{garage.address}</p>

          <p className="card-text">
            <span className="badge bg-success">{garage.rating}</span>
          </p>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-between">
          <button
            className="btn btn-success btn-sm mb-2 w-100 rounded-3"
            onClick={() => handleClick(garage.garageId)}
          >
            Book Appointment
          </button>
          <button className="btn btn-primary btn-sm w-100 rounded-3 d-flex align-items-center justify-content-center">
            <FaPhoneAlt className="me-2" /> Call Now
          </button>
        </div>
      </div>
    </div>
  );
}

function NearestGarageCard() {
  // Shows the nearest garage locations
  const [garages, setGarages] = useState([]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        try {
          const res = await fetch(
            `http://localhost:8080/api/user/garages/nearby?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setGarages(data);
        } catch (error) {
          console.error("Failed to fetch nearby garages", error);
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);
  return (
    <div className="container py-4">
      <h3 className="mb-4 text-dark">Nearest Garages</h3>
      <div className="d-flex flex-column gap-3">
        {garages &&
          garages.map((garage, index) => (
            <GarageCard
              key={index}
              garage={{
                title: garage.name,
                address: garage.locationAddress,
                distance: garage.distance?.toFixed(1) + " km",
                rating: garage.ratings,
                garageId: garage.garageId
              }}
            />
          ))}
      </div>
    </div>
  );
}

export default NearestGarageCard;
