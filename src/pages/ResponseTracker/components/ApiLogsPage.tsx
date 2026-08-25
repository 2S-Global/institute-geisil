import React, { useState } from 'react';
import { useResponseTracker, ExternalApiLog, UserInfo } from '../hook/ResponseTracker';
import { ApiLogsHeader } from './ApiLogsHeader';
import { ApiLogsToolbar } from './ApiLogsToolbar';
import { ApiLogsTable } from './ApiLogsTable';
import { ApiLogsPagination } from './ApiLogsPagination';
import { ApiLogsDetailsModal } from './ApiLogsDetailsModal';

export default function ApiLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<ExternalApiLog | null>(null);

  const {
    logs,
    loading,
    page,
    setPage,
    limit,
    refresh,
    totalPages,
    totalLogs,
    statusFilter,
    setStatusFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter
  } = useResponseTracker();

  // Client-side filtering of logs
  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    if (log.endpoint.toLowerCase().includes(term)) return true;
    if (log.provider.toLowerCase().includes(term)) return true;
    if (log.service.toLowerCase().includes(term)) return true;
    if (log.status.toLowerCase().includes(term)) return true;
    if (log.httpStatus?.toString().includes(term)) return true;

    if (log.userId) {
      if (typeof log.userId === 'object') {
        const userObj = log.userId as UserInfo;
        if (userObj.name?.toLowerCase().includes(term)) return true;
        if (userObj.email?.toLowerCase().includes(term)) return true;
        if (userObj._id?.toLowerCase().includes(term)) return true;
      } else {
        if (log.userId.toLowerCase().includes(term)) return true;
      }
    }

    return false;
  });

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 text-foreground">
      <ApiLogsHeader />

      <ApiLogsToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
        refresh={refresh}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDateFilter={startDateFilter}
        setStartDateFilter={setStartDateFilter}
        endDateFilter={endDateFilter}
        setEndDateFilter={setEndDateFilter}
      />

      <ApiLogsTable
        logs={filteredLogs}
        loading={loading}
        onViewDetails={setSelectedLog}
      />

      <ApiLogsPagination
        page={page}
        setPage={setPage}
        loading={loading}
        totalPages={totalPages}
        totalLogs={totalLogs}
      />

      <ApiLogsDetailsModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}