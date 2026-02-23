import React from 'react';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="card text-center p-16">
      <div className="loader mx-auto mb-4"></div>
      {text}
    </div>
  );
};

export default Loader;