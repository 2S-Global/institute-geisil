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

const FormModal = ({  formData, setFormData, apiurl  }) => {
  //const apiurl =  import.meta.env.VITE_API_URL;
   const [disabilityOptions, setDisabilityOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [other_id, setOtherId] = useState(null);

  useEffect(() => {
    const fetchDisabilityOptions = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `${apiurl}/api/sql/dropdown/disability_type`
        );
        setDisabilityOptions(response.data.data);
        setOtherId(
          response.data.data.find((item) => item.name === "Others")?.id
        );
      } catch (error) {
        console.error("Error fetching disability options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisabilityOptions();
  }, [apiurl]);

  return (
<div>
  {loading ? (
   'loading............'
  ) : (
    <div className="space-y-4">
      {/* Disability Type */}
      <div>
        <label
          htmlFor="disabilityType"
          className="block text-sm font-semibold mb-2"
        >
          Disability Type <span className="text-red-500">*</span>
        </label>

        <select
          id="disabilityType"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={formData.disability_type || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              disability_type: e.target.value,
              disability_description: "", // Reset on change
            })
          }
        >
          <option value="">Select Disability Type</option>
          {disabilityOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* Disability Description */}
      {formData.disability_type == other_id && (
        <div>
          <label
            htmlFor="disabilityDescription"
            className="block text-sm font-semibold mb-2"
          >
            Disability Description{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            id="disabilityDescription"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={formData.disability_description || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                disability_description: e.target.value,
              })
            }
          />
        </div>
      )}

      {/* Workplace Assistance */}
      <div>
        <label
          htmlFor="workplaceAssistance"
          className="block text-sm font-semibold mb-2"
        >
          Do you need assistance at your workplace?
        </label>

        <textarea
          id="workplaceAssistance"
          rows={4}
          className="w-full min-h-[100px] resize rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={formData.workplace_assistance || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              workplace_assistance: e.target.value,
            })
          }
        />
      </div>
    </div>
  )}
</div>
  );
};

export default FormModal;
