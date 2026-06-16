import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaBuilding, FaHotel } from 'react-icons/fa';

const icons = { house: FaHome, apartment: FaBuilding, villa: FaHotel };

const CategoryCard = ({ type, label, count }) => {
  const navigate = useNavigate();
  const Icon = icons[type] || FaHome;

  return (
    <div className="category-card" onClick={() => navigate(`/properties?type=${type}`)} role="button">
      <div className="icon-wrap"><Icon /></div>
      <h5 className="fw-bold mb-1">{label}</h5>
      <p className="text-muted small mb-0">{count}+ Properties</p>
    </div>
  );
};

export default CategoryCard;
