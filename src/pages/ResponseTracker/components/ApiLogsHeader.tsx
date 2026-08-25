import React from 'react';
import { Activity } from 'lucide-react';

export const ApiLogsHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">Response Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor external API requests, webhooks, and third-party integrations.
        </p>
      </div>
    </div>
  );
};
