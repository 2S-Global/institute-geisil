import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Mail,
  Phone,
  Users,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import List from "@/components/institute/Faculty/List";
import FormModal from "@/components/institute/Faculty/FormModal";
import api from "@/lib/axios";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";
const ITEMS_PER_PAGE = 9;
const MAX_CHARS = 500;
/*  .refine((val) => stripHtml(val).length <= MAX_CHARS, {
      message: `About Us must be at most ${MAX_CHARS} characters`,
    }) */
const stripHtml = (val?: string) => {
  if (!val) return "";
  const clean = val
    .replace(/<(.|\n)*?>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return clean;
};

const facultySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .regex(/^[A-Za-z\s.]+$/, "Only alphabets are allowed")
    .max(120),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number cannot exceed 10 digits"),

  role: z
    .string()
    .trim()
    .min(2, "Role is required")
    .regex(/^[A-Za-z\s.]+$/, "Only alphabets are allowed")
    .max(120),

  dept: z
    .string()
    .trim()
    .min(2, "Department is required")
    .regex(/^[A-Za-z\s.]+$/, "Only alphabets are allowed")
    .max(120),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email")
    .max(255),

  students: z.string().optional(),

  courses: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .min(1, "Select at least one course"),

  experties: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .optional(),
  about: z
    .string()
    /*  .superRefine((val, ctx) => {
    const text = stripHtml(val);
    if (text.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "About Us is required",
      });
    }
  }) */
    .optional()
    .or(z.literal("")),

  recognitions: z
    .string()
    /* .max(500, "Recognitions cannot exceed 500 characters") */
    .optional()
    .or(z.literal("")),
});

