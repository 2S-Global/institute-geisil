import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
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
//import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const FormModal = ({ show, onClose, data = {}, setRefresh }) => {
  const apiurl =  import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    course_name: "",
    duration: "",
    semester: "",
    id: "",
    exam_type: "year", // NEW
    marks_type: "", // NEW
  });

  const [courseList, setCourseList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [err, setErr] = useState({});
  const { toast } = useToast();
useEffect(() => {
  if (data?._id) {
    const duration = data.course_durartion || "";
    const examType = data.courseStructure || "year";

    let calculatedSemester = "";

    if (duration) {
      if (examType === "year") {
        calculatedSemester = Number(duration);
      } else if (examType === "semester") {
        calculatedSemester = Number(duration) * 2;
      }
    }

    setFormData({
      course_name: data.name || "",
      duration: duration,
      semester: calculatedSemester, // ✅ FIXED
      exam_type: examType, // ✅ IMPORTANT
      marks_type: data.marksType || "", // ✅ IMPORTANT
      id: data._id || "",
    });
  }
  else{
    setFormData({
    course_name: "",
    duration: "",
    semester: "",
    id: "",
    exam_type: "year", // NEW
    marks_type: "", // NEW
  })
  }
  
}, [data]);

  // ✅ Validation
  const validate = () => {
    let newErrors = {};
    if (!formData.course_name) newErrors.course_name = "Course is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.semester) newErrors.semester = "Semester is required";
    if (!formData.exam_type) newErrors.exam_type = "Exam type is required";
    if (!formData.marks_type) newErrors.marks_type = "Marks type is required";
    return newErrors;
  };

  // ✅ Fetch courses (API)
  const fetchCourses = async (search) => {
    try {
      setCourseLoading(true);
      const res = await API.get(
        `/api/sql/dropdown/CourcesSearch?search=${search}`,
      );

      setCourseList(res.data?.data || []);
      setShowDropdown(true);
    } catch (err) {
      console.log(err);
    } finally {
      setCourseLoading(false);
    }
  };

  // ✅ Handle input change
const handleChange = (e) => {
  const { name, value } = e.target;

  setErr((prev) => ({ ...prev, [name]: "" }));

  let updatedForm = {
    ...formData,
    [name]: value,
  };

  // ✅ Always calculate (fix blank issue)
  const duration = name === "duration" ? value : formData.duration;
  const examType = name === "exam_type" ? value : formData.exam_type;

  if (duration && examType) {
    if (examType === "year") {
   updatedForm.semester = String(duration);
    } else if (examType === "semester") {
      updatedForm.semester = String(Number(duration) * 2);
    }
  } else {
    // ✅ IMPORTANT: reset when empty
    updatedForm.semester = "";
  }

  setFormData(updatedForm);

  // autocomplete (same)
  if (name === "course_name") {
    if (value.length > 0) {
      fetchCourses(value);
    } else {
      setShowDropdown(false);
      setCourseList([]);
    }
  }
};

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErr(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const sendformData = new FormData();

      // ✅ FIXED FIELD NAMES
      sendformData.append("name", formData.course_name);
      sendformData.append("course_durartion", formData.duration);
      sendformData.append("total_number_of_semesters", formData.semester);
      sendformData.append("courseStructure", formData.exam_type); // ✅ FIX
      sendformData.append("marksType", formData.marks_type); // ✅ FIX



      try {
        let response;

        // ✅ EDIT MODE
        if (data?._id) {
          sendformData.append("courseId", formData.id); // 🔥 FIXED

          response = await API.put(
            `/api/institutestudent/update-custom-course`,
            sendformData,
          );
        }
        // ✅ ADD MODE
        else {
          response = await API.post(
            `/api/institutestudent/add-custom-course `,
            sendformData,
          );
        }

        setSuccess(response.data.message);
         toast({
                title: "Success",
                description: response.data.message,
            });
        setRefresh((p)=>p+1);
        onClose();
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
            toast({
                title: "Error",
                description: "Something went wrong",
            });
      } finally {
        setLoading(false);
      }
    }
  };
  if (!show) return null;

  return (
   <Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="font-display text-2xl">
        {data?._id ? "Edit Course" : "Add Course"}
      </DialogTitle>

      <DialogDescription>
        Manage course details, exam structure, duration, and marks type.
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-5 pt-2">

      <div className="grid gap-4 md:grid-cols-2">
        {/* ✅ Course Name */}
        <div className="space-y-1.5 md:col-span-2 relative">
          <Label htmlFor="course_name">
            Course Name <span className="text-destructive">*</span>
          </Label>

          <Input
            id="course_name"
            type="text"
            name="course_name"
            value={formData.course_name}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Enter course name"
          />

          {showDropdown && (
            <ul
              className="absolute z-50 w-full rounded-md border bg-background shadow-md max-h-[200px] overflow-y-auto"
            >
              {courseLoading && (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  Loading...
                </li>
              )}

              {!courseLoading &&
                courseList.length === 0 &&
                formData.course_name && (
                  <li
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-muted text-primary"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        course_name: formData.course_name,
                      }));
                      setShowDropdown(false);
                    }}
                  >
                    Create new: "{formData.course_name}"
                  </li>
                )}

              {courseList.map((item, index) => (
                <li
                  key={index}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      course_name: item.name || item.course_name || "",
                    }));
                    setShowDropdown(false);
                  }}
                >
                  {item.name || item.course_name}
                </li>
              ))}
            </ul>
          )}

          {err?.course_name && (
            <p className="text-xs text-destructive">
              {err.course_name}
            </p>
          )}
        </div>

        {/* ✅ Exam Type */}
        <div className="space-y-1.5">
          <Label>
            Exam Type <span className="text-destructive">*</span>
          </Label>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="exam_type"
                value="year"
                checked={formData.exam_type === "year"}
                onChange={handleChange}
              />
              Yearly
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="exam_type"
                value="semester"
                checked={formData.exam_type === "semester"}
                onChange={handleChange}
              />
              Semester
            </label>
          </div>

          {err?.exam_type && (
            <p className="text-xs text-destructive">
              {err.exam_type}
            </p>
          )}
        </div>

        {/* ✅ Marks Type */}
        <div className="space-y-1.5">
          <Label>
            Marks Type <span className="text-destructive">*</span>
          </Label>

          <Select
            value={formData.marks_type}
            onValueChange={(value) =>
              handleChange({
                target: {
                  name: "marks_type",
                  value,
                },
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Marks Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="dgpa">DGPA</SelectItem>
              <SelectItem value="cgpa">CGPA</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>

          {err?.marks_type && (
            <p className="text-xs text-destructive">
              {err.marks_type}
            </p>
          )}
        </div>

        {/* ✅ Duration */}
        <div className="space-y-1.5">
          <Label>
            Duration (Years) <span className="text-destructive">*</span>
          </Label>

          <Select
            value={formData.duration}
            onValueChange={(value) =>
              handleChange({
                target: {
                  name: "duration",
                  value,
                },
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="1">1 Year</SelectItem>
              <SelectItem value="2">2 Years</SelectItem>
              <SelectItem value="3">3 Years</SelectItem>
              <SelectItem value="4">4 Years</SelectItem>
              <SelectItem value="5">5 Years</SelectItem>
              <SelectItem value="6">6 Years</SelectItem>
            </SelectContent>
          </Select>

          {err?.duration && (
            <p className="text-xs text-destructive">
              {err.duration}
            </p>
          )}
        </div>

        {/* ✅ Semester */}
        <div className="space-y-1.5">
          <Label>
            Total Semester <span className="text-destructive">*</span>
          </Label>

          <Input
            value={formData.semester}
            disabled
            placeholder="Total semesters"
          />
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
        >
          {loading
            ? "Saving..."
            : data?._id
            ? "Update"
            : "Save"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
   </Dialog>
  );
};

export default FormModal;
