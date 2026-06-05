import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";
import api from "@/lib/axios";
import { EmployerLayout } from "@/components/EmployerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PanDetails from "@/components/employer/verification/PanDetails";
import PassportDetails from "@/components/employer/verification/PassportDetails";
import AadharDetails from "@/components/employer/verification/AadhaarDetails";
import DlDetails from "@/components/employer/verification/DlDetails";
import EpicDetails from "@/components/employer/verification/EpicDetails";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-GB");
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("en-IN");
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

const VerifiedDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setError("Missing candidate id in query string.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.post("/api/verify/verifiedDetails", { id });
        setUser(response?.data?.user ?? null);
      } catch (err) {
        console.error(err);
        setError("Unable to load verified candidate details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleClick = (documentId: string) => {
    document.getElementById(documentId)?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <EmployerLayout>
        <Card>
          <CardContent className="py-10 text-center">Loading verified details…</CardContent>
        </Card>
      </EmployerLayout>
    );
  }

  if (error) {
    return (
      <EmployerLayout>
        <Card>
          <CardContent className="py-10 text-center text-red-600">{error}</CardContent>
        </Card>
      </EmployerLayout>
    );
  }

  if (!user) {
    return (
      <EmployerLayout>
        <Card>
          <CardContent className="py-10 text-center">No verified candidate details found.</CardContent>
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
            <p className="text-sm text-muted-foreground">Order ID: {user.order_id || "N/A"}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Label>Full Name</Label>
                <Input value={user?.candidate_name || "N/A"} readOnly />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input value={formatDate(user?.candidate_dob)} readOnly />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={user?.candidate_mobile || "N/A"} readOnly />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.candidate_email || "N/A"} readOnly />
              </div>
              <div>
                <Label>Gender</Label>
                <Input value={user?.candidate_gender || "N/A"} readOnly />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={user?.candidate_address || "N/A"} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              Verified at: {formatDateTime(user?.createdAt)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead className="text-center">PAN</TableHead>
                    <TableHead className="text-center">Passport</TableHead>
                    <TableHead className="text-center">Aadhaar</TableHead>
                    <TableHead className="text-center">DL</TableHead>
                    <TableHead className="text-center">EPIC</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{user?.candidate_name || "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <button type="button" onClick={() => handleClick("pan_response")}>{getStatusIcon(user?.pan_response)}</button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button type="button" onClick={() => handleClick("passport_response")}>{getStatusIcon(user?.passport_response)}</button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button type="button" onClick={() => handleClick("aadhaar_response")}>{getStatusIcon(user?.aadhaar_response)}</button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button type="button" onClick={() => handleClick("dl_response")}>{getStatusIcon(user?.dl_response)}</button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button type="button" onClick={() => handleClick("epic_response")}>{getStatusIcon(user?.epic_response)}</button>
                    </TableCell>
                    <TableCell className="text-center">
                      <FileText className="h-5 w-5 text-blue-600 mx-auto" />
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
          <AadharDetails user={user} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DlDetails user={user} />
          <EpicDetails user={user} />
        </div>
      </div>
    </EmployerLayout>
  );
};

export default VerifiedDetailsPage;
