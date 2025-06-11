import React, { useState } from "react";
import GarageNavBar from "./GarageNavBar";
import {
  Container,
  Card,
  ListGroup,
  Row,
  Col,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import {
  User,
  Wrench,
  Bell,
  HelpCircle,
  Info,
  PlusCircle,
  Phone,
  Mail,
  IdCard,
  MapPin,
  BadgeCheck,
  UserCog,
  Star,
  Users,
} from "lucide-react";

function GarageSettings() {
  const [showAddMechanic, setShowAddMechanic] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showListMechanic, setShowListMechanic] = useState(false);
  const [mechanicList, setMechanicList] = useState([]);

  const garage = JSON.parse(localStorage.getItem("garageData"));
  const garageId = garage?.garageId; // optional chaining to avoid errors if garage missing

  const [formData, setFormData] = useState({
    mechanicName: "",
    mechanicPhoneNumber: "",
    mechanicEmail: "",
    mechanicAadharNumber: "",
    mechanicAddress: "",
    mechanicAge: "",
    specialization: "",
    yearsOfExperience: "",
    isAvailable: true,
    garageId: "", // will be set on submit
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchAndShowMechanics = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/mechanics/garage/${garageId}`
      );
      if (!response.ok) throw new Error("Failed to fetch mechanics");
      const data = await response.json();
      console.log(data);

      setMechanicList(data);
      setShowListMechanic(true);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
      setAlertMessage("Failed to load mechanics.");
      setShowAlertModal(true);
    }
  };

  const handleAddMechanic = async () => {
    try {
      if (!garageId) {
        setAlertMessage("Garage ID not found. Please log in again.");
        setShowAlertModal(true);
        return;
      }

      const mechanicData = {
        ...formData,
        mechanicAge: parseInt(formData.mechanicAge, 10), 
        yearsOfExperience: parseInt(formData.yearsOfExperience, 10), 
        isAvailable: !!formData.isAvailable, 
        garageId: garageId,
      };


      const response = await fetch(
        "http://localhost:8080/api/mechanics/add-mechanic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mechanicData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register mechanic");
      }

      const data = await response.text();

      setFormData({
        mechanicName: "",
        mechanicPhoneNumber: "",
        mechanicEmail: "",
        mechanicAadharNumber: "",
        mechanicAddress: "",
        mechanicAge: "",
        specialization: "",
        yearsOfExperience: "",
        isAvailable: true,
        garageId: "",
      });

      setShowAddMechanic(false);
      setAlertMessage(data);
      setShowAlertModal(true);
    } catch (error) {
      console.error("Error registering mechanic:", error);
      setAlertMessage("Error registering mechanic. Please try again.");
      setShowAlertModal(true);
    }
  };

  const settingsOptions = [
    { icon: <User />, label: "Profile" },
    { icon: <Info />, label: "Garage Info" },
    {
      icon: <Wrench />,
      label: "Add Mechanic",
      action: () => setShowAddMechanic(true),
    },
    {
      icon: <User />,
      label: "List Mechanics",
      action: () => fetchAndShowMechanics(),
    },

    { icon: <Bell />, label: "Notifications" },
    { icon: <HelpCircle />, label: "Help & Support" },
  ];

  return (
    <div className="dashboard-container">
      <GarageNavBar />
      <div className="content-area mt-2">
        <Container className="mt-4">
          <h3 className="mb-4">Settings</h3>

          <ListGroup>
            {settingsOptions.map((item, idx) => (
              <ListGroup.Item
                key={idx}
                action={!!item.action}
                onClick={item.action}
                className="d-flex align-items-center gap-3"
              >
                {item.icon}
                <span>{item.label}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Modal: Add Mechanic */}
          <Modal
            show={showAddMechanic}
            onHide={() => setShowAddMechanic(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <PlusCircle className="me-2" size={20} />
                Add Mechanic
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mechanic Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="mechanicName"
                        value={formData.mechanicName}
                        onChange={handleChange}
                        placeholder="Enter mechanic name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="mechanicPhoneNumber"
                        value={formData.mechanicPhoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="mechanicEmail"
                        value={formData.mechanicEmail}
                        onChange={handleChange}
                        placeholder="Enter email"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Aadhar Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="mechanicAadharNumber"
                        value={formData.mechanicAadharNumber}
                        onChange={handleChange}
                        placeholder="Enter Aadhar number"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="mechanicAddress"
                        value={formData.mechanicAddress}
                        onChange={handleChange}
                        placeholder="Enter full address"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="mechanicAge"
                        value={formData.mechanicAge}
                        onChange={handleChange}
                        placeholder="Enter age"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Specialization</Form.Label>
                      <Form.Control
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g., Engine, AC"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Years of Experience</Form.Label>
                      <Form.Control
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        placeholder="e.g., 5"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="isAvailableCheck">
                  <Form.Check
                    type="checkbox"
                    label="Is Available"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleAddMechanic}>
                  Add Mechanic
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>

      <Modal
        show={showAlertModal}
        onHide={() => setShowAlertModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{alertMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlertModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showListMechanic}
        onHide={() => setShowListMechanic(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">
            <Users className="me-2 mb-1" size={20} />
            Mechanics List
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {mechanicList.length === 0 ? (
            <p className="text-muted text-center">No mechanics found.</p>
          ) : (
            <ListGroup variant="flush">
              {mechanicList.map((mech, index) => (
                <ListGroup.Item
                  key={index}
                  className="mb-3 border rounded px-4 py-3 shadow-sm"
                >
                  <Row>
                    <Col md={6} className="mb-2">
                      <h6 className="fw-bold mb-2 d-flex align-items-center">
                        <UserCog size={18} className="me-2" />
                        {mech.name}
                      </h6>
                      <div className="mb-1 d-flex align-items-center">
                        <BadgeCheck size={16} className="me-2" />
                        <strong>Specialization:</strong>&nbsp;
                        {mech.specialization}
                      </div>
                      <div className="mb-1 d-flex align-items-center">
                        <IdCard size={16} className="me-2" />
                        <strong>Aadhar:</strong>&nbsp;{mech.aadharNumber}
                      </div>
                      <div className="mb-1 d-flex align-items-center">
                        <MapPin size={16} className="me-2" />
                        <strong>Address:</strong>&nbsp;{mech.address}
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-1 d-flex align-items-center">
                        <Phone size={16} className="me-2" />
                        <strong>Phone:</strong>&nbsp;{mech.phoneNumber}
                      </div>
                      <div className="mb-1 d-flex align-items-center">
                        <Mail size={16} className="me-2" />
                        <strong>Email:</strong>&nbsp;{mech.email}
                      </div>
                      <div className="mb-1 d-flex align-items-center">
                        <strong>Age:</strong>&nbsp;{mech.age}
                      </div>
                      <div className="mb-1 d-flex align-items-center">
                        <strong>Experience:</strong>&nbsp;{mech.exp} years
                      </div>
                      <div className="mb-1 d-flex align-items-center">
                        <strong>Available:</strong>&nbsp;
                        {mech.isAvailable ? "Yes" : "No"}
                      </div>
                      <div className="d-flex align-items-center">
                        <Star size={16} className="me-2 text-warning" />
                        <strong>Rating:</strong>&nbsp;{mech.rating ?? "N/A"}
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowListMechanic(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GarageSettings;
