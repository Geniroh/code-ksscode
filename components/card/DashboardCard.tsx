import React from "react";

interface DashboardCardProps {
  iconSrc?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  iconSrc,
  title,
  children,
}) => {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {iconSrc && (
        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
          {iconSrc}
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {children && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
