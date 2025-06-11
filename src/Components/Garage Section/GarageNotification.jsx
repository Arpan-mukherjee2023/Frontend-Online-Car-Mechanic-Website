import React, { useState } from "react";
import useWebSocket from "../Custom Hooks/useWebSocket";
import { Modal, Button, ListGroup, Container, Row, Col, Badge } from "react-bootstrap";
import { Info, X } from "lucide-react";

const GarageNotification = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const garage = JSON.parse(localStorage.getItem("garageData"));
  const garageId = garage.garageId;

  useWebSocket(garageId, (order) => {
    setOrders((prev) => [order, ...prev]); // newest first
  });

  return (
    <Container className="my-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4 text-primary text-center">Orders for Garage: <Badge bg="info">{garageId}</Badge></h2>

      {orders.length === 0 ? (
        <p className="text-muted text-center">No orders yet.</p>
      ) : (
        <ListGroup>
            {console.log(orders)}
          {orders.map((order) => (
            <ListGroup.Item 
              key={order.orderId} 
              action 
              onClick={() => setSelectedOrder(order)}
              className="d-flex justify-content-between align-items-center"
              title="Click to view details"
            >
              <div>
                <Info className="me-2 text-primary" size={18} />
                <strong>Order #{order.orderId}</strong> &mdash; Qty: {order.quantity}
              </div>
              <Badge bg="success" pill>₹{order.totalAmount.toFixed(2)}</Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Details Modal */}
      <Modal
        show={!!selectedOrder}
        onHide={() => setSelectedOrder(null)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Order Details #{selectedOrder?.orderId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Customer:</Col>
                <Col>{selectedOrder.userName}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Email:</Col>
                <Col>{selectedOrder.userEmailId}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Phone Number:</Col>
                <Col>{selectedOrder.userPhoneNumber}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Order Date:</Col>
                <Col>{selectedOrder.orderDate}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Product:</Col>
                <Col>{selectedOrder.productName}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Variant:</Col>
                <Col>{selectedOrder.productVariantName}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Quantity:</Col>
                <Col>{selectedOrder.quantity}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Total Amount:</Col>
                <Col>₹{selectedOrder.totalAmount.toFixed(2)}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Payment Mode:</Col>
                <Col>{selectedOrder.paymentMode}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Payment Status:</Col>
                <Col>
                  <Badge
                    bg={
                      selectedOrder.paymentStatus === "COMPLETED" ? "success" :
                      selectedOrder.paymentStatus === "PENDING" ? "warning" : "danger"
                    }
                    text={selectedOrder.paymentStatus === "PENDING" ? "dark" : "light"}
                  >
                    {selectedOrder.paymentStatus}
                  </Badge>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5} className="fw-semibold">Order Date:</Col>
                <Col>{new Date(selectedOrder.orderDate).toLocaleDateString()}</Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
            <X className="me-2" size={18} />
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GarageNotification;
