import React from 'react'
import { Link } from 'react-router-dom'

function ServicesCard({ title, caption, image }) {
  return (
    <div className="col">
      <div className="card shadow-sm">
        <img src={image} className='card-img'/>
        <div className="card-body">
          <h2>{title}</h2>
          <p className="card-text">{caption}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <button type="button" className="btn btn-sm btn-outline-secondary"><Link to="/login" style={{textDecoration: 'none', color: '#000'}}>Know More</Link></button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesCard
