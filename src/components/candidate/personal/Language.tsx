import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
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
import Disability from "./Disability";
import CareerBreak from "./CareerBreak";
const Language = ({ formData, setFormData }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  //list

  const [languages, setLanguages] = useState([]);

  const [languageOptions, setLanguageOptions] = useState([]);
  const [languageproficiencyOptions, setLanguageproficiencyOptions] = useState(
    []
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (Array.isArray(formData?.languages)) {
      setLanguages(formData.languages);
    }
  }, [formData?.languages]);
  useEffect(() => {
    if (Array.isArray(formData?.languages) && formData?.languages?.length > 0) {
      setFormData((prevData) => ({ ...prevData, languages }));
    }
  }, [languages]);

  useEffect(() => {
    const fetchLanguageOptions = async () => {
      //setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/language`);
        const data = await response.json();
        setLanguageOptions(data.data);
      } catch (error) {
        console.error("Error fetching language options:", error);
      } finally {
        setLoading(false);
      }
    };
    /* /api/sql/dropdown/language_proficiency */
    const fetchLanguageproficiencyOptions = async () => {
      //setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/sql/dropdown/language_proficiency`
        );
        const data = await response.json();
        setLanguageproficiencyOptions(data.data);
      } catch (error) {
        console.error("Error fetching language proficiency options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguageOptions();
    fetchLanguageproficiencyOptions();
  }, [apiurl]);

  const addLanguage = () => {
    setLanguages([
      ...languages,
      {
        language: "",
        proficiency: "",
        read: false,
        write: false,
        speak: false,
      },
    ]);
  };

  const deleteLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
  };

  const handleChange = (index, field, value) => {
    const proficiency = languageproficiencyOptions.find(
      (item) => item.id === value
    );
    //console.log("Proficiency:", proficiency);

    const updatedLanguages = [...languages];
    updatedLanguages[index][field] = value;

    if (field === "proficiency") {
      updatedLanguages[index]["read"] = proficiency.read;
      updatedLanguages[index]["write"] = proficiency.write;
      updatedLanguages[index]["speak"] = proficiency.speak;
    }

    setLanguages(updatedLanguages);
    if (Array.isArray(formData?.languages) && formData?.languages?.length === 0) {
      setFormData((prevData) => ({ ...prevData, languages: updatedLanguages }));
    }

  };

  const handleCheckboxChange = (index, field) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index][field] = !updatedLanguages[index][field];
    setLanguages(updatedLanguages);
  };

  return (
    <div>
      <div className="flex justify-between items-center my-2">
        <label className="block text-xl font-semibold text-gray-900">
          Language Proficiency
        </label>
        <Button
          type="button"
          onClick={addLanguage}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add language
        </Button>
      </div>

      <p
        className="mt-1 text-sm text-gray-500"
        onClick={() => {
          console.log("Language :", languages);
        }}
      >
        Strengthen your resume by letting recruiters know you can communicate in
        multiple languages
      </p>

      {languages.map((lang, index) => (
        <div
          key={index}
          className="relative mb-5 border-b border-gray-200 pt-6 pb-4"
        >
          <Trash2
            size={18}
            className="absolute top-0 right-0 cursor-pointer text-red-500 hover:text-red-600"
            onClick={() => deleteLanguage(index)}
          />

          {/* Language & Proficiency */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Language <span className="text-red-500">*</span>
              </label>

              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={lang.language}
                onChange={(e) =>
                  handleChange(index, "language", e.target.value)
                }
              >
                <option value="">Select language</option>
                {languageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Proficiency <span className="text-red-500">*</span>
              </label>

              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={lang.proficiency}
                onChange={(e) =>
                  handleChange(index, "proficiency", e.target.value)
                }
              >
                <option value="">Select proficiency</option>
                {languageproficiencyOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Read / Write / Speak */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lang.read}
                onChange={() => handleCheckboxChange(index, "read")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Read
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lang.write}
                onChange={() => handleCheckboxChange(index, "write")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Write
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lang.speak}
                onChange={() => handleCheckboxChange(index, "speak")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Speak
            </label>
          </div>
        </div>
      ))}


    </div>
  );
};

export default Language;
