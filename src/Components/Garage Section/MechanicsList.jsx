import React, { useEffect, useState } from "react";

const MechanicsList = ({ garageId }) => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!garageId) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/mechanics/garage/${garageId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        // Ensure the mechanics data uses `isAvailable` consistently
        setMechanics(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch mechanics.");
        setLoading(false);
      });
  }, [garageId]);

  const toggleAvailability = (mechanicId, currentAvailability) => {
    setUpdatingId(mechanicId);

    const newAvailability = !currentAvailability;

    fetch(`http://localhost:8080/api/mechanics/${mechanicId}/availability/${newAvailability}`, {
      method: "PUT",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update availability");
        return res.json();
      })
      .then((updatedMechanic) => {
        setMechanics((prev) =>
          prev.map((m) =>
            m.id === mechanicId ? { ...m, isAvailable: updatedMechanic.isAvailable } : m
          )
        );
      })
      .catch(() => {
        alert("Failed to update availability. Please try again.");
      })
      .finally(() => {
        setUpdatingId(null);
      });
  };

  if (loading)
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="ms-2">Loading mechanics...</span>
      </div>
    );

  if (error) return <div className="alert alert-danger p-3">{error}</div>;

  return (
    <div
      className="p-4 bg-white rounded shadow-sm"
      style={{ maxHeight: "480px", overflowY: "auto", minWidth: "320px" }}
    >
      <h5 className="mb-4 text-primary border-bottom pb-2">Mechanics</h5>
      {mechanics.length === 0 ? (
        <p className="text-muted">No mechanics found for this garage.</p>
      ) : (
        <ul className="list-group">
          {mechanics.map(({ id, name, phoneNumber, specialization, isAvailable }) => (
            <li
              key={id}
              className="list-group-item d-flex justify-content-between align-items-center flex-column flex-md-row"
            >
              <div className="me-auto">
                <h6 className="mb-1">{name}</h6>
                <small className="text-muted d-block">📞 {phoneNumber}</small>
                <small className="text-muted d-block">🛠️ {specialization}</small>
              </div>
              <div className="d-flex align-items-center mt-3 mt-md-0">
                <span
                  className={`badge ${
                    isAvailable ? "bg-success" : "bg-secondary"
                  } me-3`}
                  style={{ fontSize: "0.85rem", minWidth: "80px", textAlign: "center" }}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </span>
                <button
                  className={`btn btn-sm ${
                    isAvailable ? "btn-outline-danger" : "btn-outline-success"
                  }`}
                  disabled={updatingId === id}
                  onClick={() => toggleAvailability(id, isAvailable)}
                  aria-label={`Set ${name} as ${isAvailable ? "unavailable" : "available"}`}
                >
                  {updatingId === id ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : isAvailable ? (
                    "Make Unavailable"
                  ) : (
                    "Make Available"
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MechanicsList;
