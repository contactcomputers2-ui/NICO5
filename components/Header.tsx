
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gray-800 text-gray-100 p-4 flex items-center h-16 z-10 border-b border-gray-700">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
};

export default Header;