import React, { useEffect, useState } from "react";

const MechanicsList = ({ garageId }) => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setMechanics(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch mechanics.");
        setLoading(false);
      });
  }, [garageId]);

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
              <span
                className={`badge ${
                  isAvailable ? "bg-success" : "bg-secondary"
                } mt-3 mt-md-0`}
                style={{ fontSize: "0.85rem", minWidth: "80px", textAlign: "center" }}
              >
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MechanicsList;
