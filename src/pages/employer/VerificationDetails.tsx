import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import api from "@/lib/axios";

import { EmployerLayout } from "@/components/EmployerLayout";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CheckCircle, XCircle, AlertCircle, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PanDetails from "@/components/employer/verification/PanDetails";
import PassportDetails from "@/components/employer/verification/PassportDetails";
import AadhaarDetails from "@/components/employer/verification/AadhaarDetails";
import DlDetails from "@/components/employer/verification/DlDetails";
import EpicDetails from "@/components/employer/verification/EpicDetails";

const VerificationDetails = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchDetails = async () => {
    try {
      const response = await api.post("/api/verify/verifiedDetails", {
        id,
      });

      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setPdfLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pdf/generate-pdf`,
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
    }
  };

  const getStatusIcon = (response: any) => {
    if (!response) {
      return <AlertCircle className="h-5 w-5 text-muted-foreground mx-auto" />;
    }

    if (
      response?.response_code === "100" ||
      response?.response_code === 100 ||
      response?.status_code === 200
    ) {
      return <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />;
    }

    return <XCircle className="h-5 w-5 text-red-600 mx-auto" />;
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <EmployerLayout>
        <Card>
          <CardContent className="py-10 text-center">Loading...</CardContent>
        </Card>
      </EmployerLayout>
    );
  }

  if (!user) {
    return (
      <EmployerLayout>
        <Card>
          <CardContent className="py-10 text-center">
            No record found
          </CardContent>
        </Card>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>

            <p className="text-sm text-muted-foreground">
              Order ID : {user.order_id}
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Label>Full Name</Label>
                <Input value={user.candidate_name || ""} readOnly />
              </div>

              <div>
                <Label>Date of Birth</Label>
                <Input
                  value={
                    user.candidate_dob
                      ? new Date(user.candidate_dob).toLocaleDateString("en-GB")
                      : ""
                  }
                  readOnly
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input value={user.candidate_mobile || ""} readOnly />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={user.candidate_email || ""} readOnly />
              </div>

              <div>
                <Label>Gender</Label>
                <Input value={user.candidate_gender || ""} readOnly />
              </div>

              <div>
                <Label>Address</Label>
                <Input value={user.candidate_address || ""} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Details</CardTitle>

            <p className="text-sm text-muted-foreground">
              Verified At :{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleString("en-IN")
                : "-"}
            </p>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead className="text-center">PAN</TableHead>
                    <TableHead className="text-center">Passport</TableHead>
                    <TableHead className="text-center">Aadhaar</TableHead>
                    <TableHead className="text-center">DL</TableHead>
                    <TableHead className="text-center">EPIC</TableHead>
                    <TableHead className="text-center">UAN</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {user.candidate_name}
                    </TableCell>

                    <TableCell className="text-center">
                      {getStatusIcon(user.pan_response)}
                    </TableCell>

                    <TableCell className="text-center">
                      {getStatusIcon(user.passport_response)}
                    </TableCell>

                    <TableCell className="text-center">
                      {getStatusIcon(user.aadhaar_response)}
                    </TableCell>

                    <TableCell className="text-center">
                      {getStatusIcon(user.dl_response)}
                    </TableCell>

                    <TableCell className="text-center">
                      {getStatusIcon(user.epic_response)}
                    </TableCell>

                    <TableCell className="text-center">
                      {getStatusIcon(user.uan_response)}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        disabled={pdfLoading}
                      >
                        {pdfLoading ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <Download className="h-4 w-4 text-primary" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <PanDetails user={user} />
          <PassportDetails user={user} />
          <AadhaarDetails user={user} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DlDetails user={user} />
          <EpicDetails user={user} />
        </div>
      </div>
    </EmployerLayout>
  );
};

export default VerificationDetails;
