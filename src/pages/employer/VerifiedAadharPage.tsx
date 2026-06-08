import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";

import api from "@/lib/axios";

import { EmployerLayout } from "@/components/EmployerLayout";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AadharDetails from "@/components/employer/verification/AadhaarDetails";

const VerifiedAadharPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      setLoading(true);

      try {
        const response = await api.post("/api/verify/verifiedDetails", { id });

        setUser(response?.data?.user);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleClick = (documentType: string) => {
    const element = document.getElementById(documentType);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleDownload = async () => {
    try {
      setPdfLoading(true);

      const response = await api.post(
        "/api/pdf/otp-generate-pdf",
        {
          order_id: user?._id,
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
      link.download = `${user?.candidate_name || "Verification"}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Error:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  const getStatusIcon = (response: any, targetId = "aadhaar_response") => {
    if (!response) {
      //   return <AlertCircle size={20} className="text-muted-foreground" />;
      return <AlertCircle size={20} className="text-red-600" />;
    }

    const verified =
      response?.response_code === 100 ||
      response?.response_code === "100" ||
      response?.status_code === 200;

    return verified ? (
      <CheckCircle
        size={20}
        className="text-green-600 cursor-pointer"
        onClick={() => handleClick(targetId)}
      />
    ) : (
      <XCircle
        size={20}
        className="text-red-600 cursor-pointer"
        onClick={() => handleClick(targetId)}
      />
    );
  };

  const userData = user
    ? [
        {
          label: "Full Name",
          value: user.candidate_name || "",
        },
        {
          label: "Date of Birth",
          value: user.candidate_dob
            ? new Date(user.candidate_dob).toLocaleDateString("en-GB")
            : "",
        },
        {
          label: "Phone Number",
          value: user.candidate_mobile || "",
        },
        {
          label: "Email",
          value: user.candidate_email || "",
        },
        {
          label: "Address",
          value: user.candidate_address || "",
        },
        {
          label: "Gender",
          value: user.candidate_gender
            ? user.candidate_gender.charAt(0).toUpperCase() +
              user.candidate_gender.slice(1)
            : "",
        },
      ]
    : [];

  const formatName = (name?: string) => {
    if (!name) return "N/A";

    return name
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <EmployerLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="space-y-6">
        {/* Candidate Information */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>

            <p className="text-sm text-muted-foreground">
              Order ID: {user?.order_id || "N/A"}
            </p>
          </CardHeader>

          <CardContent>
            {/* {loading && <p className="text-center">Loading...</p>} */}

            {error && <p className="text-center text-red-600">{error}</p>}

            {!loading && !error && user && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userData.map((field, index) => (
                  <div key={index}>
                    <Label>{field.label}</Label>

                    <Input value={field.value} readOnly />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Details */}
        {!loading && !error && user && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Verification Details</CardTitle>

              <p className="text-sm text-muted-foreground">
                Verified At:{" "}
                {new Date(user.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </p>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-[220px]">
                        Candidate Name
                      </TableHead>

                      <TableHead className="text-center w-[120px]">
                        PAN
                      </TableHead>

                      <TableHead className="text-center w-[120px]">
                        Passport
                      </TableHead>

                      <TableHead className="text-center w-[150px]">
                        Aadhaar With OTP
                      </TableHead>

                      <TableHead className="text-center w-[120px]">
                        DL
                      </TableHead>

                      <TableHead className="text-center w-[120px]">
                        EPIC
                      </TableHead>

                      <TableHead className="text-center w-[140px]">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell className="text-center font-medium">
                        {formatName(user?.candidate_name)}
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {getStatusIcon(user?.pan_response)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {getStatusIcon(user?.passport_response)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {getStatusIcon(user?.aadhaar_response)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {getStatusIcon(user?.dl_response)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {getStatusIcon(user?.epic_response)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDownload}
                            disabled={pdfLoading}
                            title="Download Verification Report"
                            className="
                                transition-all
                                duration-200
                                hover:bg-blue-50
                                hover:shadow-md
                                hover:scale-105
                                rounded-full
                            "
                          >
                            {pdfLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            ) : (
                              <FileText className="h-5 w-5 text-blue-600 hover:text-blue-700" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aadhaar Details */}
        {!loading && !error && user && <AadharDetails user={user} />}
      </div>
    </EmployerLayout>
  );
};

export default VerifiedAadharPage;
