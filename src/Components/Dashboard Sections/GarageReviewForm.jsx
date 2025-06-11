import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SideNavBar from "./SideNavBar";

function GarageReviewForm() {
  const [formData, setFormData] = useState({
    name: "",
    rating: "",
    comments: "",
    image: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.userId;
  const { garage_id } = useParams();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, rating, comments, image } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("garageId", garage_id);
    formDataToSend.append("customerId", userId);
    formDataToSend.append("customerName", name);
    formDataToSend.append("rating", rating);
    formDataToSend.append("comments", comments);

    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/user/reviews/submit",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        setModalMessage("Review submitted successfully!");
      } else {
        setModalMessage("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setModalMessage("Error while submitting review. Please try again.");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="d-flex">
      <SideNavBar />
      <div className="container mt-5">
        <div
          className="shadow rounded-4 p-4"
          style={{
            background: "linear-gradient(135deg, #044A7C 0%, #B7F4F4 100%)",
            border: "none",
          }}
        >
          <h2 className="mb-4 text-center text-dark fw-bold border-bottom border-white pb-2">
            Post a Garage Review
          </h2>
          <form onSubmit={handleSubmit}>
            {/* form fields (name, rating, comments, image) */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-white">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="rating" className="form-label text-white">
                Rating (1 to 5)
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                className="form-control"
                min="1"
                max="5"
                placeholder="Enter rating"
                value={formData.rating}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="comments" className="form-label text-white">
                Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                className="form-control"
                rows="4"
                placeholder="Write your review..."
                value={formData.comments}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="form-label text-white">
                Upload an Image (optional)
              </label>
              <input
                id="image"
                name="image"
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit Review
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3">Notification</h5>
            <p>{modalMessage}</p>
            <button className="btn btn-primary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GarageReviewForm;
