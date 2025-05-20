import React, { useEffect, useState } from "react";
import SideNavBar from "../Dashboard Sections/SideNavBar";

function ServiceHistoryTable() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user.userId;

  useEffect(() => {
    async function fetchServiceHistory() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/service-history/user/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch service history");
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchServiceHistory();
  }, [userId]);

  if (loading) return <p>Loading service history...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (services.length === 0) return <p>No service history found.</p>;

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div className="content-area mt-2 m-2">
        <div className="table-responsive">
          <h1>Service History</h1>
          <hr />
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Service Name</th>
                <th>Garage Name</th>
                <th>Mechanic Name</th>
                <th>Registration Number</th>
                <th>Cost</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.serviceId}>
                  <td>{service.serviceName}</td>
                  <td>{service.garageName}</td>
                  <td>{service.mechanicName}</td>
                  <td>{service.registrationNumber}</td>
                  <td>{service.cost}</td>
                  <td>{service.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ServiceHistoryTable;
