import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";
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
     .regex(
      /^[A-Za-z\s.]+$/,
      "Only alphabets are allowed"
    )
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
    .regex(
      /^[A-Za-z\s.]+$/,
      "Only alphabets are allowed"
    )
    .max(120),

  dept: z
    .string()
    .trim()
    .min(2, "Department is required")
    .regex(
      /^[A-Za-z\s.]+$/,
      "Only alphabets are allowed"
    )
    .max(120),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email")
    .max(255),

  students: z.number().optional(),

  courses: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .min(1, "Select at least one course"),

  experties: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),

  about: z
    .string()
    .max(500, "About cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  recognitions: z
    .string()
    .max(500, "Recognitions cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

const FormModal = ({ show, onClose, data = {}, setRefresh }) => {
  const { toast } = useToast();

  console.log("data",data)
  
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

  const [expertiesOptions, setExpertiesOptions] =
    useState([]);

  const [expertieSelected, setExpertieSelected] =
    useState([]);

  const [about, setAbout] = useState("");
  const [recognitions, setRecognitions] =
    useState("");

  const [errors, setErrors] = useState<any>({});
 
  

  const clearFieldError = (field: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };


  

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
      const fieldErrors =
        result.error.flatten().fieldErrors;
         console.log('fieldErrors',fieldErrors)
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const courseOptions=courseSelected.map((item)=>item.value)
    const expertieOptions=expertieSelected.map((item)=>item.value)
    

    const sendData={
      full_name:name,
      role:role,
      department:dept,
      phone_number:phone,
      email:email,
      student_count:0,
      course_count:0,
      about:about,
      area_of_experties:expertieOptions,
      courses_name:courseOptions,
      recognitions,
      office_hours:officeHours,
      address,
      id:data._id
    }
 try {
  const res = await api.put(
        "/api/instituteprofile/update_faculty",
        sendData
      );
 
  if(res){
    onClose();
    setRefresh(p=>p+1)
    toast({
        title: "Faculty update",
        description: `${name} has been updated.`,
      });
      
  }

onClose()

    setName("");
    setRole("");
    setDept("");
    setEmail("");
    setStudents("");
    setCourseSelected([]);
    setExpertieSelected([]);
    setAbout("");
    setRecognitions("");
    setPhone("")

} catch (err) {
        if (err.response) {
      console.log(err.response.data.message);
       toast({
        title: "Error",
         variant: "destructive",
        description: `${err.response.data.message || "Something went wrong"}`,
      });
     
    }
     
    }



  };

  
     

  const handleCreate = (inputValue) => {
    const newOption = {
      value: inputValue.toLowerCase(),
      label: inputValue,
    };

    setExpertiesOptions((prev) => [
      ...prev,
      newOption,
    ]);

    setExpertieSelected((prev) => [
      ...prev,
      newOption,
    ]);
  };


  const fetchCourseList = async () => {
    try {
      const res = await api.get(
        "/api/institute-course/course"
      );
      const data = res?.data?.data || [];
      const options=data.map((item)=>({'value':item._id,'label':item.name}))
      setCourses(options);
     
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };



  useEffect(() => {
    fetchCourseList();
  }, []);


  useEffect(()=>{
      if(data?._id){
         setName(data?.full_name||"");
        setRole(data?.role||"");
        setDept(data?.department||"");
        setEmail(data?.email||"");
        setStudents(data?.student_count||0);
        setAbout(data?.about||"");
        setRecognitions(data?.recognitions||"");
        setPhone(data?.phone_number||"")
         
          const course=data?.courses_name?.map((id)=>{
            const row=courses.find((item)=>item.value===id);
            return({'value':row.value,'label':row.label})
          })
         setCourseSelected(()=>course||[])

           const experties=data?.area_of_experties?.map((item)=>{
            return({'value':item,'label':item})
          })
          setExpertieSelected(()=>experties || [])

      }
    

  },[data._id])

  if (!show) return null;

  return (
  <Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-2xl h-[90vh] p-0 overflow-hidden flex flex-col">
    {/* Header */}
    <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
      <DialogTitle className="font-display">
        Edit Faculty
      </DialogTitle>

      <DialogDescription>
        Edit coordinator, evaluator or mentor.
      </DialogDescription>
    </DialogHeader>

    {/* Scrollable Form */}
    <form
      onSubmit={handleSubmit}
      className="flex-1 overflow-y-auto"
    >
      <div className="px-6 py-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="f-name">
            Full name
          </Label>

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
            <p className="text-sm text-red-500">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="f-role">
              Role
            </Label>

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
              <p className="text-sm text-red-500">
                {errors.role[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="f-dept">
              Department
            </Label>

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
              <p className="text-sm text-red-500">
                {errors.dept[0]}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="f-email">
            Email
          </Label>

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
            <p className="text-sm text-red-500">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="f-phone">
            Phone
          </Label>

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
            <p className="text-sm text-red-500">
              {errors.phone[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="Course">
            Course
          </Label>

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
            <p className="text-sm text-red-500">
              {errors.courses[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="area_of_experties">
            Area of experties
          </Label>

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
            formatCreateLabel={(inputValue) =>
              `Add "${inputValue}"`
            }
          />

          {errors?.experties && (
            <p className="text-sm text-red-500">
              {errors.experties[0]}
            </p>
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
          <Label htmlFor="about">
            About
          </Label>

        {/*   <Textarea
            id="about"
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
              clearFieldError("about");
            }}
            placeholder="Strengths, areas to improve, panel observations…"
            maxLength={500}
            rows={3}
          /> */}

           <ReactQuill value={about} onChange={setAbout} theme="snow" />

          {errors?.about && (
            <p className="text-sm text-red-500">
              {errors.about[0]}
            </p>
          )}
        </div>

        <div className="space-y-2 pb-6">
          <Label htmlFor="recognitions">
            Recognitions
          </Label>

          {/* <Textarea
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
          onClick={() => onClose()}
        >
          Cancel
        </Button>

        <Button type="submit">
          Update Faculty
        </Button>
      </DialogFooter>
    </form>
    
  </DialogContent>
</Dialog>
  );
};

export default FormModal;
