import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Card } from "react-bootstrap";

const ChatbotModal = () => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState("main");
  const [formData, setFormData] = useState({});
  const [services, setServices] = useState([]);
  const [garages, setGarages] = useState([]);
  const [selectedInput, setSelectedInput] = useState("");

  const user = JSON.parse(localStorage.getItem("userData")) || {};

  const messagesEndRef = useRef(null);

  const timeSlots = [
    { label: "09:00 - 10:00", value: "09:00" },
    { label: "10:00 - 11:00", value: "10:00" },
    { label: "11:00 - 12:00", value: "11:00" },
    { label: "12:00 - 13:00", value: "12:00" },
    { label: "13:00 - 14:00", value: "13:00" },
    { label: "14:00 - 15:00", value: "14:00" },
    { label: "15:00 - 16:00", value: "15:00" },
    { label: "16:00 - 17:00", value: "16:00" },
    { label: "17:00 - 18:00", value: "17:00" },
    { label: "18:00 - 19:00", value: "18:00" },
    { label: "19:00 - 20:00", value: "19:00" },
    { label: "20:00 - 21:00", value: "20:00" },
  ];

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (text, fromBot = false) => {
    setMessages((prev) => [...prev, { text, fromBot }]);
  };

  // The rest of your functions (handleOptionClick, handleProceed, handleTextInput) remain the same
  // I'll keep them here for completeness:

  const handleOptionClick = (option) => {
    if (option === "Book Appointment") {
      fetch("http://localhost:8080/api/services")
        .then((res) => res.json())
        .then((data) => {
          setServices(data);
          sendMessage("Please select a service from the dropdown:", true);
          setStep("selectService");
        })
        .catch((err) => {
          console.error("Service fetch error:", err);
          sendMessage("Failed to load services.", true);
        });
    } else if (option === "Service History") {
      if (!user.userId) {
        sendMessage("You must be logged in to view service history.", true);
        return;
      }
      sendMessage("Fetching your service history...", true);
      fetch(
        `http://localhost:8080/api/service-history/user/${user.userId}`
      )
        .then((res) => res.json())
        .then((history) => {
          if (!history || history.length === 0) {
            sendMessage("No past service records found.", true);
          } else {

            console.log(history);
            
            // Format and send each appointment info
            history.forEach((appt, i) => {

              const dateObj = new Date(appt.serviceStartTime);
              const serviceDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
              
              // Customize the info you want to show based on your API response structure
              const apptMsg = `🛠️ Appointment ${i + 1}:\n- Service: ${
                appt.serviceName || appt.service
              }\n- Garage: ${appt.garageName || appt.garage}\n- Date: ${
                serviceDate
              }\n- Mechanic: ${appt.mechanicName}\n- Status: ${
                appt.status || "Completed"
              }`;
              sendMessage(apptMsg, true);
            });
          }
        })
        .catch((err) => {
          console.error("Service history fetch error:", err);
          sendMessage("Failed to load service history.", true);
        });
    } else {
      sendMessage("This feature is coming soon.", true);
    }
  };

  const handleProceed = () => {
    switch (step) {
      case "selectService": {
        const selectedService = services.find(
          (s) => s.serviceName === selectedInput
        );
        if (selectedService) {
          setFormData((prev) => ({
            ...prev,
            serviceId: selectedService.serviceId,
          }));
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                fetch(
                  `http://localhost:8080/api/user/garages/nearby-service?lat=${lat}&lng=${lng}&serviceId=${selectedService.serviceId}`
                )
                  .then((res) => res.json())
                  .then((data) => {
                    setGarages(data);
                    sendMessage(
                      "Please select a garage from the dropdown:",
                      true
                    );
                    setStep("selectGarage");
                    setSelectedInput("");
                  })
                  .catch((err) => {
                    console.error("Garage fetch error:", err);
                    sendMessage("Failed to load garages.", true);
                  });
              },
              (err) => {
                console.error("Geolocation error:", err);
                sendMessage("Could not get your location.", true);
              }
            );
          } else {
            sendMessage("Geolocation is not supported by your browser.", true);
          }
        } else {
          sendMessage("Please select a valid service.", true);
        }
        break;
      }

      case "selectGarage": {
        const selectedGarage = garages.find((g) => g.name === selectedInput);
        if (selectedGarage) {
          setFormData((prev) => ({
            ...prev,
            garageId: selectedGarage.garageId || selectedGarage.id,
          }));
          sendMessage("Enter appointment date in YYYY-MM-DD format:", true);
          setStep("enterDate");
          setSelectedInput("");
        } else {
          sendMessage("Please select a valid garage.", true);
        }
        break;
      }

      case "selectSlot": {
        const slot = timeSlots.find((s) => s.label === selectedInput);
        if (slot) {
          setFormData((prev) => ({ ...prev, appointmentTime: slot.value }));
          sendMessage(
            "Are you willing to wait if mechanic is unavailable? (yes/no)",
            true
          );
          setStep("canWait");
          setSelectedInput("");
        } else {
          sendMessage("Invalid time slot selected.", true);
        }
        break;
      }

      case "canWait": {
        const canWaitLower = selectedInput.toLowerCase();
        if (canWaitLower !== "yes" && canWaitLower !== "no") {
          sendMessage("Please select 'yes' or 'no'.", true);
          return;
        }
        const finalData = {
          ...formData,
          userId: user.userId,
          userName: user.name,
          userEmail: user.email,
          canWait: canWaitLower === "yes",
        };
        console.log(finalData);
        fetch("http://localhost:8080/api/appointments/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        })
          .then((res) => res.text())
          .then((data) => {
            sendMessage(data, true);
            setStep("main");
            setFormData({});
            setSelectedInput("");
          })
          .catch((err) => {
            console.error("Booking error:", err);
            sendMessage("Failed to book appointment.", true);
          });
        break;
      }

      default:
        break;
    }
  };

  const handleTextInput = (e) => {
    e.preventDefault();
    const value = e.target.elements.chatInput.value.trim();
    if (!value) return;
    sendMessage(value);
    setSelectedInput(value);

    if (step === "enterDate") {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(value)) {
        sendMessage("Please enter date in YYYY-MM-DD format.", true);
        return;
      }
      setFormData((prev) => ({ ...prev, appointmentDate: value }));
      sendMessage("Enter your car registration number:", true);
      setStep("enterRegNo");
    } else if (step === "enterRegNo") {
      setFormData((prev) => ({ ...prev, registrationNumber: value }));
      sendMessage("Select a time slot from the dropdown:", true);
      setStep("selectSlot");
    } else if (step === "canWait") {
      handleProceed();
    }

    e.target.reset();
  };

  return (
    <>
      {/* Chat Icon */}
      <Button
        variant="primary"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          borderRadius: "50%",
          width: 56,
          height: 56,
          fontSize: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 9999,
        }}
        onClick={() => setShow((prev) => !prev)}
        aria-label="Toggle Chatbot"
      >
        💬
      </Button>

      {/* Floating Chat Window */}
      {show && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 360,
            maxHeight: 500,
            backgroundColor: "#fff",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            zIndex: 10000,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-header"
        >
          {/* Header */}
          <div
            id="chatbot-header"
            style={{
              padding: "12px 16px",
              backgroundColor: "#007bff",
              color: "white",
              fontWeight: "600",
              fontSize: 18,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            Garage Chatbot
            <button
              onClick={() => setShow(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: 22,
                cursor: "pointer",
                lineHeight: 1,
              }}
              aria-label="Close chatbot"
              title="Close"
            >
              ×
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: "12px 16px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "#555" }}>
                Hello! How can I assist you today?
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.fromBot ? "flex-start" : "flex-end",
                  maxWidth: "75%",
                  wordBreak: "break-word",
                }}
              >
                <Card
                  bg={msg.fromBot ? "light" : "primary"}
                  text={msg.fromBot ? "dark" : "white"}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 16,
                    boxShadow: msg.fromBot
                      ? "0 2px 6px rgba(0,0,0,0.1)"
                      : "0 2px 6px rgba(0,0,0,0.2)",
                    fontSize: 14,
                    lineHeight: 1.3,
                    userSelect: "text",
                  }}
                >
                  {msg.text}
                </Card>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input / Controls */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #ddd",
              backgroundColor: "white",
            }}
          >
            {step === "main" && (
              <div className="d-flex flex-column gap-2">
                {[
                  "Book Appointment",
                  "Service History",
                  "Search About a Car",
                  "Know About Orders",
                ].map((opt, i) => (
                  <Button
                    key={i}
                    variant="outline-primary"
                    onClick={() => handleOptionClick(opt)}
                    size="sm"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            )}

            {[
              "selectService",
              "selectGarage",
              "selectSlot",
              "canWait",
            ].includes(step) && (
              <>
                {step === "selectService" && (
                  <Form.Select
                    value={selectedInput}
                    onChange={(e) => setSelectedInput(e.target.value)}
                    aria-label="Select Service"
                    size="sm"
                  >
                    <option value="">-- Select Service --</option>
                    {services.map((s) => (
                      <option key={s.serviceId} value={s.serviceName}>
                        {s.serviceName}
                      </option>
                    ))}
                  </Form.Select>
                )}

                {step === "selectGarage" && (
                  <Form.Select
                    value={selectedInput}
                    onChange={(e) => setSelectedInput(e.target.value)}
                    aria-label="Select Garage"
                    size="sm"
                  >
                    <option value="">-- Select Garage --</option>
                    {garages.map((g) => (
                      <option key={g.garageId || g.id} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </Form.Select>
                )}

                {step === "selectSlot" && (
                  <Form.Select
                    value={selectedInput}
                    onChange={(e) => setSelectedInput(e.target.value)}
                    aria-label="Select Time Slot"
                    size="sm"
                  >
                    <option value="">-- Select Time Slot --</option>
                    {timeSlots.map((slot, idx) => (
                      <option key={idx} value={slot.label}>
                        {slot.label}
                      </option>
                    ))}
                  </Form.Select>
                )}

                {step === "canWait" && (
                  <Form.Select
                    value={selectedInput}
                    onChange={(e) => setSelectedInput(e.target.value)}
                    aria-label="Willing to Wait"
                    size="sm"
                  >
                    <option value="">-- Willing to wait? --</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Form.Select>
                )}

                <Button
                  variant="success"
                  onClick={handleProceed}
                  size="sm"
                  disabled={!selectedInput}
                  className="mt-2 w-100"
                  aria-disabled={!selectedInput}
                >
                  Proceed
                </Button>
              </>
            )}

            {["enterDate", "enterRegNo"].includes(step) && (
              <Form onSubmit={handleTextInput} className="d-flex" role="form">
                <Form.Control
                  name="chatInput"
                  placeholder="Type your response..."
                  autoFocus
                  aria-label="Chat input"
                  size="sm"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="ms-2"
                >
                  Send
                </Button>
              </Form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotModal;
