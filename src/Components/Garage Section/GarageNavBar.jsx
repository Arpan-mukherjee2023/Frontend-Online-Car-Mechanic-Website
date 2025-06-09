import React, { useState } from 'react';
import { useLocation, Link } from "react-router-dom";
import logo from "../../Media/logo-automobile.png"

function GarageNavBar() {

  const garage = JSON.parse(localStorage.getItem('garageData'));
  const [activeSection, setActiveSection] = useState("Home");
  const location = useLocation();

  // Function to handle section click
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3"
      style={{
        width: "280px",
        height: "100vh",
        backgroundColor: "#0d6efd", // Primary blue color
        backgroundImage: "linear-gradient(315deg, #0d6efd 0%, #ffffff 74%)", // Soft gradient background
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)", // Slight shadow for depth
      }}
    >
      {/* Top: Logo and Navigation */}
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
      >
        <span className="fs-4 text-dark"><img src={logo} width="50" height="50"/> WRENCHIT</span>
      </a>
      <hr className="text-white" />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/garage/dashboard"
            className={`nav-link ${
              location.pathname === "/garage/dashboard" ? "active" : ""
            }`}
            aria-current="page"
            onClick={() => handleSectionClick("Home")}
            style={{ color: "black" }} // Light color for default links
          >
            Home
          </Link>
        </li>
        
        <li>
          <Link
            to="/garage/appointment"
            className={`nav-link ${
              location.pathname === "/garage/appointment" ? "active" : ""
            }`}
            onClick={() => handleSectionClick("Appointments")}
            style={{ color: "#black" }} // Light color for default links
          >
            Appointments
          </Link>
        </li>
        <li>
          <Link
            to="/garage/product"
            className={`nav-link ${
              location.pathname === "/garage/product" ? "active" : ""
            }`}
            onClick={() => handleSectionClick("Products")}
            style={{ color: "#black" }} // Light color for default links
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            to="/garage/settings"
            className={`nav-link ${
              location.pathname === "/garage/settings" ? "active" : ""
            }`}
            onClick={() => handleSectionClick("Settings")}
            style={{ color: "#black" }} // Light color for default links
          >
            Settings
          </Link>
        </li>
      </ul>

      {/* 🔽 Profile Dropdown pushed to bottom */}
      <hr className="mt-auto text-white" />
      <div className="dropdown">
        <Link
          to="#"
          className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle text-white"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          {garage && <strong>{garage.name}</strong>}
        </Link>
        <ul className="dropdown-menu text-small shadow bg-light" style={{ width: "200px" }}>
          <li>
            <Link className="dropdown-item" to="/garage/settings">
              Settings
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/garage/myProfile">
              Profile
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <Link className="dropdown-item" to="/garage/signout">
              Sign out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GarageNavBar
