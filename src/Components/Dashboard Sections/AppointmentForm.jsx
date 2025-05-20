import React, { useEffect, useState } from "react";
import SideNavBar from "../Dashboard Sections/SideNavBar";

function AppointmentForm() {
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user.userId;

  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [garages, setGarages] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  const [formData, setFormData] = useState({
    registrationNumber: "",
    serviceId: "",
    garageId: "",
    appointmentDate: "",
    appointmentTime: "",
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

          console.log("Latitude:", currentLat, "Longitude:", currentLng);

          try {
            const garageRes = await fetch(
              `http://localhost:8080/api/user/garages/nearby-service?lat=${currentLat}&lng=${currentLng}&serviceId=${serviceId}`
            );
            const garageData = await garageRes.json();
            setGarages(garageData);
            console.log(garageData);
          } catch (error) {
            console.error("Error fetching garages:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      userId,
      userName: user.name,
      userEmail: user.email,
    };

    console.log(payload);

    try {
      const res = await fetch("http://localhost:8080/api/appointments/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalMessage("✅ Appointment booked successfully!");
      } else {
        const errorData = await res.json();
        console.log(errorData)
        setModalMessage(
          `❌ Booking failed: ${errorData.message || "Unknown error"}`
        );
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
      const end = `${(hour + 1).toString().padStart(2, "0")}:00`;

      const label = `${formatHour(hour)} - ${formatHour(hour + 1)}`;
      slots.push({ value: start, label });
    }
    return slots;
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour.toString().padStart(2, "0")}:00 ${period}`;
  };

  const timeSlots = generateTimeSlots(9, 21); // from 9AM to 9PM

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div className="content-area">
        <div className="container mt-4">
          <h2>Book Appointment</h2>
          <form
            onSubmit={handleSubmit}
            className="card p-4 shadow-sm rounded-4"
          >
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={user.name}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={user.email}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Vehicle Registration Number</label>
              <select
                className="form-select"
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
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Service Needed</label>
              <select
                className="form-select"
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
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Garage</label>
              <select
                className="form-select"
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
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Time</label>
              <select
                className="form-select"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              >
                <option value="">Select Time Slot</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Book Appointment
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentForm;
