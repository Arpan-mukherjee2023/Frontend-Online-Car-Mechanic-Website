import React from 'react'
import audi from '../../Media/audi logo.png'
import bajaj from '../../Media/bajaj logo.png'
import bmw from '../../Media/bmw logo.png'
import ford from '../../Media/ford logo.png'
import honda from '../../Media/honda logo.png'
import hyundai from '../../Media/hyundai logo.png'
import kia from '../../Media/kia logo.png'
import mahindra from '../../Media/mahindra logo.png'
import nissan from '../../Media/nissan logo.png'
import renault from '../../Media/renault logo.png'
import suzuki from '../../Media/suzuki logo.png'
import tata from '../../Media/tata logo.png'
import toyota from '../../Media/toyota logo.png'
import volkswagen from '../../Media/vw logo.png'




function LogoSlider() {

  // add bugatti and ferrari
  const cars  = [audi, bajaj, bmw, ford, honda, hyundai, kia, mahindra, nissan, renault, suzuki, tata, toyota, volkswagen];
  
  return (
    <div className='slider'>
      <div className='slide-track'>

        {cars.map((car, index) => (
            <div className='slide' key={index}>
              <img src={car} style={{ height: "75px", width: "auto", objectFit: "contain" }}></img>
            </div>
          )
        )}

        {cars.map((car, index) => (
            <div className='slide p-4' key={index}>
              <img src={car} style={{ height: "100px", width: "auto", objectFit: "contain" }}></img>
            </div>
          )
        )}
        
      </div>
      
    </div>
  )
}

export default LogoSlider
