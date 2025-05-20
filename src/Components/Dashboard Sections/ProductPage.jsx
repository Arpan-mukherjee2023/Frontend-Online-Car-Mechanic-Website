import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Card, CardBody, CardText, CardTitle } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import SideNavBar from "./SideNavBar"; 


const ProductCard = ({ product }) => {
  return (
    <Card className="h-100 shadow-sm border-0 hover-shadow transition">
      {/* Header */}
      <Card.Header className="bg-white border-0">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-1 text-dark fw-semibold">{product.productName}</h5>
            <p className="text-muted small mb-0">{product.productDesc}</p>
          </div>
          <Badge bg="primary" className="text-uppercase px-2 py-1 small">
            {product.productCategory}
          </Badge>
        </div>
      </Card.Header>

      {/* Body */}
      <Card.Body>
        {/* Price */}
        <div className="mb-3">
          <h4 className="text-dark fw-bold mb-0">₹{product.productPrice}</h4>
          <small className="text-muted">per unit</small>
        </div>

        {/* Variants */}
        <div className="mb-4">
          <h6 className="text-secondary fw-semibold mb-2">Variants:</h6>
          <div className="d-flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <Badge
                bg="light"
                text="dark"
                key={variant.variantId}
                className="border border-secondary small"
              >
                {variant.variantType}: {variant.variantValue} ({variant.size})
              </Badge>
            ))}
          </div>
        </div>

        {/* Buy Button */}
        <Button
          variant="primary"
          className="w-100 fw-semibold py-2"
        >
          Buy Now
        </Button>
      </Card.Body>
    </Card>
  );
};


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Replace with your actual API endpoint.  Make sure the port matches!
                const response = await fetch('http://localhost:8080/api/products');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-danger">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4 p-4">
            {products.map((product) => (
                <div key={product.productId} className="col">
                  <ProductCard  product={product} />
                </div>
            ))}
        </div>
    );
};


function ProductPage() {
  return (
    <div className="dashboard-container d-flex overflow-hidden" style={{ minHeight: '100vh' }}>
      <SideNavBar />
      <div
        className="content-area flex-grow-1 p-4 overflow-auto"
        style={{ maxWidth: '100vw' }} // Ensure it doesn't exceed screen width
      >
        <h2 className="mb-3">Products</h2>
        <hr />
        <ProductList />
      </div>
    </div>
  );
}


export default ProductPage;
