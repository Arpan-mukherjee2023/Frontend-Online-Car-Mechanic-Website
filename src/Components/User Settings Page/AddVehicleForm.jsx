import React, { useState, useEffect } from "react";
import SideNavBar from "../Dashboard Sections/SideNavBar";

import {
  Button,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  FormSelect,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddVehicleForm = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    registrationNumber: "",
    vin: "",
    year: "",
    purchaseDate: null,
    userId: null, // initialized to empty string
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user && user.userId) {
      setFormData((prev) => ({
        ...prev,
        user: { userId: user.userId },
      }));
    } else {
      alert("User not found. Please login again.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      purchaseDate: date,
    }));
    setFormErrors((prev) => ({ ...prev, purchaseDate: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const errors = {};
    if (!formData.make.trim()) errors.make = "Make is required";
    if (!formData.model.trim()) errors.model = "Model is required";
    if (!formData.registrationNumber.trim())
      errors.registrationNumber = "Registration Number is required";
    if (!formData.vin.trim()) errors.vin = "VIN is required";
    if (!formData.year) errors.year = "Year is required";
    if (!formData.purchaseDate)
      errors.purchaseDate = "Purchase date is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        make: formData.make,
        model: formData.model,
        registrationNumber: formData.registrationNumber,
        vin: formData.vin,
        year: parseInt(formData.year),
        purchaseDate: formData.purchaseDate.toISOString().split("T")[0],
        userId: user.userId
      };

      console.log(payload);

      const response = await fetch(`http://localhost:8080/api/vehicles/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(result, payload);

      if (response.ok) {
        alert("Vehicle added successfully!");
        setFormData((prev) => ({
          make: "",
          model: "",
          registrationNumber: "",
          vin: "",
          year: "",
          purchaseDate: null,
          userId: user.userId, // retain user ID
        }));
      } else {
        alert("Failed to add vehicle. " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div className="content-area mt-2">
        <div className="container mt-4 mb-5">
          <h3 className="mb-4">Add Vehicle</h3>
          <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
            <div className="row">
              <FormGroup className="col-md-6 mb-3">
                <FormLabel>Make</FormLabel>
                <FormControl
                  type="text"
                  name="make"
                  placeholder="e.g., Toyota"
                  value={formData.make}
                  onChange={handleChange}
                  isInvalid={!!formErrors.make}
                  disabled={isSubmitting}
                />
                <FormControl.Feedback type="invalid">
                  {formErrors.make}
                </FormControl.Feedback>
              </FormGroup>

              <FormGroup className="col-md-6 mb-3">
                <FormLabel>Model</FormLabel>
                <FormControl
                  type="text"
                  name="model"
                  placeholder="e.g., Camry"
                  value={formData.model}
                  onChange={handleChange}
                  isInvalid={!!formErrors.model}
                  disabled={isSubmitting}
                />
                <FormControl.Feedback type="invalid">
                  {formErrors.model}
                </FormControl.Feedback>
              </FormGroup>
            </div>

            <div className="row">
              <FormGroup className="col-md-6 mb-3">
                <FormLabel>Registration Number</FormLabel>
                <FormControl
                  type="text"
                  name="registrationNumber"
                  placeholder="e.g., WB12AB1234"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  isInvalid={!!formErrors.registrationNumber}
                  disabled={isSubmitting}
                />
                <FormControl.Feedback type="invalid">
                  {formErrors.registrationNumber}
                </FormControl.Feedback>
              </FormGroup>

              <FormGroup className="col-md-6 mb-3">
                <FormLabel>VIN</FormLabel>
                <FormControl
                  type="text"
                  name="vin"
                  placeholder="e.g., 1HGCM82633A123456"
                  value={formData.vin}
                  onChange={handleChange}
                  isInvalid={!!formErrors.vin}
                  disabled={isSubmitting}
                />
                <FormControl.Feedback type="invalid">
                  {formErrors.vin}
                </FormControl.Feedback>
              </FormGroup>
            </div>

            <div className="row">
              <FormGroup className="col-md-6 mb-3">
                <FormLabel>Year</FormLabel>
                <FormSelect
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  isInvalid={!!formErrors.year}
                  disabled={isSubmitting}
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </FormSelect>
                <FormControl.Feedback type="invalid">
                  {formErrors.year}
                </FormControl.Feedback>
              </FormGroup>

              <FormGroup className="col-md-6 mb-3">
                <FormLabel>Purchase Date</FormLabel>
                <DatePicker
                  selected={formData.purchaseDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  placeholderText="Select purchase date"
                  className={`form-control ${
                    formErrors.purchaseDate ? "is-invalid" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {formErrors.purchaseDate && (
                  <div className="invalid-feedback">
                    {formErrors.purchaseDate}
                  </div>
                )}
              </FormGroup>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Vehicle"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleForm;
