import { useParams, Link } from "react-router-dom";
import { useState, useEffect,useRef } from "react";
import{YMD} from "../lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Select from "react-select";
const sectors = [
  "IT Services",
  "Consulting",
  "Banking",
  "Manufacturing",
  "Healthcare",
  "E-commerce",
  "Education",
  "Other",
];

const recruiterSchema = z.object({
  numberOfHired: z.string().trim().optional(),
  scheduledDate: z.string().trim().optional(),
  scheduledTime: z.string().trim().optional(),
  numberOfOpenings: z.string().trim().min(2, "Opening is required"),
  courses: z.string().trim().min(2, "Course is required"),
  role: z.string().trim().min(2, "Role is required"),
  tenTh: z
    .string()
    .trim()
    .min(1, "10th% is required")
    .refine(
      (val) => {
        const num = Number(val);
        return (
          /^\d+(\.\d{1,2})?$/.test(val) && !isNaN(num) && num >= 0 && num <= 100
        );
      },
      {
        message: "Percentage must be between 0 and 100",
      },
    ),
  twelveTh: z
    .string()
    .trim()
    .min(1, "12th% is required")
    .refine(
      (val) => {
        const num = Number(val);
        return (
          /^\d+(\.\d{1,2})?$/.test(val) && !isNaN(num) && num >= 0 && num <= 100
        );
      },
      {
        message: "Percentage must be between 0 and 100",
      },
    ),
  remarks: z.string().trim().optional(),
});

type RecruiterForm = z.infer<typeof recruiterSchema>;

const emptyForm: RecruiterForm = {
  numberOfHired: "",
  numberOfOpenings: "",
  courses: "",
  tenTh: "",
  twelveTh: "",
  date: "",
  time: "",
  remarks: "",
  role: "",
};


const statusStyles: Record<string, string> = {
  Active: "bg-white text-[#00b33c] border-green-600/40",
  Reviewing: "bg-white text-warning border-warning/20",
  Closed: "bg-white text-red-700 border-red-600/40",
};

const recruitersDB: Record<string, any> = {
  default: {
    name: "Tata Consultancy Services",
    sector: "IT Services",
    status: "Active",
    rating: 4.8,
    website: "tcs.com",
    email: "campus@tcs.com",
    phone: "+91 22 6778 9999",
    location: "Mumbai, Maharashtra",
    since: "Jan 2019",
    description:
      "Global leader in IT services, consulting and business solutions. Long-standing hiring partner across engineering and management programs.",
    openings: 42,
    hired: 28,
    interviews: 96,
    offerRate: 67,
    sectors: ["Software Engineering", "Data & Analytics", "Cloud", "Consulting"],
  },
};



