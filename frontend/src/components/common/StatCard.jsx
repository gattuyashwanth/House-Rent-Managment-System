import React from 'react';

const StatCard = ({ icon, label, value, color = 'primary', delay = 0 }) => (
  <div className="stat-card animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
    <div className="d-flex align-items-center gap-3">
      <div className={`stat-icon bg-${color} bg-opacity-10 text-${color}`}>
        {icon}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  </div>
);

export default StatCard;
