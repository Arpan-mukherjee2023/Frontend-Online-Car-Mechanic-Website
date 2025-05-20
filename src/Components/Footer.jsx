import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../Media/logo-automobile.png'

function Footer() {
  return (
    <div className="container">
  <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top">
    <div className="col mb-3 mx-5">
      <img src={logo} width="200" height="200"/>
      <p className="text-body-secondary">© 2024</p>
    </div>

    <div className="col mb-3">
      <h5>Quick Links</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2"><Link to="/" className="nav-link p-0 text-body-secondar foot-link">Home</Link></li>
        <li className="nav-item mb-2"><Link to="/services" className="nav-link p-0 text-body-secondary foot-link">Services</Link></li>
        <li className="nav-item mb-2"><Link to="/appointment" className="nav-link p-0 text-body-secondary foot-link">Book Appointment</Link></li>
        <li className="nav-item mb-2"><Link to="/faqs" className="nav-link p-0 text-body-secondary foot-link">FAQs</Link></li>
        <li className="nav-item mb-2"><Link to="/about" className="nav-link p-0 text-body-secondary foot-link">About</Link></li>
      </ul>
    </div>

    <div className="col mb-3">
      <h5>Section</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary foot-link">Home</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary foot-link">Features</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary foot-link">Pricing</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary foot-link">FAQs</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary foot-link">About</a></li>
      </ul>
    </div>

    <div className="col mb-3">
      <h5>Section</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Home</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Features</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Pricing</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">FAQs</a></li>
        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">About</a></li>
      </ul>
    </div>
  </footer>
</div>
  )
}

export default Footer
