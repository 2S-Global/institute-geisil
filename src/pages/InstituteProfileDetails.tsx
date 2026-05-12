import { Building2, Globe, MapPin, GraduationCap, Edit, Award, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../lib/axios";

function websiteName(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return "";
  }
}


export default function InstituteProfileDetails() {
   const [loading, setLoading] = useState(false);
   const [profile, setProfile] = useState();
   const [student, setStudent] = useState();
  
  
  const navigate=useNavigate() 

  const FetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/instituteprofile/get_company_details`,
      );

      if (response.data.success) {
        const data = response.data.data;
        setProfile(data);

        //setDisableform(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentStatus = async () => {
      try {
        const res = await API.get("/api/institutestudent/get_students_counts");
        const data = res.data;
        setStudent(data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };


   useEffect(() => {
    FetchCompanyDetails();
    fetchStudentStatus();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Manage"
        title="Institute Profile"
        description="Information visible to recruiters, students and partner organizations."
        actions={<Button className="gap-2 shadow-brand" onClick={()=>navigate('/institute/institute-profile')}><Edit className="h-4 w-4" /> Edit profile</Button>}
      />

      <Card className="p-6 mb-6 border-border/60 shadow-sm bg-gradient-to-br from-primary-soft to-card">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="h-20 w-20 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display text-3xl font-bold shadow-brand">G</div>
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold text-foreground">{profile?.name||''}</h2>
            <p className="text-muted-foreground mt-1">Empowering students with industry-ready skills since {profile?.established && profile?.established.split('-')?.[0]||""}.</p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> Higher Education</span>
              <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {websiteName(profile?.website)}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Bengaluru, India</span>
              <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {student?.totalStudents||0}+ students</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader><CardTitle className="font-display">About</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground text-sm space-y-3">
           <p>{profile?.about||''}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader><CardTitle className="font-display">Programs</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {["Computer Science", "Electronics", "Mechanical", "MBA", "Data Science", "Design"].map(s => (
              <Badge key={s} variant="outline" className="bg-primary/10 text-primary border-primary/20">{s}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        {[
          { icon: GraduationCap, label: "Students", value: student?.totalStudents||0} ,
          { icon: Users, label: "Faculty", value: "286" },
          { icon: Award, label: "Placement rate", value: "92%" },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="border-border/60 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-display text-2xl font-bold text-foreground">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 shadow-sm mt-6">
        <CardHeader><CardTitle className="font-display">Campuses</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {[["Bengaluru", "Main campus · 3,200 students"], ["Hyderabad", "Tech campus · 1,100"], ["Pune", "Business school · 512"]].map(([c, d]) => (
            <div key={c} className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-foreground">{c}</p>
              <p className="text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
