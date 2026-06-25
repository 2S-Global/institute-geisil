import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

const KycBox = ({ show, onClose, data = {}, setRefresh,formData, setFormData, focusSection }) => {
  const apiurl =  import.meta.env.VITE_API_URL;
  console.log("show",show)
   const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
//console.log("formData",formData)
  useEffect(() => {
    if (focusSection) {
      const element = document.getElementById(focusSection);

      if (element) {
        // Scroll into view
        element.scrollIntoView({ behavior: "smooth" });

        if (focusSection != "all") {
          // Add highlight class
          element.classList.add("highlight");
        }
        // Remove after 3s
        const timeout = setTimeout(() => {
          element.classList.remove("highlight");
        }, 3000);

        // Cleanup if effect re-runs
        return () => clearTimeout(timeout);
      }
    }
  }, [focusSection]);

  const today = new Date();
/*   const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  ); */
  //if (!show) return null;
const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  return (
<>
  {/* Header */}
  <div className="mb-6">
    <h2 className="font-display text-2xl font-semibold">
      Identity Documents
    </h2>

    <p className="text-sm text-muted-foreground mt-1">
      Update your PAN, Driving License, Passport, EPIC and Aadhaar details.
    </p>
  </div>

  {/* Messages */}
  {/* <MessageComponent
    error={error}
    success={success}
    errorId={errorId}
    message_id={message_id}
  /> */}

  {/* Loading */}
  {loading && (
    <div className="fixed inset-0 flex items-center justify-center bg-white/75 z-50">
      loading....
    </div>
  )}

  <div className="space-y-6">
    {/* PAN */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">PAN Number</label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.pan_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              pan_number: e.target.value,
            })
          }
          pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
          placeholder="Enter PAN Number"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Name as per PAN</label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.pan_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              pan_name: e.target.value,
            })
          }
          placeholder="Enter Name as per PAN"
        />
      </div>
    </div>

    {/* Driving License */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Driving License Number
        </label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.dl_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              dl_number: e.target.value,
            })
          }
          pattern="^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$"
          placeholder="Enter Driving License Number"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Name as per Driving License
        </label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.dl_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              dl_name: e.target.value,
            })
          }
          placeholder="Enter Name as per Driving License"
        />
      </div>

     <div className="space-y-1.5">
  <label className="text-sm font-medium">
    Date of Birth as per Driving License
  </label>

  <input
    type="date"
    className="w-full border rounded-md px-3 py-2 text-sm relative"
    value={formData.dl_dob? new Date(formData.dl_dob).toISOString().split("T")[0]: ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        dl_dob: e.target.value,
      })
    }
    max={eighteenYearsAgo.toISOString().split("T")[0]}
  />
</div>
    </div>

    {/* EPIC */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          EPIC (Voter) Number
        </label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.epic_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              epic_number: e.target.value,
            })
          }
          pattern="^[A-Z]{3}[0-9]{7}$"
          placeholder="Enter EPIC Number"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Name as per EPIC
        </label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.epic_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              epic_name: e.target.value,
            })
          }
          placeholder="Enter Name as per EPIC"
        />
      </div>
    </div>

    {/* Passport */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Passport File Number
        </label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.passport_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              passport_number: e.target.value,
            })
          }
          placeholder="Enter Passport File Number"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Name as per Passport
        </label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.passport_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              passport_name: e.target.value,
            })
          }
          placeholder="Enter Name as per Passport"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Date of Birth as per Passport
        </label>

       
        <input
    type="date"
    className="w-full border rounded-md px-3 py-2 text-sm relative"
     value={formData.passport_dob? new Date(formData.passport_dob).toISOString().split("T")[0]: ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        passport_dob: e.target.value,
      })
    }
    max={eighteenYearsAgo.toISOString().split("T")[0]}
  />
      </div>
    </div>

    {/* Aadhaar */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Aadhaar Number
        </label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.aadhar_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              aadhar_number: e.target.value,
            })
          }
          pattern="^\d{12}$"
          placeholder="Enter Aadhaar Number"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Name as per Aadhaar
        </label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={formData.aadhar_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              aadhar_name: e.target.value,
            })
          }
          placeholder="Enter Name as per Aadhaar"
        />
      </div>
    </div>

  </div>
</>
  );
};

export default KycBox;
