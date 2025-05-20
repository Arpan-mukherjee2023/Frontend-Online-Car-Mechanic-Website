import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

function SideNavBar() {
  const user = JSON.parse(localStorage.getItem('userData'));
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
        <span className="fs-4 text-dark">SideBar</span>
      </a>
      <hr className="text-white" />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/user/dashboard"
            className={`nav-link ${
              location.pathname === "/user/dashboard" ? "active" : ""
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
            to="/user/garage"
            className={`nav-link ${
              location.pathname === "/user/garage" ? "active" : ""
            }`}
            onClick={() => handleSectionClick("Garages")}
            style={{ color: "#black" }} // Light color for default links
          >
            Garages
          </Link>
        </li>
        <li>
          <Link
            to="/user/appointment"
            className={`nav-link ${
              location.pathname === "/user/appointment" ? "active" : ""
            }`}
            onClick={() => handleSectionClick("Appointments")}
            style={{ color: "#black" }} // Light color for default links
          >
            Appointments
          </Link>
        </li>
        <li>
          <Link
            to="/user/product"
            className={`nav-link ${
              location.pathname === "/user/product" ? "active" : ""
            }`}
            onClick={() => handleSectionClick("Products")}
            style={{ color: "#black" }} // Light color for default links
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            to="/user/settings"
            className={`nav-link ${
              location.pathname === "/user/settings" ? "active" : ""
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
          {user && <strong>{user.name}</strong>}
        </Link>
        <ul className="dropdown-menu text-small shadow bg-light" style={{ width: "200px" }}>
          <li>
            <Link className="dropdown-item" to="/user/settings">
              Settings
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/user/myProfile">
              Profile
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <Link className="dropdown-item" to="/user/signout">
              Sign out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideNavBar;
