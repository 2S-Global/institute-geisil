import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle,
  XCircle,
  MinusCircle,
  Clock3,
  Eye,
  Download,
  Search,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import axios from "axios";

interface Candidate {
  _id: string;
  order_id: string;
  candidate_name: string;
  status: string;
  all_verified: number;
  updatedAt: string;

  pan_name?: string;
  pan_number?: string;
  pan_response?: any;

  passport_name?: string;
  passport_file_number?: string;
  passport_response?: any;

  aadhar_name?: string;
  aadhar_number?: string;
  aadhaar_response?: any;

  dl_name?: string;
  dl_number?: string;
  dl_response?: any;

  epic_name?: string;
  epic_number?: string;
  epic_response?: any;

  uan_name?: string;
  uan_number?: string;
  uan_response?: any;
}

const PAGE_SIZE = 10;

const DownloadCenterTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      const response = await api.post(
        "/api/usercart/getPaidUserVerificationCartByEmployer",
        {},
      );

      setCandidates(response?.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();

    const interval = setInterval(() => {
      fetchCandidates();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const truncateText = (text?: string, maxLength = 20) => {
    if (!text) return "-";

    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const formatCandidateName = (name?: string) => {
    if (!name) return "-";

    return name
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isDocumentVerified = (response: any) => {
    return (
      response &&
      (response?.response_code === "100" ||
        response?.response_code === 100 ||
        response?.status_code === 200)
    );
  };

  const renderDocStatus = (
    docNumber?: string,
    docName?: string,
    response?: any,
  ) => {
    if (!docNumber && !docName) {
      return (
        <div title="Not Applied">
          <MinusCircle size={18} className="text-muted-foreground" />
        </div>
      );
    }

    if (!response) {
      return (
        <div title="Processing">
          <Clock3 size={18} className="text-blue-600" />
        </div>
      );
    }

    if (isDocumentVerified(response)) {
      return (
        <div title="Verified">
          <CheckCircle size={18} className="text-green-600" />
        </div>
      );
    }

    return (
      <div title="Failed">
        <XCircle size={18} className="text-red-600" />
      </div>
    );
  };

  const renderOverallStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Completed
          </Badge>
        );

      case "processing":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-600"
          >
            Processing
          </Badge>
        );

      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((item) => {
      const searchTerm = search.toLowerCase();

      return (
        item.candidate_name?.toLowerCase().includes(searchTerm) ||
        item.order_id?.toLowerCase().includes(searchTerm)
      );
    });
  }, [candidates, search]);

  const totalPages = Math.ceil(filteredCandidates.length / PAGE_SIZE);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (loading) {
    return (
      <Card className="shadow-sm border">
        <CardContent>
          <div className="flex justify-center items-center min-h-[400px]">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAadhaarVerified = (aadhaarResponse: any) => {
    return (
      aadhaarResponse &&
      (aadhaarResponse?.response_code === "100" ||
        aadhaarResponse?.response_code === 100 ||
        aadhaarResponse?.status_code === 200)
    );
  };

  const handleDownload = async (candidateId: string) => {
    try {
      setPdfLoadingId(candidateId);

      const detailsResponse = await api.post("/api/verify/verifiedDetails", {
        id: candidateId,
      });

      const user = detailsResponse.data.user;

      const response = isAadhaarVerified(user?.aadhaar_response)
        ? await api.post(
            "/api/pdf/otp-generate-pdf",
            {
              order_id: user._id,
            },
            {
              responseType: "blob",
            },
          )
        : await axios.post(
            `${import.meta.env.VITE_API_URL}/api/pdf/generate-pdf-employer`,
            {
              order_id: user._id,
            },
            {
              responseType: "blob",
            },
          );

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        }),
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `${user.candidate_name || "verification"}.pdf`,
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("PDF Error:", error);

      if (error?.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        console.log("Backend Error:", text);
      } else {
        console.log("Backend Error:", error?.response?.data);
      }

      console.log("Status:", error?.response?.status);
    } finally {
      setPdfLoadingId(null);
    }
  };

  const canDownloadPdf = (row: Candidate) => {
    return (
      isDocumentVerified(row.pan_response) ||
      isDocumentVerified(row.passport_response) ||
      isDocumentVerified(row.aadhaar_response) ||
      isDocumentVerified(row.dl_response) ||
      isDocumentVerified(row.epic_response)
    );
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl">
              Employee Verification Records
            </CardTitle>

            <p className="text-sm text-muted-foreground mt-1">
              {filteredCandidates.length} verification request(s)
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search candidate or order id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-auto max-h-[700px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Candidate Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">PAN</TableHead>
                <TableHead className="text-center">Passport</TableHead>
                <TableHead className="text-center">Aadhaar</TableHead>
                <TableHead className="text-center">DL</TableHead>
                <TableHead className="text-center">EPIC</TableHead>
                <TableHead className="text-center">UAN</TableHead>
                <TableHead>Verified At</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCandidates.map((row) => (
                  <TableRow key={row._id} className="hover:bg-muted/40">
                    <TableCell
                      title={row.order_id}
                      className="font-medium max-w-[150px]"
                    >
                      {truncateText(row.order_id, 18)}
                    </TableCell>

                    <TableCell
                      title={formatCandidateName(row.candidate_name)}
                      className="max-w-[180px]"
                    >
                      {truncateText(
                        formatCandidateName(row.candidate_name),
                        25,
                      )}
                    </TableCell>

                    <TableCell>{renderOverallStatus(row.status)}</TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {renderDocStatus(
                          row.pan_number,
                          row.pan_name,
                          row.pan_response,
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {renderDocStatus(
                          row.passport_file_number,
                          row.passport_name,
                          row.passport_response,
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {renderDocStatus(
                          row.aadhar_number,
                          row.aadhar_name,
                          row.aadhaar_response,
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {renderDocStatus(
                          row.dl_number,
                          row.dl_name,
                          row.dl_response,
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {renderDocStatus(
                          row.epic_number,
                          row.epic_name,
                          row.epic_response,
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {renderDocStatus(
                          row.uan_number,
                          row.uan_name,
                          row.uan_response,
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {row.all_verified === 1
                        ? new Date(row.updatedAt).toLocaleDateString("en-GB")
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (isAadhaarVerified(row.aadhaar_response)) {
                              navigate(
                                `/employer/verified-aadhar?id=${row._id}`,
                              );
                            } else {
                              navigate(
                                `/employer/verification-details?id=${row._id}`,
                              );
                            }
                          }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(row._id)}
                          disabled={
                            pdfLoadingId === row._id || !canDownloadPdf(row)
                          }
                          title={
                            !canDownloadPdf(row)
                              ? "No verified document available"
                              : "Download Verification Report"
                          }
                          className="
                            transition-all
                            duration-200
                            hover:bg-blue-50
                            hover:shadow-md
                            hover:scale-105
                            rounded-full
                          "
                        >
                          {pdfLoadingId === row._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          ) : (
                            <Download
                              className={`h-4 w-4 ${
                                canDownloadPdf(row)
                                  ? "text-blue-600 hover:text-blue-700"
                                  : "text-gray-400"
                              }`}
                            />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredCandidates.length > 0 && (
          <div className="border-t px-6 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </span>
                {" - "}
                <span className="font-medium text-foreground">
                  {Math.min(currentPage * PAGE_SIZE, filteredCandidates.length)}
                </span>
                {" of "}
                <span className="font-medium text-foreground">
                  {filteredCandidates.length}
                </span>
                {" records"}
              </p>

              <div className="flex items-center gap-1 flex-wrap">
                {/* Previous */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={index}
                      size="sm"
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(Number(page))}
                      className="min-w-9"
                    >
                      {page}
                    </Button>
                  ),
                )}

                {/* Next */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadCenterTable;
