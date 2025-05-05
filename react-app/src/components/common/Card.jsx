import React from 'react';

function Card({ children, className = '', ...props }) {
  const cardClasses = `
    bg-white 
    shadow 
    overflow-hidden 
    rounded-lg 
    p-6 
    ${className}
  `.trim();

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

export default Card;