import React from 'react'
import { FaCar } from "react-icons/fa";
function Card({ title, image, content }) {

  const cardStyle = {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    maxWidth: "100%",
    height: "350px",
    borderRadius: "10px",
    color: "white",
    textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
    margin: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.3s ease-in-out"
  };

  const titleStyle = {
    position: "relative",
    zIndex: "2",
    fontSize: "1.8rem",
    fontWeight: "bold",
    transition: "opacity 0.3s ease-in-out",
  };

  const overlayStyle = {
    position: "absolute",
    top: "5%",
    left: "5%",
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "10px",
    zIndex: "1",
    opacity: 0,
    borderRadius: "10px"
  };

  const contentStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    zIndex: "2",
    padding: "10%",
    opacity: "0", // Initially hidden
    transition: "opacity 0.3s ease-in-out",
    width: '80%'
  };

  return (
    <div className="feature col" style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.querySelector(".card-content").style.opacity = "1";
        e.currentTarget.querySelector(".card-title").style.opacity = "0";
        e.currentTarget.querySelector(".overlay-div").style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.querySelector(".card-content").style.opacity = "0";
        e.currentTarget.querySelector(".card-title").style.opacity = "1";
        e.currentTarget.querySelector(".overlay-div").style.opacity = "0";

      }}
    >
      <div style={overlayStyle} className='overlay-div'></div>

      {/* Title (Always Visible) */}
      <h3 className="card-title" style={titleStyle}>
        {title}
      </h3>

      {/* Full Content (Visible on Hover) */}
      <div className="card-content" style={contentStyle}>
        <div
          className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3"
          style={{ borderRadius: "20%" }}
        >
          <FaCar style={{ padding: "2px" }} />
        </div>
        <h3 className="fs-2 fw-bold text-white">{title}</h3>
        <p>
          {content}
        </p>
      </div>

    </div>
  )
}

export default Card
