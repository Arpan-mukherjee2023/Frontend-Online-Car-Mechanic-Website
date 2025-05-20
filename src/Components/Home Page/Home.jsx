import React from 'react'
import Caraousel from './Caraousel'
import Details from './Details'
import LogoSlider from './LogoSlider'
import Stats from './Stats'


function Home() {
  return (
    <div>
      <div>
        <Caraousel />
      </div>
      <Details />
      <LogoSlider />
      <Stats />
    </div>
  )
}

export default Home
