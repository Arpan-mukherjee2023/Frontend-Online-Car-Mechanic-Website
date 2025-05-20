import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import mech from "../Media/login-page.jpg";


function Signup() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const resetData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category === "User") {
      const BASE_URL = 'http://localhost:8080/api/users/register'
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if(response.ok) {
        const data = response.json;

        console.log('success ', data);
        navigate("/login");    

      } else {
        console.log('Error');
      }
  

    } else {
      console.log("error");
    }
    resetData();
  };




  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1 className="mb-4">SignUp Form</h1>
        <hr />
        <div className="form-image">
          <img src={mech} style={{ height: "70vh", borderRadius: "20px" }} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1" className="py-1">
                User or Garage
              </label>
              <select
                className="form-control"
                id="category-select"
                value={category}
                name="category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="User">User</option>
                <option value="Garage">Garage</option>
              </select>
            </div>

            <div className="form-group py-1">
              <label htmlFor="user-name" className="py-1">
                Full Name
              </label>
              <input
                type="email"
                className="form-control"
                id="user-name"
                name="name"
                aria-describedby="emailHelp"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group py-1">
              <label htmlFor="user-email" className="py-1">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="user-email"
                name="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>

            <div className="form-group py-1">
              <label htmlFor="user-number" className="py-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="user-number"
                name="phone"
                aria-describedby="phoneHelp"
                placeholder="Enter Phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

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
              />
            </div>

            <div className="form-check py-1">
              <input
                type="checkbox"
                className="form-check-input"
                id="check-it"
              />
              <label className="form-check-label" htmlFor="check-it">
                Check me out
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
