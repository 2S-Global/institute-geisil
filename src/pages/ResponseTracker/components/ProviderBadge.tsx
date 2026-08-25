import React from 'react';

interface ProviderBadgeProps {
  provider: string;
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({ provider }) => (
  <span className="inline-flex items-center justify-center w-24 shrink-0 bg-primary-soft text-primary border border-primary/20 text-xs py-1 px-2 rounded-md font-semibold uppercase">
    {provider}
  </span>
);
