import React from 'react';
import clsx from 'clsx'; // Import clsx

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  // FIX: Add 'pink' to the list of allowed accent colors
  accentColor: 'blue' | 'green' | 'amber' | 'purple' | 'teal' | 'pink';
  className?: string; // Add className prop
}

const colorVariants = {
  blue: {
    border: 'border-blue-600',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  green: {
    border: 'border-green-600',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
  },
  amber: {
    border: 'border-amber-500',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
  },
  purple: {
    border: 'border-purple-600',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
  },
  teal: {
    border: 'border-teal-500',
    iconBg: 'bg-teal-100',
    iconText: 'text-teal-600',
  },
  // FIX: Add pink color variant
  pink: {
    border: 'border-pink-500',
    iconBg: 'bg-pink-100',
    iconText: 'text-pink-600',
  },
};


const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  accentColor,
  className // Destructure className
}) => {
  const styles = colorVariants[accentColor] || colorVariants.blue;

  return (
    <div className={clsx(`bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 border-t-4 ${styles.border}`, className)}>
      <div className={`p-3 rounded-full ${styles.iconBg}`}>
        <Icon className={`w-6 h-6 ${styles.iconText}`} />
      </div>
      <div>
        <p className="text-md font-semibold text-gray-700">{title}</p>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        <p className="text-sm font-semibold text-gray-500">{change}</p>
      </div>
    </div>
  );
};

export default StatCard;