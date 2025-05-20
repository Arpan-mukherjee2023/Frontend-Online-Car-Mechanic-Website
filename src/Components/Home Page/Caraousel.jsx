import React from 'react'
import crsl1 from '../../Media/crsl1.jpg'
import crsl2 from '../../Media/crsl2.jpg'
import crsl3 from '../../Media/crsl3.jpg'




function Caraousel() {
  return (
    // w-100 h-75 position-absolute
    <div id="carouselExampleCaptions" className="carousel carousel-fade">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={crsl1} className="d-block w-100" alt="..."  />
            <div className="carousel-caption d-none d-md-block">
              <h3>Your car Our Care!</h3>
              <p>Whether it's a breakdown or routine maintenance, we bring expert service to your location.</p>
            </div>
        </div>
        <div className="carousel-item">
          <img src={crsl2} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h3>Trust the Experts</h3>
              <p>We connect you with skilled professionals to ensure your car gets the best care.</p>
            </div>
        </div>
        <div className="carousel-item">
          <img src={crsl3} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h3>Convenience at your fingertips</h3>
              <p>Choose your preferred time, get reliable service, and hit the road with confidence!</p>
            </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>

  )
}

export default Caraousel
