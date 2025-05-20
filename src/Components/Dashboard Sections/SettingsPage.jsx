import React, { useState } from "react";
import { Accordion, Card, Button, Form, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCar,
  FaLock,
  FaHeart,
  FaCreditCard,
  FaHistory,
} from "react-icons/fa";
import SideNavBar from "../Dashboard Sections/SideNavBar";

function SettingsPage() {
  const [newName, setNewName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const user = JSON.parse(localStorage.getItem("userData"));

  const handleclick = async (sublink, updatingEntity) => {

    if (!password) {
      setPasswordError(true);
      setMessage("Please enter your password.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const data = {
      update: "",
      password: password,
      userId: user.userId,
    };

    if (updatingEntity === "name") data.update = newName;
    else if (updatingEntity === "address") data.update = address;
    else if (updatingEntity === "email") data.update = email;
    else if (updatingEntity === "phone") data.update = phoneNumber;

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/settings/${sublink}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Updated Successfully");
        setMessageType("success");
      } else {
        setMessage(result.error || "Updating Unsuccessful");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("An unexpected error occurred");
      setMessageType("error");
    }

    setTimeout(() => setMessage(""), 3000);

    setPassword("");
    setAddress("");
    setEmail("");
    setNewName("");
    setPhoneNumber("");
    setPasswordError(false);
  };

  const handlePasswordClick = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError(true);
      setMessage("New Password and Confirm Password must be same");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      setPasswordError(false);
      return;
    } else {
      const payload = {
        userId: user.userId,
        oldPassword: prevPassword,
        newPassword,
      };


      try {
        const response = await fetch("http://localhost:8080/api/users/settings/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errData = await response.json();
          setMessage(errData.message || "Failed to change password.");
        } else {
          setMessage("Password changed successfully!");
          setMessageType("success");
          setTimeout(() => setMessage(""), 3000);
          // Optionally clear fields
          setPrevPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        }
      } catch (error) {
        console.log(error);
      }
    }
    setPasswordError(false);
  };

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div className="content-area px-4 mt-4">
        <h4 className="mb-4">User Settings</h4>

        {message && (
          <div
            className={`alert ${
              messageType === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <Accordion defaultActiveKey="0" flush>
          {/* Profile Info */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <FaUser className="me-2" /> Profile Info
            </Accordion.Header>
            <Accordion.Body>
              <Accordion flush>
                {/* Update Name */}
                <Accordion.Item eventKey="0-0">
                  <Accordion.Header>Update Name</Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter New Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="New Name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.trim() !== "") {
                              setPasswordError(false);
                            }
                          }}
                          isInvalid={passwordError}
                        />
                        <Form.Control.Feedback type="invalid">
                          Password is required.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={() => handleclick("update-name", "name")}
                      >
                        Update
                      </Button>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Update Address */}
                <Accordion.Item eventKey="0-1">
                  <Accordion.Header>Update Address</Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter New Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="New Address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.trim() !== "") {
                              setPasswordError(false);
                            }
                          }}
                          isInvalid={passwordError}
                        />
                        <Form.Control.Feedback type="invalid">
                          Password is required.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={() => handleclick("update-address", "address")}
                      >
                        Update
                      </Button>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Update Phone Number */}
                <Accordion.Item eventKey="0-2">
                  <Accordion.Header>Update Phone Number</Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter New Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="New Phone Number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.trim() !== "") {
                              setPasswordError(false);
                            }
                          }}
                          isInvalid={passwordError}
                        />
                        <Form.Control.Feedback type="invalid">
                          Password is required.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={() => handleclick("update-phone", "phone")}
                      >
                        Update
                      </Button>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Update Email */}
                <Accordion.Item eventKey="0-3">
                  <Accordion.Header>Update Email</Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter New Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="New Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Enter Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.trim() !== "") {
                              setPasswordError(false);
                            }
                          }}
                          isInvalid={passwordError}
                        />
                        <Form.Control.Feedback type="invalid">
                          Password is required.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={() => handleclick("update-email", "email")}
                      >
                        Update
                      </Button>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>

          {/* Vehicles */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <FaCar className="me-2" /> Vehicles
            </Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                <ListGroup.Item as={Link} to="/user/settings/vehicles/add">
                  Add Vehicle
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/user/settings/vehicles/edit">
                  Edit Vehicle
                </ListGroup.Item>
                <ListGroup.Item
                  as={Link}
                  to="/user/settings/vehicles/documents"
                >
                  Upload Documents
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>

          {/* Account */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <FaLock className="me-2" /> Account
            </Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                <Accordion>
                  <Accordion.Item eventKey="2-0">
                    <Accordion.Header>Change Password</Accordion.Header>
                    <Accordion.Body>
                      <Form>
                        <Form.Group className="mb-3" controlId="prevPassword">
                          <Form.Label>Previous Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter previous password"
                            value={prevPassword}
                            onChange={(e) => {
                              setPrevPassword(e.target.value);
                              if (e.target.value.trim() !== "") {
                                setPasswordError(false);
                              }
                            }}
                            isInvalid={passwordError}
                          />
                          <Form.Control.Feedback type="invalid">
                            Password is required.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="newPassword">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              if (e.target.value.trim() !== "") {
                                setPasswordError(false);
                              }
                            }}
                            isInvalid={passwordError}
                          />
                          <Form.Control.Feedback type="invalid">
                            Password is required.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="confirmNewPassword"
                        >
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmNewPassword}
                            onChange={(e) => {
                              setConfirmNewPassword(e.target.value);
                              if (e.target.value.trim() !== "") {
                                setPasswordError(false);
                              }
                            }}
                            isInvalid={passwordError}
                          />
                          <Form.Control.Feedback type="invalid">
                            Password is required.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                          variant="primary"
                          onClick={() => handlePasswordClick()}
                        >
                          Change Password
                        </Button>
                      </Form>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <ListGroup.Item as={Link} to="/settings/account/delete">
                  Delete Account
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/settings/account/deactivate">
                  Deactivate Account
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>

          {/* Favourites */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <FaHeart className="me-2" /> Favourites
            </Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                <ListGroup.Item as={Link} to="/user/settings/favourites/garages">
                  Garages
                </ListGroup.Item>
                <ListGroup.Item as={Link} to="/user/settings/favourites/mechanics">
                  Mechanics
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>

          {/* Payment Methods */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <FaCreditCard className="me-2" /> Payment Methods
            </Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                <ListGroup.Item as={Link} to="/settings/payment-methods/add">
                  Add New Card
                </ListGroup.Item>
                <ListGroup.Item
                  as={Link}
                  to="/settings/payment-methods/history"
                >
                  Billing History
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>

          {/* Service History */}
          <Accordion.Item eventKey="5">
            <Accordion.Header>
              <FaHistory className="me-2" /> Service History
            </Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                <ListGroup.Item as={Link} to="/user/settings/service-history">
                  Past Appointments
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}

export default SettingsPage;
