import React from 'react'
import GarageNavBar from "./GarageNavBar"
import ProductManagement from "./ProductManagement";
import GarageProductList from "./GarageProductList";

function GarageProduct() {
  return (
    <div className='dashboard-container'>
        <GarageNavBar />
        <div className="content-area mt-2">
          <ProductManagement />
          <GarageProductList />
        </div>
      
    </div>
  )
}

export default GarageProduct
