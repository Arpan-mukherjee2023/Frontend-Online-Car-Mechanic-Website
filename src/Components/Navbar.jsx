import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../Media/logo-automobile.png'
function Navbar() {
  return (
    <div className="container-fluid">
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div className="col-md-3 mb-2 mb-md-0">
        <img src={logo} width="50" height="50"/>
      </div>

      <nav className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <Link to="/" className="nav-link text-secondary px-4 fw-bold fs-6">Home</Link>
        <Link to="/services" className="nav-link text-secondary px-4 fw-bold fs-6">Services</Link>
        <Link to="/login" className="nav-link text-secondary px-4 fw-bold fs-6">Book Appointment</Link>
        <Link to="/about" className="nav-link text-secondary px-4 fw-bold fs-6">About</Link>
      </nav>

      <div className="col-md-3 text-end">
        <Link to="/login" className="btn btn-outline-secondary me-2">Login</Link>
        <Link to="/signup" className="btn btn-secondary">Sign-up</Link>
      </div>
    </header>
  </div>
  )
}

export default Navbar
