import React, { useState } from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { ExternalApiLog, UserInfo } from '../hook/ResponseTracker';
import { StatusBadge } from './StatusBadge';
import { toTitleCase } from '@/lib/utils';
import { toast } from 'sonner';

interface ApiLogsDetailsModalProps {
  log: ExternalApiLog | null;
  onClose: () => void;
}

export const ApiLogsDetailsModal: React.FC<ApiLogsDetailsModalProps> = ({
  log,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!log) return null;

  const handleCopy = () => {
    if (log.endpoint) {
      navigator.clipboard.writeText(log.endpoint);
      setCopied(true);
      toast.success('Endpoint URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-[10px] border border-border shadow-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/50">
          <h2 className="text-lg font-bold font-display">Request Details</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Provider</p>
              <p className="font-medium uppercase">{log.provider}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Service</p>
              <p className="font-medium">{toTitleCase(log.service)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground mb-1">Endpoint</p>
              <div className="flex items-center justify-between gap-2 bg-muted p-2 rounded-md border border-border">
                <span className="font-medium break-all font-mono text-xs text-foreground">
                  {log.endpoint}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background/80 rounded transition-colors shrink-0"
                  title="Copy URL"
                  type="button"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Status Code</p>
              <StatusBadge statusStr={log.status} httpStatus={log.httpStatus} />
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Duration / Latency</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" /> {log.durationMs}ms
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground mb-1">User / Initiator</p>
              {log.userId && typeof log.userId === 'object' ? (
                <div className="bg-background border border-border rounded-md p-3 space-y-1">
                  <p className="font-medium">{(log.userId as UserInfo).name}</p>
                  <p className="text-xs text-muted-foreground">Email: {(log.userId as UserInfo).email}</p>
                  <p className="text-xs text-muted-foreground">ID: {(log.userId as UserInfo)._id}</p>
                </div>
              ) : (
                <p className="font-medium">{log.userId || 'System'}</p>
              )}
            </div>
          </div>

          {log.errorMessage && (
            <div>
              <p className="text-muted-foreground text-sm mb-2">Error Details</p>
              <pre className="bg-red-50 dark:bg-destructive/10 border border-destructive/20 rounded-md p-4 text-xs font-mono text-destructive dark:text-red-400 overflow-x-auto whitespace-pre-wrap break-all">
                {log.errorMessage}
              </pre>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-md hover:bg-muted transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
