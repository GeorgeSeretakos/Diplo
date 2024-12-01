import React from 'react';

const FilterSection = ({ title, children }) => {
  return (
    <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
      <h3 style={{ marginBottom: '10px' }}>{title}</h3>
      {children}
    </div>
  );
};

export default FilterSection;
