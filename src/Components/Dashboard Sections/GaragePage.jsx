import React from 'react'
import SideNavBar from "./SideNavBar";
import NearestGarageCard from './NearestGarageCard'; 
import GarageSearchSection from "./GarageSearchSection";
function GaragePage() {
  return (
    <div className="dashboard-container">
    <SideNavBar />
    <div className="content-area d-flex jutify-content-between">
      <NearestGarageCard />
      <GarageSearchSection />
    </div>
  </div>
  )
}

export default GaragePage