const stageStyles: Record<string, { cls: string; icon: any }> = {
  Hired: { cls: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  Offered: { cls: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  "Final Round": { cls: "bg-accent/10 text-accent border-accent/20", icon: Clock },
  Technical: { cls: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  Rejected: { cls: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};
import API from "../lib/axios";
const RecruiterRequirementDetail = () => {
  const [recruiter,setRecruiter]=useState()
  const [requirements,setRequirement]=useState()
    const [query, setQuery] = useState("");
  const { id } = useParams();
  
const apiurl = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState<RecruiterForm>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RecruiterForm, string>>
  >({});
  //const [contact, setContact] = useState<Recruiter | null>(null);

  const [edit, setEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseSelected, setCourseSelected] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
     const [selectedSudent, setSelectedSudent] = useState(); 
     const [refresh, setRefresh] = useState(0); 
  const { toast } = useToast();

  const r = recruitersDB[id ?? "default"] ?? recruitersDB.default;
  const initials = r.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("");

console.log("selected",selectedSudent,recruiter?._id);


/* const itemsPerPage = 10;
  const filtered = (requirements || [])?.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );
 

    const totalPages = Math.ceil(filtered?.length / itemsPerPage);
  const paginatedLists = filtered?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  ); */
/* console.log('paginatedLists',paginatedLists) */

/*     const fetchRecruiter= async () => {
    try {
      const res = await API.get(
        `/api/instituteprofile/get_all_companies_by_institute?id=${id}`,
      );
      const data = res?.data?.data || {};
      console.log(data)
      setRecruiter(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  }; */


  const toggleItem = (item) => {
    setSelectedSudent((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };
useEffect(()=>{
  setSelectedSudent(requirements)
},[requirements])
 

const sendInterview = async () => {
  
    const payload = {
     students:selectedSudent, 
     recruiter:recruiter
    };

    let response = "";
    try {
      response = await API({
        method: "post",
        url: "/api/instituteprofile/student-interview",
        data: payload,
      });
      toast({
        title: "Success",
        description: "Requirement save successfully",
      });
     
    } catch (err) {
      if (err.response) {
        toast({
          title: "Error",
          variant: "destructive",
          description: `${err.response.data.message || "Something went wrong"}`,
        });
      }
    }
  };


  const fetchRequirement= async () => {
    try {
      const res = await API.get(
        `/api/instituteprofile/get_company_requirement_by_id?id=${id}`,
      );
      const data = res?.data?.data || [];
      //console.log('fetchRequirement',data)
      setRecruiter(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const fetchCompanyRequirementSudents= async (program,tenth,twelvth) => {
    try {
      //console.log("gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg")
      const res = await API.get(
        `/api/institutestudent/company-requirement-sudents?program=${program}&tenth=${tenth}&twelvth=${twelvth}`,
      );
      const data = res?.data?.data || [];
      //console.log('fetchRequirement',data)
      setRequirement(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  
  useEffect(() => {
    /* fetchRecruiter(); */
    fetchRequirement();
  }, []);

  useEffect(() => {
    //console.log('recruiter?._id',recruiter?._id)
    if (recruiter?._id) {
      console.log('recruiter', recruiter);
      setForm({
  numberOfHired: recruiter?.numberOfHired || "",
  numberOfOpenings:  String(recruiter?.numberOfOpenings) || "",
  courses:recruiter?.courses?"true":"",
  tenTh: String(recruiter?.tenth) || "",
  twelveTh: String(recruiter?.twelvth) || "",
  date: recruiter?.date || "",
  time: recruiter?.time || "",
  remarks: recruiter?.remarks || "",
  role: recruiter?.role || "",
      });
      const program=[]
         const course=recruiter?.courses?.map((id)=>{
            const row=courses.find((item)=>item.value===id);
            if(row){
                program.push(row.value)
                return({'value':row.value,'label':row.label})
            }
          })
          //console.log("ssssssssssssssssssssssssssssssssssssssssss",courses,course,program,recruiter?.courses,recruiter?.twelvth)
          fetchCompanyRequirementSudents(program,recruiter?.tenth,recruiter?.twelvth)
         setCourseSelected(()=>course||[])
    }
  }, [recruiter?._id]);

  const update = <K extends keyof RecruiterForm>(
    key: K,
    value: RecruiterForm[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Remove error message while typing
    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

 

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 console.log("form",form);
    const result = recruiterSchema.safeParse(form);
    console.log("result", result);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RecruiterForm, string>> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as keyof RecruiterForm;
        if (!fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      console.log("fieldErrors", fieldErrors);
      return;
    }
    setErrors({});
    const courseOptions = courseSelected.map((item) => item.value);
    const payload = {
      numberOfHired: result.data.numberOfHired,
      numberOfOpenings: result.data.numberOfOpenings,
      tenth: result.data.tenTh,
      twelvth: result.data.twelveTh,
      remarks: result.data.remarks,
      role: result.data.role,
      courses: courseOptions,
      date: form.date,
      time: form.time,
      id:recruiter?._id
    };

    let response = "";
    try {
      response = await API({
        method: "put",
        url: "/api/instituteprofile/update_company_requirement",
        data: payload,
      });
      window.location.reload()
      toast({
        title: "Success",
        description: "Requirement save successfully",
      });
      //await fetchRecruiterList();
      setForm(emptyForm);
      setCourseSelected([]);
    } catch (err) {
      if (err.response) {
        toast({
          title: "Error",
          variant: "destructive",
          description: `${err.response.data.message || "Something went wrong"}`,
        });
      }
    }
  };


const StudentInterview= async () => {
    const payload = {
      students:selectedSudent, 
      recruiter:recruiter
    };
    let response = "";
    try {
      response = await API({
        method: "post",
        url: "/api/institutestudent/student-interview",
        data: payload,
      });
      toast({
        title: "Success",
        description: "Requirement save successfully",
      });
     
    } catch (err) {
      if (err.response) {
        toast({
          title: "Error",
          variant: "destructive",
          description: `${err.response.data.message || "Something went wrong"}`,
        });
      }
    }
  };




  const fetchCourseList = async () => {
    try {
      const res = await API.get("/api/institute-course/course");
      const data = res?.data?.data || [];
      const options = data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setCourses(options);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchCourseList();
  }, []);





  return (
    <DashboardLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
        <Link to="/institute/recruiters"><ArrowLeft className="h-4 w-4" /> Back to recruiters</Link>
      </Button>

     {/*  <PageHeader
        eyebrow="Recruiter profile"
        title={recruiter?.companyName||""}
        description={recruiter?.description}
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <MessageSquare className="h-4 w-4" /> Message
            </Button>
          </>
        }
      /> */}

      {/* Profile summary */}
     <Card className="mb-6 border-border/60 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#1b4498] px-6 pt-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            
           {/*  <Avatar className="h-20 w-20 border-4 border-card shadow-md">
              <AvatarFallback className="bg-primary-soft text-white font-display font-bold text-2xl">
                {recruiter?.companyName?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar> */}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="text-center">
                  <h2 className="font-display text-xl font-bold text-white">
                    {recruiter?.companyName?.companyName || ""}
                  </h2>

                  <div className=" text-[14px] text-white">
                    {courseSelected.map((item, index) => (
                      <span key={item?.label}>
                        {item?.label}
                        {index < courseSelected.length - 1 && " | "}
                      </span>
                    ))}
                  </div>
                </div>

                

              {/*   <Badge
                  variant="outline"
                  className="bg-white"
                >
                  {recruiter?.status || ""}
                </Badge> */}

                {/* <Badge variant="outline" className={statusStyles[recruiter?.status]}>
                                {recruiter?.status}
                              </Badge>

                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {recruiter?.rating || ""}
                </Badge> */}
              </div>

             {/*  <p className="text-sm text-white mt-1">
                {recruiter?.sector || ""} • since {recruiter?.since || ""}
              </p> */}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="pt-0">
              <Separator className="mb-5" />

         <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid gap-4 md:grid-cols-2">
           
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="Course">
                  Course <span className="text-red-500">*</span>
                </Label>

                <Select
                  options={courses}
                  isMulti
                  value={courseSelected}
                  onChange={(value) => {
                    setCourseSelected(value);
                    //clearFieldError("courses");
                    update("courses", value?.[0]?.value);
                  }}
                />

                {errors?.courses && (
                  <p className="text-sm text-red-500">{errors.courses}</p>
                )}
              </div>
            
           

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="numberOfOpenings">
                  10th (%) <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="tenTh"
                  value={form.tenTh}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9.]*$/.test(value)) {
                      update("tenTh", value);
                    }
                  }}
                  placeholder="10th (%)"
                />

                {errors.tenTh && (
                  <p className="text-xs text-destructive">{errors.tenTh}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">
                  12th (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="twelveTh"
                  type="text"
                  value={form.twelveTh}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9.]*$/.test(value)) {
                      update("twelveTh", value);
                    }
                  }}
                  placeholder="12th (%)"
                />
                {errors.twelveTh && (
                  <p className="text-xs text-destructive">{errors.twelveTh}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="numberOfOpenings">
                  Openings <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="numberOfOpenings"
                  value={form.numberOfOpenings}
                  maxLength="4"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value)) {
                      update("numberOfOpenings", value);
                    }
                  }}
                  placeholder="Openings"
                />

                {errors.numberOfOpenings && (
                  <p className="text-xs text-destructive">
                    {errors.numberOfOpenings}
                  </p>
                )}
              </div>
            </div>
            {/* 
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Hired *</Label>
                    <Input
                      id="numberOfHired"
                      type="text"
                      value={form.numberOfHired}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value)) {
                          update("numberOfHired", value);
                        }
                      }}
                      placeholder="Hired"
                    />
                    {errors.numberOfHired && (
                      <p className="text-xs text-destructive">{errors.numberOfHired}</p>
                    )}
                  </div> */}

            <div className="space-y-1.5">
              <Label htmlFor="notes">
                Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="role"
                type="text"
                value={form.role}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z,\s]*$/.test(value)) {
                    update("role", value);
                  }
                }}
                placeholder="Role"
              />
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role}</p>
              )}
            </div>

            <div className="space-y-1.5 ">
              <Label htmlFor="notes">Remarks</Label>
              <Textarea
                id="remarks"
                value={form.remarks}
                onChange={(e) => update("remarks", e.target.value)}
                placeholder="remarks"
                maxLength={500}
                rows={5}
              />
            </div>
              <div className="space-y-1.5">
                <Label htmlFor="scheduledDate">
                  Exam Date 
                </Label>
                <Input
                  style={{ position: "relative" }}
                  id="date"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={YMD(form.date)}
                  onChange={(e) => update("date", e.target.value)}
                />
                {errors.date && (
                  <p className="text-xs text-destructive">
                    {errors.date}
                  </p>
                )}

                <div className="space-y-1.5">
                <Label htmlFor="time">
                  Exam Time 
                </Label>
                <Input
                  style={{ position: "relative" }}
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                />
                {errors.time && (
                  <p className="text-xs text-destructive">
                    {errors.time}
                  </p>
                )}
              </div>
              </div>
               
          </div>

           <div className="flex justify-end">
  <Button
    type="submit"
    className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
  >
    Update
  </Button>
</div>
         
        </form>
        </CardContent>
    </Card>

      <Card className="shadow-sm border-border/60">
        <CardContent className="p-4 md:p-6">
         {/*  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div></div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search campus..."
                  className="pl-9 w-full md:w-72"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div> */}

          <div className="w-full overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[700px] text-sm text-center">
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="font-medium py-3 px-4 text-center">
                    Student Name
                  </th>

                  <th className="font-medium py-3 px-4 text-center">Course Name</th>

                  <th className="font-medium py-3 px-4 text-center">
                    10th %
                  </th>

                  <th className="font-medium py-3 px-4 text-center">
                   12th %
                  </th>
                   <th className="font-medium py-3 px-4 text-center">
                   Placement
                  </th>
                  <th className="font-medium py-3 px-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {requirements?.map((s) => (
                  <tr
                    key={s?._id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold">{s?.name}</p>
                    </td>

                    <td className="py-4 px-4 text-muted-foreground">
                      {s?.programDetails?.name}
                    </td>

                    <td className="py-4 px-4 text-muted-foreground">
                      {s?.tenTh}
                    </td>
                     <td className="py-4 px-4 text-muted-foreground">
                      {s?.twelveTh}
                    </td>

                    <td className="py-4 px-4 text-muted-foreground">
                      {Number(s?.total_students || 0).toLocaleString()}
                    </td>

                   <td className="py-4 px-4 text-muted-foreground">
                     <input type="checkbox" checked={selectedSudent?.includes(s)}
                       onChange={() => toggleItem(s)}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
           <div className="flex justify-end">
  <Button
   onClick={()=>StudentInterview()}
    className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand mt-3"
  >
    Submit
  </Button>
</div>

          {/* Pagination */}
       {/*  <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>  */}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default RecruiterRequirementDetail;
