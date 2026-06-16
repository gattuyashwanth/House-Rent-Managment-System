import React from 'react';
import { FaStar } from 'react-icons/fa';

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card animate-fade-in">
    <div className="stars d-flex gap-1">
      {[...Array(testimonial.rating)].map((_, i) => <FaStar key={i} />)}
    </div>
    <p className="mb-4 fst-italic">"{testimonial.text}"</p>
    <div className="d-flex align-items-center gap-3">
      <img src={testimonial.avatar} alt={testimonial.name} className="rounded-circle" width="48" height="48" />
      <div>
        <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
        <small className="text-muted">{testimonial.role}</small>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
