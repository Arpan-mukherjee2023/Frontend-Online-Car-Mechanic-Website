import React, { useEffect, useState } from "react";
import SideNavBar from "../Dashboard Sections/SideNavBar";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import {
  User,
  Mail,
  Car,
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";

function AppointmentForm() {
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user.userId;

  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [garages, setGarages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [formData, setFormData] = useState({
    registrationNumber: "",
    serviceId: "",
    garageId: "",
    appointmentDate: "",
    appointmentTime: "",
    canWait: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const vehicleRes = await fetch(
          `http://localhost:8080/api/vehicles/user/${userId}`
        );
        const vehiclesData = await vehicleRes.json();
        setVehicles(vehiclesData);

        const serviceRes = await fetch("http://localhost:8080/api/services");
        const servicesData = await serviceRes.json();
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [userId]);

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setFormData((prev) => ({ ...prev, serviceId }));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLat = position.coords.latitude;
          const currentLng = position.coords.longitude;
          setLat(currentLat);
          setLng(currentLng);

          try {
            const garageRes = await fetch(
              `http://localhost:8080/api/user/garages/nearby-service?lat=${currentLat}&lng=${currentLng}&serviceId=${serviceId}`
            );
            const garageData = await garageRes.json();
            setGarages(garageData);
          } catch (error) {
            console.error("Error fetching garages:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation not supported.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      userId,
      userName: user.name,
      userEmail: user.email,
    };

    try {
      const res = await fetch("http://localhost:8080/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.text();

      if (res.ok) {
        setModalMessage(data);
        setFormData({
          registrationNumber: "",
          serviceId: "",
          garageId: "",
          appointmentDate: "",
          appointmentTime: "",
          canWait: "",
        });
        setGarages([]);
      } else {
        setModalMessage(`❌ Booking failed: ${data || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setModalMessage("❌ Network error. Please try again.");
    }

    setShowModal(true);
  };

  const generateTimeSlots = (startHour, endHour) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const start = `${hour.toString().padStart(2, "0")}:00`;
      const label = formatHour(hour);
      slots.push({ value: start, label });
    }
    return slots;
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour.toString().padStart(2, "0")}:00 ${period}`;
  };

  const timeSlots = generateTimeSlots(9, 21); // 9AM to 9PM

  return (
    <div className="dashboard-container d-flex">
      <SideNavBar />
      <div className="content-area">
        <Container className="p-4">
          <h2 className="mb-4">Book Appointment</h2>
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
            {/* Name */}
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>
                <User size={18} className="me-2" />
                Name
              </Form.Label>
              <Form.Control type="text" value={user.name} readOnly />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>
                <Mail size={18} className="me-2" />
                Email
              </Form.Label>
              <Form.Control type="email" value={user.email} readOnly />
            </Form.Group>

            {/* Vehicle */}
            <Form.Group className="mb-3" controlId="formVehicle">
              <Form.Label>
                <Car size={18} className="me-2" />
                Vehicle Registration Number
              </Form.Label>
              <Form.Select
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle.vehicleId}
                    value={vehicle.registrationNumber}
                  >
                    {vehicle.registrationNumber}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Service */}
            <Form.Group className="mb-3" controlId="formService">
              <Form.Label>
                <Wrench size={18} className="me-2" />
                Service Needed
              </Form.Label>
              <Form.Select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleServiceChange}
                required
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Garage */}
            <Form.Group className="mb-3" controlId="formGarage">
              <Form.Label>
                <Wrench size={18} className="me-2" />
                Garage
              </Form.Label>
              <Form.Select
                name="garageId"
                value={formData.garageId}
                onChange={handleChange}
                required
              >
                <option value="">Select Garage</option>
                {garages.map((garage) => (
                  <option key={garage.garageId} value={garage.garageId}>
                    {garage.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Date */}
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>
                <Calendar size={18} className="me-2" />
                Date
              </Form.Label>
              <Form.Control
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Time */}
            <Form.Group className="mb-3" controlId="formTime">
              <Form.Label>
                <Clock size={18} className="me-2" />
                Time
              </Form.Label>
              <Form.Select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              >
                <option value="">Select Time Slot</option>
                {timeSlots.map((slot, idx) => (
                  <option key={idx} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Can Wait */}
            <Form.Group className="mb-4" controlId="formCanWait">
              <Form.Label>
                Can you wait if a mechanic is not immediately available?
              </Form.Label>
              <Form.Select
                name="canWait"
                value={formData.canWait}
                onChange={handleChange}
                required
              >
                <option value="">Select Yes or No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Book Appointment
            </Button>
          </Form>

          {/* Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Appointment Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{modalMessage}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
}

export default AppointmentForm;
