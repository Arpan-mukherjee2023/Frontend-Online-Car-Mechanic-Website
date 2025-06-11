import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import mech from "../Media/login-page.jpg";

function Signup() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",

    // Additional fields for Garage
    proprietorName: "",
    locationAddress: "",
    openingTime: "",
    closingTime: "",
    garageType: "",
  });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGeoError(null);
      },
      (error) => {
        setGeoError("Unable to retrieve your location");
        console.error(error);
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",

      proprietorName: "",
      locationAddress: "",
      openingTime: "",
      closingTime: "",
      garageType: "",
    });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    if (selectedCategory === "Garage") {
      getUserLocation();
    } else {
      // reset location on User category
      setLatitude(null);
      setLongitude(null);
      setGeoError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      console.log("Please select a category");
      return;
    }

    if (category === "User") {
      const BASE_URL = "http://localhost:8080/api/users/register";

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User registration success:", data);
        navigate("/login");
      } else {
        console.log("Error registering user");
      }
    } else if (category === "Garage") {
      // Generate garageId based on email prefix + random 3 digits
      const emailPrefix = formData.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ""); // sanitize for safety
      const randomNum = Math.floor(100 + Math.random() * 900);
      const garageId = `${emailPrefix}${randomNum}`;

      const BASE_URL = "http://localhost:8080/api/user/garages/register";
      const payload = {
        garageId,
        category,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        proprietorName: formData.proprietorName,
        locationAddress: formData.locationAddress,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        garageType: formData.garageType,
        latitude, // from state
        longitude, // from state
      };

      console.log(payload);

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.text();
        setModalTitle("Success");
        setModalMessage(data);
        setShowModal(true);
        navigate("/login");
      } else {
        setModalTitle("Error");
        setModalMessage("Error registering garage");
        setShowModal(true);
      }
    }

    // reset form after submission
    resetData();
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1 className="mb-4">SignUp Form</h1>
        <hr />
        <div className="form-image">
          <img
            src={mech}
            alt="Signup visual"
            style={{ height: "70vh", borderRadius: "20px" }}
          />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="category-select" className="py-1">
                User or Garage
              </label>
              <select
                className="form-control"
                id="category-select"
                value={category}
                name="category"
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select Category</option>
                <option value="User">User</option>
                <option value="Garage">Garage</option>
              </select>
            </div>

            {/* Name field: label changes depending on category */}
            <div className="form-group py-1">
              <label htmlFor="user-name" className="py-1">
                {category === "Garage" ? "Garage Name" : "Full Name"}
              </label>
              <input
                type="text"
                className="form-control"
                id="user-name"
                name="name"
                placeholder={
                  category === "Garage"
                    ? "Enter Garage Name"
                    : "Enter Full Name"
                }
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email field: label changes depending on category */}
            <div className="form-group py-1">
              <label htmlFor="user-email" className="py-1">
                {category === "Garage" ? "Garage Email" : "Email address"}
              </label>
              <input
                type="email"
                className="form-control"
                id="user-email"
                name="email"
                placeholder={
                  category === "Garage" ? "Enter Garage Email" : "Enter email"
                }
                value={formData.email}
                onChange={handleChange}
                required
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>

            {/* Phone Number */}
            <div className="form-group py-1">
              <label htmlFor="user-number" className="py-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="user-number"
                name="phone"
                placeholder="Enter Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group py-1">
              <label htmlFor="user-password" className="py-1">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="user-password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Additional Garage fields */}
            {category === "Garage" && (
              <>
                <div className="form-group py-1">
                  <label htmlFor="proprietor-name" className="py-1">
                    Proprietor Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="proprietor-name"
                    name="proprietorName"
                    placeholder="Enter Proprietor Name"
                    value={formData.proprietorName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group py-1">
                  <label htmlFor="location-address" className="py-1">
                    Location Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="location-address"
                    name="locationAddress"
                    placeholder="Enter Location Address"
                    value={formData.locationAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group py-1">
                  <label htmlFor="opening-time" className="py-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="opening-time"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group py-1">
                  <label htmlFor="closing-time" className="py-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="closing-time"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group py-1">
                  <label htmlFor="garage-type" className="py-1">
                    Garage Type
                  </label>
                  <select
                    className="form-control"
                    id="garage-type"
                    name="garageType"
                    value={formData.garageType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Garage Type</option>
                    <option value="AUTHORIZED">AUTHORIZED</option>
                    <option value="FREELANCER">FREELANCER</option>
                    <option value="MULTI_BRAND">MULTI_BRAND</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-check py-1">
              <input
                type="checkbox"
                className="form-check-input"
                id="check-it"
                required
              />
              <label className="form-check-label" htmlFor="check-it">
                Agree to terms and conditions
              </label>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </form>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Signup;
