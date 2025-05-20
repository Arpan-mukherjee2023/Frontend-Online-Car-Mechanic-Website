import React, { useEffect, useState } from "react";
import SideNavBar from "../Dashboard Sections/SideNavBar";
import { Modal, Button } from 'react-bootstrap';

function FavouriteGaragesTable() {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user.userId;

  const [selectedGarage, setSelectedGarage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (garage) => {
    setSelectedGarage(garage);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGarage(null);
  };

  useEffect(() => {
    async function fetchGarages() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/users/${userId}/favourite-garages`
        );

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        console.log(data);
        setGarages(data);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGarages();
  }, [userId]);

  
  const handleRemove = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${userId}/favourite-garages/${selectedGarage.garageId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to remove garage");
      setGarages(garages.filter((g) => g.garageId !== selectedGarage.garageId));
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading favourite garages...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (garages.length === 0) return <p>No favourite garages found.</p>;

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div className="content-area mt-2 m-2">
        <div className="table-responsive">
          <h1>Favourite Garages</h1>
          <hr />
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Garage Name</th>
                <th>Proprietor Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {garages.map((garage) => (
                <tr key={garage.garageId}>
                  <td>{garage.name}</td>
                  <td>{garage.proprietorName}</td>
                  <td>{garage.phoneNumber}</td>
                  <td>{garage.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleShowModal(garage)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove{" "}
          <strong>{selectedGarage?.name}</strong> from favourites?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRemove}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  );
}

export default FavouriteGaragesTable;
