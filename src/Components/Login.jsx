import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import mech from "../Media/login-page.jpg";
import { UserContext } from "../Context/UserContext.jsx";

function Login() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const BASE_URL =
      category === "User"
        ? "http://localhost:8080/api/users/login"
        : "http://localhost:8080/api/user/garages/login";

    // console.log(formData);

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success", data);

        if (category === "User") {
          localStorage.setItem("userData", JSON.stringify(data)); // if you want to store the whole object
        } else {
          localStorage.setItem("garageData", JSON.stringify(data)); // if you want to store the whole object
        }

        // Optional: update context too if you're using it
        setUser(data);

        // Navigate to the appropriate dashboard
        navigate(category === "User" ? "/user/dashboard" : "/garage/dashboard");
      } else {
        console.log("Login failed", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        <div className="row g-0">
          <div className="col-md-6 d-none d-md-block">
            <img
              src={mech}
              alt="Login Visual"
              className="img-fluid rounded-start"
              style={{
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          </div>
          <div className="col-md-6">
            <div className="card-body">
              <h2 className="card-title mb-4 text-center">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="category-select" className="form-label">
                    Login As
                  </label>
                  <select
                    className="form-select"
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="User">User</option>
                    <option value="Garage">Garage</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="user-email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="user-email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="user-password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="user-password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="check-it"
                  />
                  <label className="form-check-label" htmlFor="check-it">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!category || !formData.email || !formData.password}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
