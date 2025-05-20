import React from 'react'
import serviceImg from '../../Media/service-hero-img.jpg'
import ServicesCard from './ServicesCard'
import serviceA from '../../Media/service-01.jpg';
import serviceB from '../../Media/service-02.jpg';
import serviceC from '../../Media/service-03.jpg';
import serviceD from '../../Media/service-04.jpg';
import serviceE from '../../Media/service-05.jpg';
import serviceF from '../../Media/service-06.jpg';
import { Link } from 'react-router-dom';




function Services() {
  const heroStyle = {
    backgroundImage: `url(${serviceImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: '100vh',
    borderRadius: '20px'
  }

  const titles = [
    {
      title: 'Engine Diagnostics', 
      caption: 'We are the assistance that assessments genuinely the issues with the vehicle.', 
      image: serviceA
    },
    {
      title: 'Oil and Filters', 
      caption: 'We are the assistance that assessments genuinely the issues with the vehicle.', 
      image: serviceB
    },
    {
      title: 'Brake Repair', 
      caption: 'We are the assistance that assessments genuinely the issues with the vehicle.', 
      image: serviceC
    },
    {
      title: 'Wheen Alignment', 
      caption: 'We are the assistance that assessments genuinely the issues with the vehicle.', 
      image: serviceD
    },
    {
      title: 'General Service', 
      caption: 'We are the assistance that assessments genuinely the issues with the vehicle.', 
      image: serviceE
    },
    {
      title: 'Battery Checking', 
      caption: 'We are the assistance that assessments genuinely the issues with the vehicle.', 
      image: serviceF
    } 
  ]
  return (
    <div>
      <main>
        <section className="py-5 text-center container" style={heroStyle}>
          <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto py-5">
              <h1 className="fw-bold text-white">Our Services</h1>
              <p className="lead text-white">Fast, professional, and hassle-free car maintenance & repair services—anytime, anywhere. Book now and get back on the road with confidence!"</p>
              <p>
                <Link to="/signup" className="btn btn-primary my-2">Book Now</Link>
              </p>
            </div>
          </div>
        </section>

        <div className="album py-5 bg-body-tertiary">
          <div className="container">

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {
                titles.map((item, index) => (
                  <ServicesCard title={item.title} caption={item.caption} image={item.image} key={index}/>
                ))
              }
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default Services
