import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideNavBar from "./SideNavBar";
import coverPhoto from "../../Media/cover-car.jpg";
import profilePhoto from "../../Media/profile-car.jpg";
import { CiStar } from "react-icons/ci";
import { FaLocationArrow } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import TestimonialCard from "./TestimonialCard";
import ServiceCarousel from "./ServicesCarousel";

function GarageDetails() {
  const isInitiallyFavourite = false;
  const navigate = useNavigate();
  const { garage_id } = useParams();
  const [garage, setGarage] = useState(null);
  const [topReviews, setTopReviews] = useState([]);
  const user = JSON.parse(localStorage.getItem("userData"));
  const [isFavourite, setIsFavourite] = useState(isInitiallyFavourite);

  const handleReviewClick = (garage_id) => {
    navigate(`/user/garage/${garage_id}/review`);
  };

  const addFavourites = async  () => {
    try {
      const payload = {
        userId: user.userId,
        garageId: garage_id,
      };
      const response = await fetch("http://localhost:8080/api/users/favourite-add", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log(payload);

      if (response.ok) {
        alert(isFavourite ? "Garage added to favourites" : "garage removed successfully");
      } else {
        alert("Failed to add garage");
      }

      setIsFavourite((prev) => !prev);
    } catch (error) {
      console.log(error);
      alert("Something went Wrong");
    }
  };
  useEffect(() => {
    // this part fetches the details related tio garage
    fetch(`http://localhost:8080/api/user/garages/${garage_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Garage not found");
        }
        return response.json();
      })
      .then((data) => {
        setGarage(data);
      })
      .catch((error) => {
        console.error("Error fetching garage:", error);
      });

    // this part fetches the reviews as the page loads
    fetch(`http://localhost:8080/api/user/reviews/top/${garage_id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Reviews not found");
        return response.json();
      })
      .then((data) => {
        setTopReviews(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [garage_id]);

  if (!garage) {
    return <div>Loading garage details...</div>;
  }

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div className="content-area mt-2">
        <div className="d-flex flex-row jutify-content-between p-2">
          {/* contains profile and details section  */}
          <div
            className="w-50 rounded shadow-sm overflow-hidden border"
            style={{
              background: "linear-gradient(225deg, #dbe9f4 0%, #c2d9ef 100%)",
              border: "1px solid #a6c1dd",
            }}
          >
            {/* Cover + Profile */}
            <div className="position-relative">
              <img
                src={coverPhoto}
                alt="cover photo"
                className="w-100"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <img
                src={profilePhoto}
                alt="Profile"
                className="rounded-circle border border-white position-absolute shadow"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  bottom: "-60px",
                  left: "30px",
                  borderWidth: "4px",
                }}
              />
            </div>

            {/* Garage Info */}
            <div className="px-4 pt-5 pb-2">
              <h2 className="fw-bold mb-1 mt-2">{garage.name}</h2>
              <p className="text-muted mb-3" style={{ fontSize: "0.95rem" }}>
                Building provisions for future cars
              </p>

              {/* Buttons */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <button className="btn btn-outline-primary btn-sm"
                onClick={() => navigate('/user/book-appointments')}>Book</button>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => handleReviewClick(garage.garageId)}
                >
                  Review
                </button>
                <button className="btn btn-outline-dark btn-sm">Message</button>
                <button
                  className="btn btn-warning btn-sm text-white d-flex align-items-center gap-1"
                  onClick={addFavourites}
                >
                  Favourites {isFavourite ? "★" : "☆"}
                </button>
              </div>

              <hr className="my-2" />

              {/* Location & Contact */}
              <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
                <div className="d-flex align-items-center mb-2">
                  <IoLocationSharp className="me-2" />
                  <span>{garage.locationAddress}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FaLocationArrow className="me-2" />
                  <span>10 KM away</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaPhoneAlt className="me-2" />
                  <span>{garage.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mx-2 w-50 p-3 rounded shadow-sm bg-white"
            style={{
              backgroundImage:
                "linear-gradient(225deg, #e6f0fa 0%, #d0e3f4 100%)",
            }}
          >
            {/* Ratings */}
            <div className="d-flex align-items-center justify-content-end p-2 mb-3 border-bottom">
              {[...Array(5)].map((_, i) => (
                <CiStar key={i} size={30} className="text-warning me-1" />
              ))}
              <h4 className="mb-0 fw-bold ms-2 text-dark">{garage.ratings}</h4>
            </div>

            {/* Testimonials */}
            <div className="px-2">
              <h5 className="text-secondary mb-4 fw-semibold text-center">
                What Our Clients Say
              </h5>

              <div className="d-flex flex-wrap justify-content-between gap-3">
                {topReviews.map((review, index) => (
                  <div
                    className="flex-fill"
                    style={{ minWidth: "250px" }}
                    key={index}
                  >
                    <TestimonialCard
                      name={review.customerName}
                      role="Customer"
                      quote={review.comments}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ServiceCarousel />
      </div>
    </div>
  );
}

export default GarageDetails;
