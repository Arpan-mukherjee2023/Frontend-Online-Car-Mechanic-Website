import React, { useEffect, useState } from 'react';
import { Button, Modal, Container, Card, Row, Col } from 'react-bootstrap';
import { Info, Phone, Mail, Calendar, BadgeIndianRupee } from 'lucide-react';

const GarageOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const garage = JSON.parse(localStorage.getItem("garageData"));
  const garageId = garage.garageId;

  useEffect(() => {
    fetch(`http://localhost:8080/api/orders/garage/${garageId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then(data => setOrders(data))
      .catch(err => console.error("❌ Error:", err));
  }, [garageId]);

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4">📦 Orders for Garage: <strong>{garageId}</strong></h3>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {orders.map((order, index) => (
            <Col key={index}>
              <Card className="shadow-sm border-info">
                <Card.Body>
                  <Card.Title>
                    🧾 {order.productName}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    ₹{order.totalAmount} • {order.paymentMode}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>User:</strong> {order.userName}<br />
                    <strong>Status:</strong> {order.paymentStatus}
                  </Card.Text>
                  <Button variant="outline-info" onClick={() => handleOpen(order)}>
                    <Info className="me-2" size={18} /> Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for order details */}
      {selectedOrder && (
        <Modal show={showModal} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>🧾 Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 className="mb-3">👤 Customer Info</h5>
            <p><strong>Name:</strong> {selectedOrder.userName}</p>
            <p><Phone size={16} className="me-2" />{selectedOrder.userPhoneNumber}</p>
            <p><Mail size={16} className="me-2" />{selectedOrder.userEmailId}</p>

            <hr />
            <h5 className="mb-3">📦 Order Info</h5>
            <p><strong>Product:</strong> {selectedOrder.productName}</p>
            <p><strong>Variant:</strong> {selectedOrder.productVariantName}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
            <p><BadgeIndianRupee size={16} className="me-2" /> <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
            <p><strong>Payment:</strong> {selectedOrder.paymentMode} | Status: {selectedOrder.paymentStatus}</p>
            <p><Calendar size={16} className="me-2" /> <strong>Date:</strong> {selectedOrder.orderDate}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default GarageOrderList;
