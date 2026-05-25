import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Award,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import API from "../lib/axios";
const courses = [
  {
    code: "CSE-401",
    name: "Advanced Algorithms",
    students: 124,
    term: "Spring 2026",
  },
  {
    code: "CSE-412",
    name: "Distributed Systems",
    students: 96,
    term: "Spring 2026",
  },
  {
    code: "CSE-310",
    name: "Operating Systems",
    students: 142,
    term: "Fall 2025",
  },
  {
    code: "CSE-505",
    name: "Machine Learning",
    students: 88,
    term: "Fall 2025",
  },
];

const mentees = [
  { id: "STU-10241", name: "Priya Menon", course: "B.Tech CSE", score: 92 },
  { id: "STU-10239", name: "Aisha Khan", course: "B.Sc Data Sci.", score: 81 },
  { id: "STU-10238", name: "Karthik Iyer", course: "B.Tech ECE", score: 78 },
  { id: "STU-10235", name: "Sara Joseph", course: "M.Sc Stats", score: 88 },
];
const statusStyles: Record<string, string> = {
  Active: "bg-white text-[#00b33c] border-green-600/40",
  Reviewing: "bg-white text-warning border-warning/20",
  Closed: "bg-white text-red-700 border-red-600/40",
};

const FacultyDetail = () => {
  const { id } = useParams();
  const name = "Dr. A. Sharma";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const [faculty, setFaculty] = useState();

  const fetchFaculty = async () => {
    try {
      const res = await API.get(
        `/api/instituteprofile/get_faculty?id=${id}`,
      );
      const data = res?.data?.data || {};
      setFaculty(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return (
    <DashboardLayout>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <Link to="/institute/faculty">
          <ArrowLeft className="h-4 w-4" /> Back to faculty
        </Link>
      </Button>

      <PageHeader
        /*  eyebrow={`Faculty • ${id ?? "FAC-001"}`} */
        title={faculty?.full_name||""}
        description=""
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" /> Schedule
            </Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <MessageSquare className="h-4 w-4" /> Message
            </Button>
          </>
        }
      />

      <Card className="mb-6 border-border/60 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#1b4498] px-6 pt-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <Avatar className="h-20 w-20 border-4 border-card shadow-md">
              <AvatarFallback className="bg-primary-soft text-white font-display font-bold text-2xl">
                {faculty?.full_name?.split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold text-white">
                  {faculty?.full_name||""}
                </h2>

              {/*   <Badge
                  variant="outline"
                  className="bg-success/10 text-white border-white/20"
                >
                  Active
                </Badge>

                <Badge
                  variant="outline"
                  className="gap-1 bg-white/10 text-white border-white/20"
                >
                  <Award className="h-3 w-3 text-warning" />
                  4.8 / 5
                </Badge> */}
              </div>

              <p className="text-sm text-white mt-1">
                {faculty?.department||""} .  {faculty?.role||""}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="pt-0">
          <Separator className="mb-5" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="text-foreground truncate">{faculty?.email||""}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">Phone</p>
                <p className="text-foreground truncate">{faculty?.phone_number||""}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">Office</p>
                <p className="text-foreground">Block A, Room 214</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">Office hours</p>
                <p className="text-foreground">Mon–Fri, 11–1 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard
          label="Students Mentored"
          value="412"
          delta={8}
          icon={Users}
          tint="primary"
        />
        <StatCard
          label="Courses Taught"
          value="4"
          delta={1}
          icon={BookOpen}
          tint="accent"
        />
        <StatCard
          label="Avg. Rating"
          value="4.8"
          delta={2}
          icon={Award}
          tint="success"
        />
      </div>

      <Tabs defaultValue="courses">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="courses">Courses</TabsTrigger>
        {/*   <TabsTrigger value="mentees">Mentees</TabsTrigger> */}
          <TabsTrigger value="bio">Biography</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                   {/*  <TableHead>Course</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead className="text-right">Students</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faculty?.course_details?.map((c) => (
                    <TableRow key={c?._id}>
                      <TableCell className="font-medium text-primary">
                        {c?.name}
                      </TableCell>
                   {/*    <TableCell className="text-foreground">
                        {c.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {c.term}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {c.students}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentees" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentees.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <Link
                          to={`/students/${m.id}`}
                          className="flex items-center gap-3 hover:text-primary"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">
                              {m.name
                                .split(" ")
                                .map((w) => w[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {m.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {m.id}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.course}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {m.score}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bio" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
              <CardDescription>Background and accomplishments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  
                  <div dangerouslySetInnerHTML={{ __html: faculty?.about }} />
              <Separator />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground font-semibold mb-2">
                    Areas of expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {faculty?.area_of_experties?.map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground font-semibold mb-2">
                    Recognitions
                  </p>
                  {/* <ul className="list-disc list-inside space-y-1">
                    <li>Best Placement Officer — AICTE 2024</li>
                    <li>Industry Bridge Award — NASSCOM 2023</li>
                    <li>3x author of placement strategy whitepapers</li>
                  </ul> */}
                 
                  <div dangerouslySetInnerHTML={{ __html: faculty?.recognitions  }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default FacultyDetail;
