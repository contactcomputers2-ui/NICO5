import React from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode; // For buttons, links, etc.
}

const Card: React.FC<CardProps> = ({ title, children, className, headerActions }) => {
  return (
    <div className={clsx("bg-white rounded-xl shadow-md border border-gray-200", className)}>
      {(title || headerActions) && (
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
          {headerActions && <div className="flex items-center space-x-2">{headerActions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
