import React from 'react'
import GarageNavBar from "./GarageNavBar";
import GarageNotification from "./GarageNotification";
import GarageOrderList from "./GarageOrderList";

function GarageOrder() {
  return (
    <div className='dashboard-container'>
        <GarageNavBar />
        <div className="content-area mt-2">
            <GarageNotification />
            <GarageOrderList />
        </div>
      
    </div>
  )
}

export default GarageOrder
