import React from 'react';
import { Search, Filter, RefreshCw, ChevronDown, X } from 'lucide-react';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface ApiLogsToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading: boolean;
  refresh: () => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  startDateFilter: string;
  setStartDateFilter: (date: string) => void;
  endDateFilter: string;
  setEndDateFilter: (date: string) => void;
}

export const ApiLogsToolbar: React.FC<ApiLogsToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  loading,
  refresh,
  statusFilter,
  setStatusFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
}) => {
  // Helper to format Date to YYYY-MM-DD safely
  const formatDateToString = (date: Date | null): string => {
    if (!date || Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between bg-card p-4 rounded-[10px] border border-border shadow-sm items-center">
      {/* Search Input */}
      <div className="relative w-full lg:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input 
          type="text" 
          placeholder="Search by User, Endpoint, or Provider..." 
          className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center flex-wrap gap-3 w-full lg:w-auto">
        {/* MUI Date Range Picker Configuration */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="flex items-center gap-2">
            <DatePicker
              label="From Date"
              value={startDateFilter ? new Date(startDateFilter) : null}
              onChange={(newValue: Date | null) => {
                setStartDateFilter(newValue ? formatDateToString(newValue) : "");
              }}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    width: 145,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "hsl(var(--background))",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "hsl(var(--input))",
                      },
                      "&:hover fieldset": {
                        borderColor: "hsl(var(--ring) / 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "hsl(var(--ring))",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "hsl(var(--muted-foreground))",
                    }
                  }
                }
              }}
            />
            <DatePicker
              label="To Date"
              value={endDateFilter ? new Date(endDateFilter) : null}
              onChange={(newValue: Date | null) => {
                setEndDateFilter(newValue ? formatDateToString(newValue) : "");
              }}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    width: 145,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "hsl(var(--background))",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "hsl(var(--input))",
                      },
                      "&:hover fieldset": {
                        borderColor: "hsl(var(--ring) / 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "hsl(var(--ring))",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "hsl(var(--muted-foreground))",
                    }
                  }
                }
              }}
            />
            {(startDateFilter || endDateFilter) && (
              <button
                onClick={() => {
                  setStartDateFilter('');
                  setEndDateFilter('');
                }}
                className="p-2 hover:bg-secondary rounded-full transition-colors border border-border shadow-sm bg-background flex items-center justify-center"
                title="Clear Dates"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </LocalizationProvider>
        
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none flex items-center pl-9 pr-9 py-2 bg-background border border-input rounded-md text-sm hover:bg-secondary text-secondary-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer min-w-[140px] shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="TIMEOUT">Timeout</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Refresh Button */}
        <button 
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-[8px] text-sm hover:bg-primary-hover shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};