const Faculty = () => {
  const { toast } = useToast();

  const [facultyList, setFacultyList] = useState([]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState("");
  const [phone, setPhone] = useState("");
  const [officeHours, setOfficeHours] = useState("");
  const [address, setAddress] = useState("");

  const [courses, setCourses] = useState([]);
  const [courseSelected, setCourseSelected] = useState([]);

  const [expertiesOptions, setExpertiesOptions] = useState([]);

  const [expertieSelected, setExpertieSelected] = useState([]);

  const [about, setAbout] = useState("");
  const [recognitions, setRecognitions] = useState("");

  const [errors, setErrors] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);

  const clearFieldError = (field: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const [content, setContent] = useState<any>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name,
      role,
      dept,
      email,
      students,
      courses: courseSelected,
      experties: expertieSelected,
      about,
      recognitions,
      phone,
      office_hours:officeHours,
      address
    };

    const result = facultySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors(fieldErrors);

      /*  toast({
        title: "Validation Error",
        description: "Please fix the form errors.",
        variant: "destructive",
      }); */

      return;
    }
    setErrors({});

    const courseOptions = courseSelected.map((item) => item.value);
    const expertieOptions = expertieSelected.map((item) => item.value);

    const sendData = {
      full_name: name,
      role: role,
      department: dept,
      phone_number: phone,
      email: email,
      student_count: 0,
      course_count: 0,
      about: about,
      area_of_experties: expertieOptions,
      courses_name: courseOptions,
      recognitions,
      office_hours:officeHours,
      address
    };
    try {
      const res = await api.post("/api/instituteprofile/add_faculty", sendData);
      if (res) {
        toast({
          title: "Faculty added",
          description: `${name} has been added.`,
        });
        fetchFacultyList();
      }

      setOpen(false);

      setName("");
      setRole("");
      setDept("");
      setEmail("");
      setStudents("");
      setCourseSelected([]);
      setExpertieSelected([]);
      setAbout("");
      setRecognitions("");
      setPhone("");
    } catch (err) {
        if (err.response) {
      console.log(err.response.data.message);
       toast({
        title: "Error",
        description: `${err.response.data.message || "Something went wrong"}`,
      });
     
    }
     
    }
  };

  const [edit, setEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleCreate = (inputValue) => {
    const newOption = {
      value: inputValue.toLowerCase(),
      label: inputValue,
    };

    setExpertiesOptions((prev) => [...prev, newOption]);

    setExpertieSelected((prev) => [...prev, newOption]);
  };

  const closeModalRH = () => {
    setEdit({});
    setIsModalOpen(false);
    //document.body.style.overflow = "auto";
  };

  const openModalEdit = (row) => {
    setEdit(row);
    setIsModalOpen(true);
    //document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const fetchCourseList = async () => {
    try {
      const res = await api.get("/api/institute-course/course");
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

  const fetchFacultyList = async () => {
    try {
      const res = await api.get("/api/instituteprofile/get_faculty");
      const data = res?.data?.data || [];
      setFacultyList(data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchCourseList();
  }, []);
  useEffect(() => {
    fetchFacultyList();
  }, [refresh]);

  const totalPages = Math.ceil(facultyList.length / ITEMS_PER_PAGE);

  // Current page data
  const paginatedFaculty = facultyList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const generatePagination = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Left dots
    if (currentPage > 3) {
      pages.push("...");
    }

    // Middle pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Right dots
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
    //return [...new Set(pages)];
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Manage"
        title="Faculty"
        description="Coordinators, evaluators and mentors driving the placement programme."
        actions={
          <Button
            className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Faculty
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard
          label="Total Faculty"
          value="48"
          delta={4}
          icon={Users}
          tint="primary"
        />

        <StatCard
          label="Courses Covered"
          value="62"
          delta={6}
          icon={BookOpen}
          tint="accent"
        />

        <StatCard
          label="Avg. Student Rating"
          value="4.6/5"
          delta={2}
          icon={Award}
          tint="success"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <List data={paginatedFaculty} openModalEdit={openModalEdit} />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          {totalPages > 0 && `Page ${currentPage} of ${totalPages}`}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Numbers */}
            {generatePagination().map((page, index) =>
              page === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="px-2 text-sm text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`${page}-${index}`}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-[36px] rounded-lg border px-3 text-sm transition ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl h-[90vh] p-0 overflow-hidden flex flex-col">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle className="font-display">Add Faculty</DialogTitle>

            <DialogDescription>
              Add a new coordinator, evaluator or mentor.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="f-name">Full name</Label>

                <Input
                  id="f-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError("name");
                  }}
                  placeholder="e.g. Dr. P. Kumar"
                />

                {errors?.name && (
                  <p className="text-sm text-red-500">{errors.name[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="f-role">Role</Label>

                  <Input
                    id="f-role"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      clearFieldError("role");
                    }}
                    placeholder="e.g. Faculty Coordinator"
                  />

                  {errors?.role && (
                    <p className="text-sm text-red-500">{errors.role[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="f-dept">Department</Label>

                  <Input
                    id="f-dept"
                    value={dept}
                    onChange={(e) => {
                      setDept(e.target.value);
                      clearFieldError("dept");
                    }}
                    placeholder="e.g. Engineering"
                  />

                  {errors?.dept && (
                    <p className="text-sm text-red-500">{errors.dept[0]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="f-email">Email</Label>

                <Input
                  id="f-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                  }}
                  placeholder="kumar@geisil.in"
                />

                {errors?.email && (
                  <p className="text-sm text-red-500">{errors.email[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="f-phone">Phone</Label>

                <Input
                  id="f-phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearFieldError("phone");
                  }}
                  placeholder="phone number"
                />

                {errors?.phone && (
                  <p className="text-sm text-red-500">{errors.phone[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="Course">Course</Label>

                <Select
                  options={courses}
                  isMulti
                  value={courseSelected}
                  onChange={(value) => {
                    setCourseSelected(value);
                    clearFieldError("courses");
                  }}
                />

                {errors?.courses && (
                  <p className="text-sm text-red-500">{errors.courses[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area_of_experties">Area of experties</Label>

                <CreatableSelect
                  isMulti
                  options={expertiesOptions}
                  value={expertieSelected}
                  onChange={(newValue) => {
                    setExpertieSelected(newValue);
                    clearFieldError("experties");
                  }}
                  onCreateOption={handleCreate}
                  placeholder="Search or add..."
                  formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                />

                {errors?.experties && (
                  <p className="text-sm text-red-500">{errors.experties[0]}</p>
                )}
              </div>

               <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="f-role">Office Hours</Label>

                  <Input
                    id="f-officeHours"
                    value={officeHours}
                    onChange={(e) => {
                      setOfficeHours(e.target.value);
                      clearFieldError("officeHours");
                    }}
                    placeholder="Office Hours"
                  />

                  {errors?.officeHours && (
                    <p className="text-sm text-red-500">{errors.officeHours[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="f-address">Address</Label>

                  <Input
                    id="f-address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      clearFieldError("address");
                    }}
                    placeholder="Address"
                  />

                  {errors?.address && (
                    <p className="text-sm text-red-500">{errors.dept[0]}</p>
                  )}
                </div>
               </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>

                {/*   <Textarea
            id="about"
            value={about}
            onChange={(e) => {
              setAbout(()=>e.target.value);
              clearFieldError("about");
            }}
            placeholder="Strengths, areas to improve, panel observations…"
            maxLength={500}
            rows={3}
          /> */}

                <ReactQuill value={about} onChange={setAbout} theme="snow" />

                {errors?.about && (
                  <p className="text-sm text-red-500">{errors.about[0]}</p>
                )}
              </div>

              <div className="space-y-2 pb-6">
                <Label htmlFor="recognitions">Recognitions</Label>

                {/*   <Textarea
            id="recognitions"
            value={recognitions}
            onChange={(e) => {
              setRecognitions(e.target.value);
              clearFieldError("recognitions");
            }}
            placeholder="Awards, achievements, recognitions..."
            maxLength={500}
            rows={3}
          /> */}

                <ReactQuill
                  value={recognitions}
                  onChange={setRecognitions}
                  theme="snow"
                />

                {errors?.recognitions && (
                  <p className="text-sm text-red-500">
                    {errors.recognitions[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Sticky Footer */}
            <DialogFooter className="sticky bottom-0 bg-background border-t px-6 py-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit">Add Faculty</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <FormModal
        show={isModalOpen}
        onClose={closeModalRH}
        data={edit}
        setRefresh={setRefresh}
      />
    </DashboardLayout>
  );
};
export default Faculty;
