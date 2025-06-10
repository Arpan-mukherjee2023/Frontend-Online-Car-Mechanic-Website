import React from 'react'
import GarageNavBar from "./GarageNavBar";
import GarageNotification from "./GarageNotification";

function GarageOrder() {
  return (
    <div className='dashboard-container'>
        <GarageNavBar />
        <div className="content-area mt-2">
            <GarageNotification />
        </div>
      
    </div>
  )
}

export default GarageOrder
