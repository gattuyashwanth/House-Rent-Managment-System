import React from 'react';

const StatusBadge = ({ status }) => {
  const map = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    rented: 'secondary',
  };
  return (
    <span className={`badge bg-${map[status] || 'secondary'} text-capitalize`}>
      {status}
    </span>
  );
};

export default StatusBadge;
