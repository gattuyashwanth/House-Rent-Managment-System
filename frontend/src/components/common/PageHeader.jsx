import React from 'react';

const PageHeader = ({ title, subtitle, action }) => (
  <div className="page-header d-flex flex-wrap justify-content-between align-items-center gap-3">
    <div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
