import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";

const UpcomingAppointments = ({ garageId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!garageId) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/upcoming/${garageId}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [garageId]);

  const handleViewDetails = (appt) => {
    setSelectedAppt(appt);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppt(null);
  };

  if (loading) return <p>Loading upcoming appointments...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (appointments.length === 0) return <p>No upcoming appointments.</p>;

  return (
    <>
      <h5 className="mb-3">Upcoming Appointments</h5>
      <div className="d-flex flex-column gap-3">
        {appointments.map((appt) => (
          <Card key={appt.id} className="shadow-sm">
            <Card.Body>
              <Card.Title>{appt.userName}</Card.Title>
              <Card.Text>
                <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}<br />
                <strong>Time:</strong> {appt.time}<br />
                <strong>Service:</strong> {appt.serviceName}
              </Card.Text>
              <Button variant="primary" onClick={() => handleViewDetails(appt)}>
                View Details
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppt && (
            <div className="px-1">
              <p><strong>Customer:</strong> {selectedAppt.userName}</p>
              <p><strong>Phone:</strong> {selectedAppt.userPhoneNumber}</p>
              <p><strong>Service:</strong> {selectedAppt.serviceName}</p>
              <p><strong>Mechanic:</strong> {selectedAppt.mechanicName}</p>

              <p><strong>Date:</strong> {new Date(selectedAppt.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedAppt.time}</p>
              <hr />
              <p><strong>Vehicle Make:</strong> {selectedAppt.vehicleMake}</p>
              <p><strong>Vehicle Model:</strong> {selectedAppt.vehicleModel}</p>
              <p><strong>Registration No.:</strong> {selectedAppt.vehicleRegistrationNumber}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpcomingAppointments;
