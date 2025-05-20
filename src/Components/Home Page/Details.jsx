import React from 'react'
import { FaCar } from "react-icons/fa";

import mechanics from '../../Media/expert_mechanic.jpg'
import engine from '../../Media/engine_upgrades.jpg'
import quick from '../../Media/quick_service.jpg'
import Card from './Card';

function Details() {

  const contents = [
    "We will help return your car to a functioning condition",
  ]
  return (
    <div class="container-details px-4 py-5 details" id="featured-3">
    <h2 class="pb-2 border-bottom fs-1">Find your Mechanic</h2>
    <div class="d-flex flex-row jutify-content-around" style={{height: '300px'}}>
      <Card title="Expert Mechanic" image={mechanics} content={contents[0]}/>
      <Card title="Engine Upgrades" image={engine} content={contents[0]}/>
      <Card title="Quick Services" image={quick} content={contents[0]}/>
    </div>
  </div>
  )
}

export default Details
