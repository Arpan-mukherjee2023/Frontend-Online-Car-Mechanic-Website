import React, { useEffect, useState } from "react";
import axios from "axios";
import { Info } from "lucide-react";
import { Modal, Button } from "react-bootstrap";

function GarageProductList() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const garageId = JSON.parse(localStorage.getItem("garageData"))?.garageId;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/garageProducts/${garageId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [garageId]);

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Garage Products</h3>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {products.map((product) => (
          <div className="col" key={`${product.productId}-${product.variantValue ? product.variantValue : "noVariant"}`}>
            
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  {product.productName}
                </h5>
                <p className="card-text mb-1 mt-4">
                  <strong>Variant:</strong> {product.variantValue}
                </p>
                <p className="card-text mb-1">
                  <strong>Price:</strong> ₹{product.productPrice} /{" "}
                  {product.productUnit}
                </p>
                <p className="card-text">
                  <strong>Stock:</strong> {product.stock}
                </p>
                <Button
                  variant="outline-primary"
                  onClick={() => handleShowDetails(product)}
                >
                  <Info size={16} className="me-1" /> Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.productName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Description:</strong> {selectedProduct.productDesc}
            </p>
            <p>
              <strong>Variant Type:</strong> {selectedProduct.variantType}
            </p>
            <p>
              <strong>Variant Value:</strong> {selectedProduct.variantValue}
            </p>
            <p>
              <strong>Unit:</strong> {selectedProduct.productUnit}
            </p>
            <p>
              <strong>Price:</strong> ₹{selectedProduct.productPrice}
            </p>
            <p>
              <strong>Stock:</strong> {selectedProduct.stock}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default GarageProductList;
