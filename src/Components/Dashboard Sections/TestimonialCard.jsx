import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialCard = ({ name, role, quote }) => {
  return (
    <div className="card shadow-sm border-0 p-3 d-flex flex-row align-items-center" style={{ borderRadius: '20px' }}>

      <div>
        <FaQuoteLeft size={20} color="#0d6efd" />
        <p className="text-muted fst-italic mb-2">"{quote}"</p>
        <h6 className="mb-0 fw-bold">{name}</h6>
        <small className="text-muted">{role}</small>
      </div>
    </div>
  );
};

export default TestimonialCard;
