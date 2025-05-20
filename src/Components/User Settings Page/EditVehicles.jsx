import React, { useEffect, useState } from 'react';
import SideNavBar from "../../Components/Dashboard Sections/SideNavBar";

const EditVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    fetch(`http://localhost:8080/api/vehicles/edit/${user.userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => setVehicles(data))
      .catch(error => console.error('Error fetching vehicles:', error));
  }, [user.userId, vehicles]);

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/vehicles/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          // Update UI by filtering out the deleted vehicle
          setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== id));
        } else {
          alert('Failed to delete vehicle.');
        }
      })
      .catch(error => {
        console.error('Error deleting vehicle:', error);
        alert('Error deleting vehicle.');
      });
  };

  return (
    <div className="dashboard-container d-flex">
      <SideNavBar />
      <div className="content-area flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container">
          <h2 className="mb-4 text-primary fw-bold">Your Vehicles</h2>
          <div className="table-responsive shadow-sm rounded bg-white">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{ width: '20%' }}>VIN</th>
                  <th scope="col" style={{ width: '20%' }}>Vehicle Number</th>
                  <th scope="col" style={{ width: '20%' }}>Brand</th>
                  <th scope="col" style={{ width: '20%' }}>Model</th>
                  <th scope="col" style={{ width: '20%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length > 0 ? (
                  vehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                      <td className="text-truncate" style={{ maxWidth: '150px' }}>{vehicle.vin}</td>
                      <td>{vehicle.registrationNumber}</td>
                      <td>{vehicle.make}</td>
                      <td>{vehicle.model}</td>
                      <td>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => handleDelete(vehicle.vehicleId)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No vehicles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVehicles;
