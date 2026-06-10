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
const getComparableDateValue = (year, month) => {
  if (!year || !month) return null;
  return parseInt(year) * 100 + parseInt(month); // e.g., 202405
};
const Modal = ({
  show,
  onClose,
  can_id,
  emp_id,
  is_complete = false,
  refreshList,
}) => {
  if (!show) return null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [wrongDate, setWrongDate] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [list_notice_period, setList_notice_period] = useState([]);
  const [token, setToken] = useState(null);

  //const apiurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

  const [user, setUser] = useState({
    name: "",
    father_name: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    address: "",
    pan: "",
    designation: "",
    employmenttype: "",
    currentlyemployed: false,
    joiningdate: "",
    leavedate: "",
    joining_year: "",
    joining_month: "",
    leaving_year: "",
    leaving_month: "",
    Verified: false,
    designation_verified: false,
    duration_verified: false,
    employmenttype_verified: false,
    Serverd_notice_period: false,
    has_noc: false,
    has_due: false,
    remarks: "",
    workedHere: false,
    _id: can_id,
    employmentId: emp_id,
  });

  useEffect(() => {
    if (!can_id || !emp_id || !token) return;
    FetchDetails(can_id, emp_id);
    console.log(can_id, emp_id, token);
  }, [can_id, emp_id, token]);

  const FetchDetails = async (can_id, emp_id) => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/companyprofile/get_employee_details?userId=${can_id}&employmentId=${emp_id}`,
      );

      if (response.data.success) {
        const data = response.data.data;
        setUser({
          ...user,
          name: data.name || "",
          father_name: data.fatherName || "",
          email: data.email || "",
          mobile: data.phone_number || "",
          dob: data.dob || "",
          gender: data.gender || "",
          address: data.permanentAddress || "",
          pan: data.pan_number || "",
          designation: data.jobTitle || "",
          employmenttype: data.employmentType || "",
          currentlyemployed: data.currentEmployment || false,
          joiningdate: data.joiningDate || "",
          leavedate: data.leavingDate || "",
          joining_year: data.joiningYear || "",
          joining_month: data.joiningMonth || "",
          leaving_year: data.leavingYear || "",
          leaving_month: data.leavingMonth || "",
          Verified: data.isVerified || false,
          designation_verified: data.designationVerified || false,
          duration_verified: data.jobDurationVerified || false,
          employmenttype_verified: data.jobTypeVerified || false,
          Serverd_notice_period: data.servedNoticePeriod || false,
          has_noc: data.hasNOC || false,
          has_due: data.hasDues || false,
          remarks: data.remarks || "",
          workedHere: data.workedInCompany, // ✅ stays correct now
        });
      } else {
        console.error("Failed to fetch details:", response.data.message);
      }
    } catch (error) {
      console.error("Error while fetching account details:", error);
    } finally {
      setLoading(false);
    }
  };

  const [formdata, setFormData] = useState({
    ...user,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...user,
        remarks: prev.remarks,
        _id: can_id,
        employmentId: emp_id,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggle = (field) => () =>
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill all required fields");
      return;
    }

    if (wrongDate) {
      setError("End date cannot be before start date");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      ...formdata,
      worked_in_company: formdata.workedHere,
    };

    console.log(payload);

    try {
      const response = await API.post(
        `/api/companyprofile/add_employee_verification_details`,
        payload,
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        await FetchDetails(can_id, emp_id); // modal refresh
        await refreshList(); // 🔥 parent refresh
        onClose();
      }
    } catch (error) {
      console.error("Error while submitting form:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formdata.joining_year || !formdata.joining_month) {
      return false;
    }

    // ✅ If NOT currently employed → leaving required
    if (!formdata.currentlyemployed) {
      if (!formdata.leaving_year || !formdata.leaving_month) {
        return false;
      }

      // ✅ Check date order
      const start = getComparableDateValue(
        formdata.joining_year,
        formdata.joining_month,
      );

      const end = getComparableDateValue(
        formdata.leaving_year,
        formdata.leaving_month,
      );

      if (start > end) {
        return false;
      }
    }

    return true;
  };
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formdata]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const generateMonthOptions = (selectedYear) => {
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;
    return monthNames.slice(0, maxMonth).map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
  };

  useEffect(() => {
    if (formdata.currentlyemployed) {
      setError("");
      setWrongDate(false);
    } else {
      const startValue = getComparableDateValue(
        formdata.joining_year,
        formdata.joining_month,
      );
      const endValue = getComparableDateValue(
        formdata.leaving_year,
        formdata.leaving_month,
      );

      if (startValue && endValue) {
        if (startValue > endValue) {
          setError("End date cannot be before start date.");
          setWrongDate(true);
        } else {
          setError("");
          setWrongDate(false);
        }
      }
    }
  }, [
    formdata.joining_year,
    formdata.joining_month,
    formdata.leaving_year,
    formdata.leaving_month,
    formdata.currentlyemployed,
  ]);

  useEffect(() => {
    if (formdata.currentlyemployed) {
      setError("");
    }
  }, [formdata.currentlyemployed]);

  const fetchNoticePeriod = async () => {
    try {
      const response = await API.get(
        `/api/candidate/employment/get_notice_period`,
      );
      if (response.data.success) {
        setList_notice_period(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notice period:", error);
    }
  };

  useEffect(() => {
    fetchNoticePeriod();
  }, []);
  useEffect(() => {
    if (formdata.Verified) {
      setFormData((prev) => ({
        ...prev,
        designation_verified: true,
        employmenttype_verified: true,
        duration_verified: true,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        designation_verified: false,
        employmenttype_verified: false,
        duration_verified: false,
      }));
    }
  }, [formdata.Verified]);
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
        {/* <MessageComponent
      error={error}
      success={success}
      setError={setError}
      setSuccess={setSuccess}
    /> */}

        {/* Header */}
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="font-display text-2xl">
            Employee Verification
          </DialogTitle>

          <DialogDescription>
            Review and verify employee details.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5">
          {loading ? (
            "loading...."
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Summary Card */}
              <PersonalInfoCard user={user} />

              <div>
                <EmployeeInfoCard user={user} />
              </div>

              {!is_complete && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Did this person work here?
                  </label>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="workedHere"
                        checked={formdata.workedHere === true}
                        onChange={() =>
                          setFormData({ ...formdata, workedHere: true })
                        }
                      />
                      <label>Yes</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="workedHere"
                        checked={formdata.workedHere === false}
                        onChange={() =>
                          setFormData({ ...formdata, workedHere: false })
                        }
                      />
                      <label>No</label>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* KEEP EVERYTHING BELOW EXACTLY AS IT IS */}
              {/* ========================================= */}

              {formdata.workedHere && !is_complete && (
                <div className="space-y-6">
                  {/* VERIFIED SWITCHES */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formdata.Verified}
                          onChange={handleToggle("Verified")}
                        />

                        {/* Track */}
                        <div className="w-11 h-4 bg-gray-300 rounded-full peer peer-checked:bg-[#1a5a65] transition-colors duration-300"></div>

                        {/* Thumb */}
                        <div className="absolute left-1 top-1 w-4 h-3 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>

                        <span className="ml-3 text-sm font-medium">
                          All Details Verified
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          className="sr-only peer"
                          type="checkbox"
                          checked={formdata.employmenttype_verified}
                          onChange={handleToggle("employmenttype_verified")}
                        />

                        {/* Track */}
                        <div className="w-11 h-4 bg-gray-300 rounded-full peer peer-checked:bg-[#1a5a65] transition-colors duration-300"></div>

                        {/* Thumb */}
                        <div className="absolute left-1 top-1 w-4 h-3 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>

                        <span className="ml-3 text-sm font-medium">
                          Employment Type Verified
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* GRID SECTION */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* EMPLOYMENT TYPE */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">
                        <b>Employment Type</b>
                      </label>

                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            className="h-4 w-4"
                            type="radio"
                            name="employmenttype"
                            value="full-time"
                            checked={formdata.employmenttype === "full-time"}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                employmenttype: e.target.value,
                              })
                            }
                          />
                          Full Time
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            className="h-4 w-4"
                            type="radio"
                            name="employmenttype"
                            value="part-time"
                            checked={formdata.employmenttype === "part-time"}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                employmenttype: e.target.value,
                              })
                            }
                          />
                          Part Time
                        </label>
                      </div>
                    </div>

                    {/* CURRENTLY EMPLOYED */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">
                        <b>Is this person currently employed?</b>
                      </label>

                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            className="h-4 w-4"
                            type="radio"
                            name="currentlyemployed"
                            value="true"
                            checked={formdata.currentlyemployed === true}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                currentlyemployed: e.target.value === "true",
                              })
                            }
                          />
                          Yes
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            className="h-4 w-4"
                            type="radio"
                            name="currentlyemployed"
                            value="false"
                            checked={formdata.currentlyemployed === false}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                currentlyemployed: e.target.value === "true",
                              })
                            }
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {/* DESIGNATION */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                       

 <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                           id="designationSwitch"
                           checked={formdata.designation_verified}
                          onChange={handleToggle("designation_verified")}
                        />

                        {/* Track */}
                        <div className="w-11 h-4 bg-gray-300 rounded-full peer peer-checked:bg-[#1a5a65] transition-colors duration-300"></div>

                        {/* Thumb */}
                        <div className="absolute left-1 top-1 w-4 h-3 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>

                        <span className="ml-3 text-sm font-medium">
                         Designation Verified
                        </span>
                      </label>



                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          <b>Designation</b>
                        </label>

                        <input
                          name="designation"
                          type="text"
                          className="w-full rounded-md border px-3 py-2"
                          value={formdata.designation}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* JOINING DATE */}
                    <div className="space-y-3 md:col-span-2">
                      {/* DURATION VERIFIED */}
                      <div className="flex items-center gap-2 pb-2">
                      

                         <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          className="sr-only peer"
                          type="checkbox"
                          id="durationSwitch"
                          checked={formdata.duration_verified}
                          onChange={handleToggle("duration_verified")}
                        />

                        {/* Track */}
                        <div className="w-11 h-4 bg-gray-300 rounded-full peer peer-checked:bg-[#1a5a65] transition-colors duration-300"></div>

                        {/* Thumb */}
                        <div className="absolute left-1 top-1 w-4 h-3 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>

                        <span className="ml-3 text-sm font-medium">
                          Duration Verified
                        </span>
                      </label>
                      </div>

                      <label className="text-sm font-medium">
                        Joining Date <span className="text-red-500">*</span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select
                          className="w-full rounded-md border px-3 py-2"
                          value={formdata.joining_year || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formdata,
                              joining_year: e.target.value,
                              joining_month: "",
                            })
                          }
                        >
                          <option value="">Select Year</option>
                          {Array.from({ length: 30 }, (_, i) => {
                            const year = currentYear - i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>

                        <select
                          className="w-full rounded-md border px-3 py-2"
                          value={formdata.joining_month || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formdata,
                              joining_month: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Month</option>
                          {generateMonthOptions(
                            parseInt(formdata.joining_year || currentYear),
                          )}
                        </select>
                      </div>
                    </div>

                    {/* LEAVING DATE */}
                    {!formdata.currentlyemployed && (
                      <div className="space-y-3 md:col-span-2">
                        <label className="text-sm font-medium">
                          Leaving Date <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <select
                            className="w-full rounded-md border px-3 py-2"
                            value={formdata.leaving_year || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                leaving_year: e.target.value,
                                leaving_month: "",
                              })
                            }
                          >
                            <option value="">Select Year</option>
                            {Array.from({ length: 30 }, (_, i) => {
                              const year = currentYear - i;
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>

                          <select
                            className="w-full rounded-md border px-3 py-2"
                            value={formdata.leaving_month || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formdata,
                                leaving_month: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Month</option>
                            {generateMonthOptions(
                              parseInt(formdata.leaving_year || currentYear),
                            )}
                          </select>
                        </div>

                        {error && (
                          <div className="text-red-500 text-sm">{error}</div>
                        )}
                      </div>
                    )}

                    {/* CHECKBOXES */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          className="h-4 w-4"
                          type="checkbox"
                          name="Serverd_notice_period"
                          checked={formdata.Serverd_notice_period}
                          onChange={handleChange}
                        />
                        Served Notice Period
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          className="h-4 w-4"
                          type="checkbox"
                          name="has_noc"
                          checked={formdata.has_noc}
                          onChange={handleChange}
                        />
                        Has NOC
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          className="h-4 w-4"
                          type="checkbox"
                          name="has_due"
                          checked={formdata.has_due}
                          onChange={handleChange}
                        />
                        Has Dues
                      </label>
                    </div>

                    {/* REMARKS */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium">
                        <b>Remarks</b>
                      </label>

                      <textarea
                        className="w-full rounded-md border px-3 py-2 min-h-[120px] max-h-[150px]"
                        name="remarks"
                        value={formdata.remarks}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="mt-2"
                >
                  Cancel
                </Button>

                {!is_complete && <Button type="submit">Save</Button>}
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
