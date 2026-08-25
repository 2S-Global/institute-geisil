import React from "react";
import { Clock3, Eye, UserRound } from "lucide-react";

import { ExternalApiLog, UserInfo } from "../hook/ResponseTracker";
import { ProviderBadge } from "./ProviderBadge";
import { StatusBadge } from "./StatusBadge";

interface ApiLogsTableProps {
  logs: ExternalApiLog[];
  loading: boolean;
  onViewDetails: (log: ExternalApiLog) => void;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const toTitleCase = (str: string) => {
  if (!str) return "";
  return str
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const UserCell = ({ user }: { user?: UserInfo | string }) => {
  if (!user) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <UserRound className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm">System</span>
      </div>
    );
  }

  if (typeof user === "string") {
    return (
      <span className="text-sm text-muted-foreground">
        {user}
      </span>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {user.profilePicture ? (
        <img
          src={user.profilePicture}
          alt={user.name}
          className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-border"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
      )}

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {user.name}
        </p>

        {user.email && (
          <p className="truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
};

const LoadingRow = () => (
  <tr>
    <td colSpan={6} className="h-48">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
          Loading API logs...
        </div>
      </div>
    </td>
  </tr>
);

export const ApiLogsTable: React.FC<ApiLogsTableProps> = ({
  logs,
  loading,
  onViewDetails,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                Provider
              </th>



              <th className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                Initiated by
              </th>

              <th className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                Time
              </th>

              <th className="w-16 px-5 py-3.5" />
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <LoadingRow />
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-48 text-center">
                  <div className="text-sm text-muted-foreground">
                    No API logs found
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log._id}
                  className="
                    group
                    border-b
                    border-border/60
                    transition-colors
                    last:border-0
                    hover:bg-muted/25
                  "
                >
                  {/* Provider */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">


                      <div className="min-w-0 w-48">
                        <p className="truncate text-sm font-medium text-foreground" title={toTitleCase(log.service)}>
                          {toTitleCase(log.service)}
                        </p>


                      </div>
                    </div>
                  </td>

                  {/* Endpoint */}
                  {/* <td className="px-5 py-4">
                    <div
                      title={log.endpoint}
                      className="
                        max-w-[320px]
                        truncate
                        rounded-md
                        bg-muted/50
                        px-2.5
                        py-1.5
                        font-mono
                        text-xs
                        text-muted-foreground
                      "
                    >
                      {log.endpoint}
                    </div>
                  </td> */}

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge
                      statusStr={log.status}
                      httpStatus={log.httpStatus}
                    />
                  </td>

                  {/* User */}
                  <td className="max-w-[220px] px-5 py-4">
                    <UserCell user={log.userId} />
                  </td>

                  {/* Timestamp */}
                  <td className="px-5 py-4">
                    <div className="whitespace-nowrap">
                      <p className="text-sm text-foreground">
                        {formatDate(log.createdAt)}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 className="h-3 w-3" />
                        <span>{log.durationMs} ms</span>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewDetails(log)}
                      title="View API log details"
                      aria-label="View API log details"
                      className="
                        inline-flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-md
                        text-muted-foreground
                        opacity-60
                        transition-all
                        hover:bg-muted
                        hover:text-foreground
                        group-hover:opacity-100
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring
                      "
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};