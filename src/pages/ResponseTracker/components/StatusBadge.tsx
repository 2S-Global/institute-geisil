import React from 'react';

interface StatusBadgeProps {
  statusStr: string;
  httpStatus?: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ statusStr, httpStatus }) => {
  const displayStatus = httpStatus ? `${statusStr} ` : statusStr;
  if (statusStr === 'SUCCESS') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-success dark:bg-success/20">
        {displayStatus}
      </span>
    );
  }
  if (statusStr === 'TIMEOUT') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-warning dark:bg-warning/20">
        {displayStatus}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-destructive dark:bg-destructive/20">
      {displayStatus}
    </span>
  );
};
