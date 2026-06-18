import React, { useState, useEffect } from "react";
import axios from "axios";
//import React, { useState, useEffect, useRef } from "react";
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
/* import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg"; */
import EmployeeInfoCard from "./EmployeeInfoCard";
import PersonalInfoCard from "./PersonalDetailsCard";

import VerificationFormSection from "./VerificationFormSection";

const Modal = ({
  show,
  onClose,
  can_id,
  emp_id,
  setSuccess = () => {},
  setMessageId = () => {},
  setError = () => {},
  setErrorId = () => {},
  is_complete = false,
}) => {
  if (!show) return null;

  const apiurl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [error, setErrorthis] = useState(null);
  const [success, setSuccessthis] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [formdata, setFormData] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("Institute_token"));
    }
  }, []);

  const FetchDetails = async (can_id, emp_id) => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/institutestudent/get_student_details?userId=${can_id}&employmentId=${emp_id}`,
      );

      console.log('get_student_details',response)
      if (response.data.success) {
        const data = response.data.data;
        setUser({
          name: data.name || "",
          father_name: data.fatherName || "",
          email: data.email || "",
          mobile: data.phone_number || "",
          dob: data.dob || "",
          gender: data.gender || "",
          address: data.permanentAddress || "",
          pan: data.pan_number || "",
          level: data.level || "",
          levelname: data.levelname || "",
          course_type: data.courseType || "",
          courseTypename: data.courseTypename || "",
          course_id: data.courseName_id || "",
          courseName: data.courseName || "",
          course_name: data.courseName || "",
          duration: data.duration || "",
          durationstring: data.durationstring || "",
          grading_system: data.grading_system || "",
          gradingSystem: data.gradingSystem || "",
          marks: data.marks || "",
          is_verified: data.is_verified || false,
          level_verified: data.level_verified || false,
          duration_verified: data.duration_verified || false,
          gradingSystem_verified: data.gradingSystem_verified || false,
          marks_verified: data.marks_verified || false,
          courseName_verified: data.courseName_verified || false,
          courseType_verified: data.courseType_verified || false,
          remarks: data.remarks || "",
          _id: can_id,
          employmentId: emp_id,
        });
      }
      setSuccess(p=>p+1)
    } catch (error) {
      console.error("Error while fetching details:", error);
      setError(p=>p+1)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (can_id && emp_id ) FetchDetails(can_id, emp_id);
  }, [can_id, emp_id]);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  return (
    <Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
    
 {/*    <MessageComponent
      error={error}
      success={success}
      setError={setErrorthis}
      setSuccess={setSuccessthis}
    /> */}

    {/* Header */}
    <DialogHeader className="border-b px-6 py-4">
      <DialogTitle className="font-display text-2xl">
        Student Verification
      </DialogTitle>

      <DialogDescription>
        Review and verify student personal and employee details.
      </DialogDescription>
    </DialogHeader>

    {/* Body */}
    <div className="px-6 py-5 space-y-4">
      {loading ? (
        <p>loading .....</p>
      ) : (
        <>
          <PersonalInfoCard user={user} />

          <div>
            <EmployeeInfoCard user={user} />
          </div>

          

          {!is_complete ? (
            <VerificationFormSection
              formdata={formdata}
              setFormData={setFormData}
              onClose={onClose}
              is_complete={is_complete}
              loading={loading}
              setLoading={setLoading}
              setSuccess={setSuccess}
              setError={setError}
              setErrorId={setErrorId}
              setMessageId={setMessageId}
            />
          ) : (
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogFooter>
          )}
        </>
      )}
    </div>
  </DialogContent>
</Dialog>
  );
};

export default Modal;
