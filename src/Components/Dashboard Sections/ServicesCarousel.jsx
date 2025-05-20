import React, { useState, useRef, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

function ServicesCarousel() {
  const [services, setServices] = useState([]);
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const cardWidth = 240;

  const { garage_id } = useParams();

  useEffect(() => {
    const updateVisibleCount = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setVisibleCount(Math.floor(width / cardWidth));
      }
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    if (garage_id) {
      fetch(`http://localhost:8080/api/user/garages/${garage_id}/services`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setServices(data);
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
        });
    }
  }, [garage_id]);

  const handleNext = () => {
    if (startIndex + visibleCount < services.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const visibleServices = services.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="px-4 py-3">
      <h4 className="mb-3">Services Offered</h4>
      <div className="d-flex align-items-center">
        <Button
          variant="outline-primary"
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="me-2"
        >
          ◀
        </Button>
        <div
          className="d-flex overflow-hidden"
          ref={containerRef}
          style={{ width: "100%" }}
        >
          {visibleServices.map((service, idx) => (
            <Card
              key={idx}
              className="me-3 flex-shrink-0"
              style={{
                minWidth: `${cardWidth}px`,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Card.Body>
                <Card.Title>{service.serviceName}</Card.Title>
                <Card.Text>{service.serviceDesc}</Card.Text>
              </Card.Body>
            </Card>
          ))}

        </div>
        <Button
          variant="outline-primary"
          onClick={handleNext}
          disabled={startIndex + visibleCount >= services.length}
          className="ms-2"
        >
          ▶
        </Button>
      </div>
    </div>
  );
}

export default ServicesCarousel;
