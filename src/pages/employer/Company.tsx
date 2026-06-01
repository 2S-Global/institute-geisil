import { Building2, Globe, MapPin, Users, Edit } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import API from "@/lib/axios";
import { useEffect, useState } from "react";
export default function Company() {
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState<any>(null);

  const FetchCompanyDetails = async () => {
    setLoading(true);

    try {
      const response = await API.get("/api/companyprofile/get_company_details");

      if (response.data.success) {
        setCompany(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchCompanyDetails();
  }, []);

  const formatTeamSize = (size: string) => {
    switch (size) {
      case "less_than_50":
        return "Less than 50";

      case "50_100":
        return "50 - 100";

      case "101_500":
        return "101 - 500";

      case "501_1000":
        return "501 - 1000";

      case "more_than_1000":
        return "More than 1000";

      default:
        return "N/A";
    }
  };
  return (
    <EmployerLayout>
      <PageHeader
        title="Company Profile"
        description="Information visible to candidates and partner institutes."
        actions={
          <Link to="/employer/company-profile">
            <Button className="gap-2 shadow-brand">
              <Edit className="h-4 w-4" /> Edit profile
            </Button>
          </Link>
        }
      />
      <Card className="p-4 sm:p-6 mb-6 border-border/60 shadow-sm bg-gradient-to-br from-primary-soft to-card overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 sm:items-start">
          {/* Logo */}
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden border bg-white flex items-center justify-center shadow-sm shrink-0 mx-auto sm:mx-0">
            {company?.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {company?.name?.charAt(0) || "C"}
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground break-words">
              {company?.name || "Company Name"}
            </h1>

            {/* <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
              {company?.about || "No company description available."}
            </p> */}

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 max-w-full">
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="break-words">
                  {company?.industryName || "Industry"}
                </span>
              </span>

              <span className="flex items-center gap-1 max-w-full">
                <Globe className="h-4 w-4 shrink-0" />

                <a
                  href={company?.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary break-all"
                >
                  {company?.website}
                </a>
              </span>

              {/* <span className="flex items-center gap-1 max-w-full">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="break-words">Kolkata, India</span>
              </span> */}

              <span className="flex items-center gap-1 max-w-full">
                <Users className="h-4 w-4 shrink-0" />
                <span>{formatTeamSize(company?.teamsize)} Employees</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">About</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm space-y-3">
            <p>{company?.about || "No company description available."}</p>
            <p>
              We hire across engineering, product, design, and go-to-market —
              and partner with top institutes for early-career programs.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">Company Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            {/* Company Type */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-xl p-4">
              <span className="text-muted-foreground font-medium">
                Company Type
              </span>

              <span className="text-right font-medium">
                {company?.company_type_name || "N/A"}
              </span>
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-xl p-4">
              <span className="text-muted-foreground font-medium">Email</span>

              <span className="text-right break-all">
                {company?.email || "N/A"}
              </span>
            </div>

            {/* Phone */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-xl p-4">
              <span className="text-muted-foreground font-medium">Phone</span>

              <span className="font-medium">{company?.phone || "N/A"}</span>
            </div>

            {/* CIN */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-xl p-4">
              <span className="text-muted-foreground font-medium">CIN</span>

              <span className="text-right break-all font-medium">
                {company?.cin || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="font-display">Office Location</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-border/60 p-5 bg-muted/20">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                {/* <h3 className="font-semibold text-foreground text-base">
                  Headquarters
                </h3> */}

                <p className="text-sm text-muted-foreground mt-1 leading-relaxed break-words">
                  {company?.address || "Address not available"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </EmployerLayout>
  );
}
