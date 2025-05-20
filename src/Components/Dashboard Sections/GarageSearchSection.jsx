import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { IoCarSport } from "react-icons/io5";
import { FaCircleArrowRight } from "react-icons/fa6";

function GarageSearchSection() {
  const [query, setQuery] = useState("");
  const [garages, setGarages] = useState([]);
  const navigate = useNavigate();

  const fetchGarages = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setGarages([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/user/garages/search?q=${encodeURIComponent(
            query
          )}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch garages");
        }

        const data = await response.json();
        setGarages(data);
      } catch (error) {
        console.error("Error fetching garages", error);
      }
    }, 300),
    []
  );

  const renderGarageList = () => {
    return garages.map((garage, i) => (
      <div
        key={i}
        className="d-flex flex-row align-items-center p-3 mb-2 rounded-3 shadow-sm bg-light"
        style={{
          borderBottom: "1px solid #007bff",
        }}
      >
        <IoCarSport size={35} color="#007bff" />
        <div className="d-flex flex-column mx-3">
          <h5 className="text-dark">{garage.name}</h5>
          <p className="text-muted">{garage.locationAddress}</p>
        </div>
        <button
          className="btn btn-outline-primary ms-auto d-flex align-items-center w-25 rounded-3"
          onClick={() => navigate(`/user/garage/${garage.garageId}`)}
        >
          View Garage <FaCircleArrowRight size={18} />
        </button>
      </div>
    ));
  };

  useEffect(() => {
    fetchGarages(query);
  }, [query, fetchGarages]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-100 p-4 bg-light">
      <div className="d-flex mb-4">
        <input
          className="form-control rounded-3 border-0 p-3"
          type="text"
          placeholder="Search Garages"
          value={query}
          onChange={handleChange}
          style={{
            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.1)",
            borderColor: "#007bff",
          }}
        />
        <button
          className="btn btn-primary ms-3 rounded-3 d-flex align-items-center justify-content-center p-3"
          style={{ borderRadius: "0.5rem", minWidth: "100px" }}
        >
          Search
        </button>
      </div>
      <hr />
      <div
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {garages.length > 0 && renderGarageList()}
      </div>
    </div>
  );
}

export default GarageSearchSection;
