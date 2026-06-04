import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Linkedin, Download, MessageSquare } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import API from "@/lib/axios";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
export default function CandidateDetail() {
  const { id } = useParams();
 const [loading, setLoading] = useState(false);
 const [candidate, setCandidate] = useState(null);



useEffect(() => {
  if (id) {
    loadCandidateData();
  }
}, [id]);

const loadCandidateData = async () => {
  try {
    setLoading(true);

    const [detailsRes, detailsV2Res] = await Promise.all([
      API.get(
        `/api/candidate/candidateDetails/get_candidate_details?candidateId=${id}`,
      ),
      API.get(
        `/api/candidate/candidateDetails/get_candidate_details_v2?candidateId=${id}`,
      ),
    ]);

    const mergedData = {
      ...detailsRes.data.data,
      ...detailsV2Res.data.data,
    };

    setCandidate(mergedData);
  } catch (error) {
    console.error("Error fetching candidate details:", error);
  } finally {
    setLoading(false);
  }
};

const head = candidate?.headsectiondata;
const education = candidate?.academicDetails || [];
const employment = candidate?.employmentdata || [];
const certificates = candidate?.certificate || [];
const patents = candidate?.patent || [];
const presentations = candidate?.presentation || [];
const whitepapers = candidate?.whitepaper || [];
const kyc = candidate?.kycData;
const personal = candidate?.personalData;
const userInfo = candidate?.userInformation;
const sidebar = candidate?.sidebarDetails;
const projects = candidate?.candidateProjects || [];
  return (
    <EmployerLayout>
      {/* <Button asChild variant="ghost" size="sm" className="gap-2 mb-4 -ml-2">
        <Link to="/employer/candidates">
          <ArrowLeft className="h-4 w-4" /> Back to candidates
        </Link>
      </Button> */}

      <Card className="p-6 mb-6 border-border/60 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <Avatar className="h-20 w-20 border">
            {head?.profilePicture ? (
              <img
                src={head.profilePicture}
                alt={head?.name}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {head?.name
                  ?.split(" ")
                  ?.map((w) => w[0])
                  ?.join("")}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-foreground">
              {head?.name}
            </h1>

            <p className="text-muted-foreground">
              {candidate?.employmentdata?.[0]?.job_title || "N/A"}
            </p>

            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {head?.email}
              </span>

              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {head?.phone_number}
              </span>

              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {head?.currentLocation}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {sidebar?.resumeUrl && (
              <Button asChild variant="outline" className="gap-2">
                <a
                  href={sidebar.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </Button>
            )}

            {/* <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Message
            </Button> */}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          ["Match score", "92"],
          ["Interviews", "3"],
          ["Assessments", "2"],
          ["Status", "Interview"],
        ].map(([k, v]) => (
          <Card key={k as string} className="p-5 border-border/60 shadow-sm">
            <p className="text-xs uppercase text-muted-foreground tracking-wider">
              {k}
            </p>
            <p className="font-display text-2xl font-bold text-foreground mt-2">
              {v}
            </p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="kyc">Kyc</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="career">Career Profile</TabsTrigger>
          <TabsTrigger value="accomplishments">Accomplishments</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>

          {/* <TabsTrigger value="activity">Activity</TabsTrigger> */}
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <div className="space-y-4">
            {/* Resume Headline */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Headline</CardTitle>
              </CardHeader>
              <CardContent>{personal?.resumeHeadline || "N/A"}</CardContent>
            </Card>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {personal?.profileSummary || "No profile summary available"}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {personal?.skills?.length > 0 ? (
                  personal.skills.map((skill, index) => (
                    <Badge key={index}>{skill?.toUpperCase()}</Badge>
                  ))
                ) : (
                  <p>No skills available</p>
                )}
              </CardContent>
            </Card>

            {/* Candidate Details */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Details</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-medium">
                      {sidebar?.totalExperience?.year
                        ? `${sidebar.totalExperience.year} Years ${sidebar.totalExperience.month || 0} Months`
                        : "No experience mentioned"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium">{sidebar?.age}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Current Salary
                    </p>
                    <p className="font-medium">
                      {sidebar?.currentSalary?.currency}{" "}
                      {sidebar?.currentSalary?.salary}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Expected Salary
                    </p>
                    <p className="font-medium">
                      {sidebar?.expectedSalary?.currency}{" "}
                      {sidebar?.expectedSalary?.salary}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium">{head?.gender_name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Date of Birth
                    </p>
                    <p className="font-medium">{personal?.stringdob}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Father's Name
                    </p>
                    <p className="font-medium">{head?.father_name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Mother's Name
                    </p>
                    <p className="font-medium">{head?.mother_name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Partner's Name
                    </p>
                    <p className="font-medium">
                      {personal?.partner_name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Marital Status
                    </p>
                    <p className="font-medium">{personal?.maritalStatus}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium">{personal?.category}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Home Town</p>
                    <p className="font-medium">{head?.hometown}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Education Level
                    </p>
                    <p className="font-medium">{head?.degree}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Work Permit</p>
                    <p className="font-medium">{personal?.workPermit}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      USA Visa Type
                    </p>
                    <p className="font-medium">{personal?.usa_visa_type}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs text-muted-foreground mb-2">
                    Languages
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {personal?.languages?.map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {lang.language} ({lang.proficiency})
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs text-muted-foreground mb-2">Address</p>
                  <p>{personal?.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="education" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Academic Qualifications</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {education.map((edu) => (
                <div key={edu._id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{edu.level}</h3>

                      {edu.courseName && (
                        <p className="text-muted-foreground">
                          {edu.courseName}
                        </p>
                      )}
                    </div>

                    <Badge variant="outline">{edu.marks}%</Badge>
                  </div>

                  {edu.instituteName && (
                    <p>
                      <span className="font-medium">Institute:</span>{" "}
                      {edu.instituteName}
                    </p>
                  )}

                  {edu.universityName && (
                    <p>
                      <span className="font-medium">University:</span>{" "}
                      {edu.universityName}
                    </p>
                  )}

                  {edu.board && (
                    <p>
                      <span className="font-medium">Board:</span> {edu.board}
                    </p>
                  )}

                  {edu.duration ? (
                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {edu.duration.from} - {edu.duration.to}
                    </p>
                  ) : (
                    <p>
                      <span className="font-medium">Passing Year:</span>{" "}
                      {edu.year_of_passing}
                    </p>
                  )}

                  {edu.courseType && (
                    <p>
                      <span className="font-medium">Course Type:</span>{" "}
                      {edu.courseType}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="kyc" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "PAN Card",
                    item: kyc?.pan,
                    fields: [
                      { label: "Name", key: "name" },
                      { label: "PAN Number", key: "number" },
                    ],
                  },
                  {
                    title: "EPIC Card",
                    item: kyc?.epic,
                    fields: [
                      { label: "Name", key: "name" },
                      { label: "EPIC Number", key: "number" },
                    ],
                  },
                  {
                    title: "Driving License",
                    item: kyc?.dl,
                    fields: [
                      { label: "Name", key: "name" },
                      { label: "DL Number", key: "number" },
                      { label: "DOB", key: "dob" },
                    ],
                  },
                  {
                    title: "Passport",
                    item: kyc?.passport,
                    fields: [
                      { label: "Name", key: "name" },
                      { label: "Passport Number", key: "number" },
                      { label: "DOB", key: "dob" },
                    ],
                  },
                  {
                    title: "Aadhaar Card",
                    item: kyc?.aadhar,
                    fields: [
                      { label: "Name", key: "name" },
                      { label: "Aadhaar Number", key: "number" },
                    ],
                  },
                ].map((doc, index) => {
                  const hasData =
                    doc.item &&
                    Object.values(doc.item).some(
                      (v) =>
                        v !== "N/A" && v !== "" && v !== null && v !== false,
                    );

                  return (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">
                            {doc.title}
                          </CardTitle>

                          {hasData &&
                            (doc.item?.verified ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            ))}
                        </div>
                      </CardHeader>

                      <CardContent>
                        {hasData ? (
                          <div className="space-y-2">
                            {doc.fields.map((field) => (
                              <div key={field.key}>
                                <span className="font-medium">
                                  {field.label}:
                                </span>{" "}
                                {doc.item?.[field.key] || "N/A"}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-red-500 font-medium">
                            Data Not Available
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="experience" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 space-y-5">
              {employment.length > 0 ? (
                employment.map((exp: any) => (
                  <div key={exp._id} className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-semibold">
                      {(exp.company_name || exp.companyName || "C")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        {exp.job_title || exp.jobTitle || "N/A"}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {exp.company_name || exp.companyName || "N/A"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {exp.start_date || exp.startDate || "N/A"} -
                        {exp.currently_working || exp.currentlyWorking
                          ? " Present"
                          : exp.end_date || exp.endDate || " N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No employment history found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="accomplishments" className="mt-4">
          <div className="space-y-4">
            {/* Work Samples */}
            <Card>
              <CardHeader>
                <CardTitle>Work Profile</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {candidate?.Worklist?.map((item) => (
                  <div key={item._id}>
                    <h3 className="font-semibold text-lg">{item.workTitle}</h3>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600  break-all"
                    >
                      {item.url}
                    </a>

                    <p className="text-sm text-muted-foreground mt-2">
                      Duration: {item.durationFrom?.month}{" "}
                      {item.durationFrom?.year}
                      {item.currentlyWorking
                        ? " - Present"
                        : ` - ${item.durationTo?.month} ${item.durationTo?.year}`}
                    </p>

                    <div
                      className="mt-2"
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Research Publications */}
            <Card>
              <CardHeader>
                <CardTitle>
                  White Paper / Research Publication / Journal Entry
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {whitepapers?.map((item) => (
                  <div key={item._id}>
                    <h3 className="font-semibold text-lg">{item.title}</h3>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600  break-all"
                    >
                      {item.url}
                    </a>

                    <p className="text-sm text-muted-foreground mt-2">
                      Published On : {item.publishedOn?.month}{" "}
                      {item.publishedOn?.year}
                    </p>

                    <div
                      className="mt-2"
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Presentations */}
            <Card>
              <CardHeader>
                <CardTitle>Presentation</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {presentations?.map((item) => (
                  <div key={item._id}>
                    <h3 className="font-semibold text-lg">{item.title}</h3>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600  break-all"
                    >
                      {item.url}
                    </a>

                    <div
                      className="mt-2"
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Patents */}
            <Card>
              <CardHeader>
                <CardTitle>Patent</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {patents?.map((item) => (
                  <div key={item._id}>
                    <h3 className="font-semibold text-lg">{item.title}</h3>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600  break-all"
                    >
                      {item.url}
                    </a>

                    <p className="mt-2">
                      <strong>Patent Office:</strong> {item.patent_office}
                    </p>

                    <p>
                      <strong>Application Number:</strong>{" "}
                      {item.application_number || "N/A"}
                    </p>

                    <p>
                      <strong>Status:</strong> {item.status}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certification</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {certificates?.map((item) => (
                  <div key={item._id}>
                    <h3 className="font-semibold text-lg">{item.title}</h3>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600  break-all"
                    >
                      {item.url}
                    </a>

                    <p className="mt-2">
                      Certification ID: {item.certificationId}
                    </p>

                    <p>
                      Valid From: {item.validityFromyear}
                      {item.doesNotExpire && " • Does not expire"}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="career" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Career Profile</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Industry</p>
                  <p className="font-medium">
                    {candidate?.candidateCareerProfile?.industry_name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium">
                    {candidate?.candidateCareerProfile?.department_name ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Job Role</p>
                  <p className="font-medium">
                    {candidate?.candidateCareerProfile?.job_role_name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Job Type</p>
                  <p className="font-medium">
                    {candidate?.candidateCareerProfile?.job_type || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Employment Type
                  </p>
                  <p className="font-medium">
                    {candidate?.candidateCareerProfile?.employment_type ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Shift</p>
                  <p className="font-medium">
                    {candidate?.candidateCareerProfile?.shift || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Expected Salary
                  </p>
                  <p className="font-medium">
                    {candidate?.candidateCareerProfile?.expected_salary ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Preferred Location
                  </p>
                  <p className="font-medium">
                    {candidate?.candidateCareerProfile?.preferredLocations ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <div
                    key={project._id}
                    className="border rounded-lg p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {project.title}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          Client: {project.client}
                        </p>
                      </div>

                      {/* <Badge
                        variant={
                          project.status === "finished"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {project.status}
                      </Badge> */}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Duration: {project.workfrommonth_name}{" "}
                      {project.workfromyear} to {project.worktomonth_name}{" "}
                      {project.worktoyear}
                    </p>

                    <div className="text-sm leading-6">
                      {project.description}
                    </div>

                    {project.taggedWithName && (
                      <div>
                        <Badge variant="outline">
                          {project.taggedWithName}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No projects available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EmployerLayout>
  );
}
