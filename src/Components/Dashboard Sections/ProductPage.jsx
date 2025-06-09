import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert, Row, Col } from "react-bootstrap";
import { Card, Badge } from "react-bootstrap";
import SideNavBar from "./SideNavBar";

const ProductCard = ({ product, onBuyNow }) => {
  return (
    <Card className="h-100 shadow-sm border-0 hover-shadow transition">
      <Card.Header className="bg-white border-0">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-1 text-dark fw-semibold">
              {product.productName}
            </h5>
            <p className="text-muted small mb-0">{product.productDesc}</p>
          </div>
          <Badge bg="primary" className="text-uppercase px-2 py-1 small">
            {product.productCategory}
          </Badge>
        </div>
      </Card.Header>

      <Card.Body>
        <div className="mb-3">
          <h4 className="text-dark fw-bold mb-0">₹{product.productPrice}</h4>
          <small className="text-muted">per unit</small>
        </div>

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

        <Button
          variant="primary"
          className="w-100 fw-semibold py-2"
          onClick={() => onBuyNow(product)}
        >
          Buy Now
        </Button>
      </Card.Body>
    </Card>
  );
};

const ProductList = ({ onBuyNow }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products");
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
          <ProductCard product={product} onBuyNow={onBuyNow} />
        </div>
      ))}
    </div>
  );
};

function ProductPage() {
  // Modal and purchase workflow state
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [garages, setGarages] = useState([]);
  const [selectedGarageId, setSelectedGarageId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [error, setError] = useState("");

  // Open modal when Buy Now clicked
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    // Reset all selections when modal opens
    setSelectedVariantId("");
    setGarages([]);
    setSelectedGarageId("");
    setQuantity("");
    setPaymentMode("");
    setBillDetails(null);
    setError("");
  };

  // Fetch garages for the selected variant
  useEffect(() => {
    if (!selectedProduct || !selectedVariantId) {
      setGarages([]);
      setSelectedGarageId("");
      return;
    }
    fetch(
      `http://localhost:8080/api/garageProducts/product/${selectedProduct.productId}/variant/${selectedVariantId}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch garages");
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setGarages(data);
        setSelectedGarageId("");
      })
      .catch((err) => {
        console.error(err);
        setGarages([]);
        setSelectedGarageId("");
      });
  }, [selectedProduct, selectedVariantId]);

  // Calculate Bill API call
  const calculateBill = () => {
    setError("");
    setBillDetails(null);

    if (!selectedVariantId || !selectedGarageId || !quantity || !paymentMode) {
      setError("Please fill all the fields");
      return;
    }
    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    const user = JSON.parse(localStorage.getItem("userData")); // Assumes user is stored in localStorage
    const requestBody = {
      userId: user.userId, // Or user.userId if stored that way
      garageId: selectedGarageId,
      productId: selectedProduct.productId,
      variantId: Number(selectedVariantId),
      quantity: Number(quantity),
      paymentMode: paymentMode,
    };

    fetch("http://localhost:8080/api/orders/bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Stock not available or input error");
        return res.json();
      })
      .then((data) => {
        console.log(data);

        setBillDetails(data);
      })
      .catch((err) => setError(err.message));
  };

  // Place order API call
  const placeOrder = async () => {
    if (!billDetails) {
      setError("Please calculate bill before placing order.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("userData"));
    // Prepare order data
    const orderData = {
      userId: user.userId,
      productId: selectedProduct.productId,
      variantId: selectedVariantId,
      garageId: selectedGarageId,
      quantity: Number(quantity),
      paymentMode,
    };

    if (paymentMode === "COD") {
      fetch("http://localhost:8080/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to place order");
          return res.json();
        })
        .then(() => {
          alert("Order placed successfully!");
          setShowModal(false);
        })
        .catch((err) => {
          setError(err.message);
        });
    } else if (paymentMode === "ONLINE") {
      try {
        const res = await fetch(
          "http://localhost:8080/api/razorpay/create-order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: billDetails.totalAmount,
              currency: "INR",
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to create Razorpay order");
        const { id: razorpayOrderId, amount, currency } = await res.json();

        const options = {
          key: "rzp_test_ysjNPJ8UuaZa78", // replace with your Razorpay key
          amount,
          currency,
          name: "Garage Store",
          description: "Purchase Product",
          order_id: razorpayOrderId,
          handler: async function (response) {
            // Payment success, now place order
            const confirmOrder = await fetch(
              "http://localhost:8080/api/orders/place",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderRequest),
              }
            );

            if (!confirmOrder.ok)
              throw new Error("Order placement failed after payment");

            alert("Order placed successfully!");
            setShowModal(false);
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: "#0d6efd",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }
  };

  return (
    <div
      className="dashboard-container d-flex overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <SideNavBar />
      <div
        className="content-area flex-grow-1 p-4 overflow-auto"
        style={{ maxWidth: "100vw" }}
      >
        <h2 className="mb-3">Products</h2>
        <hr />
        <ProductList onBuyNow={handleBuyNow} />

        {/* Modal for Buy Now */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Buy {selectedProduct?.productName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Select Variant</Form.Label>
                  <Form.Select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                  >
                    <option value="">Choose...</option>
                    {selectedProduct?.variants.map((v) => (
                      <option key={v.variantId} value={v.variantId}>
                        {v.variantType}: {v.variantValue} ({v.size})
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label>Select Garage</Form.Label>
                  <Form.Select
                    value={selectedGarageId}
                    onChange={(e) => setSelectedGarageId(e.target.value)}
                    disabled={garages.length === 0}
                  >
                    <option value="">Choose...</option>
                    {garages.map((g) => (
                      <option key={g.garageId} value={g.garageId}>
                        {g.garageName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>
                  Quantity ({selectedProduct?.productUnit})
                </Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Payment Mode</Form.Label>
                <Form.Select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="COD">Cash on Delivery</option>
                  <option value="ONLINE">Online Payment</option>
                </Form.Select>
              </Form.Group>

              {/* Bill details */}
              {billDetails && (
                <div className="p-3 bg-light rounded border">
                  <p>
                    <strong>Base Price:</strong> ₹{billDetails.basePrice}
                  </p>
                  <p>
                    <strong>GST:</strong> ₹{billDetails.gst}
                  </p>
                  <p>
                    <strong>Delivery Charge:</strong> ₹
                    {billDetails.deliveryCharge}
                  </p>
                  <hr />
                  <h5>Total Amount: ₹{billDetails.totalAmount}</h5>
                </div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!billDetails ? (
              <Button variant="primary" onClick={calculateBill}>
                Calculate Bill
              </Button>
            ) : (
              <Button variant="success" onClick={placeOrder}>
                Place Order
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default ProductPage;
