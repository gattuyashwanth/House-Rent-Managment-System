import React from 'react';
import { FaInbox } from 'react-icons/fa';

const EmptyState = ({ icon: Icon = FaInbox, title = 'No data found', message, action }) => (
  <div className="empty-state premium-card">
    <Icon />
    <h5>{title}</h5>
    {message && <p className="mb-3">{message}</p>}
    {action}
  </div>
);

export default EmptyState;
