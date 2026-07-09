
import React, { useState, useEffect } from "react";
import API from "../../../lib/axios";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Explicit months mapping
const monthList = [
  { value: "1", name: "January" },
  { value: "2", name: "February" },
  { value: "3", name: "March" },
  { value: "4", name: "April" },
  { value: "5", name: "May" },
  { value: "6", name: "June" },
  { value: "7", name: "July" },
  { value: "8", name: "August" },
  { value: "9", name: "September" },
  { value: "10", name: "October" },
  { value: "11", name: "November" },
  { value: "12", name: "December" },
];

const currentYear = new Date().getFullYear();

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", { script: "super" }, { script: "sub" }, { list: "ordered" }, { list: "bullet" }, "link", "clean"],
  ],
};

const WhitePaperModal = ({ open, onOpenChange, item, fetchWhitePaperData }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
console.log("vhgvghjbhkhj",fetchWhitePaperData)
  const formatInitialValue = (val) => {
    if (val === undefined || val === null || val === "") return "";
    return String(val); // Safely forces 8 -> "8" to map to select options
  };

  // Helper to extract nested or flat date objects safely
  const getInitialDates = (targetItem) => {
    const y = targetItem?.publishYear || targetItem?.publishedOn?.year;
    const m = targetItem?.publishMonth || targetItem?.publishedOn?.month;
    return {
      year: formatInitialValue(y),
      month: formatInitialValue(m),
    };
  };

  const initialDates = getInitialDates(item);

  const [formData, setFormData] = useState({
    _id: item?._id || "",
    title: item?.title || "",
    url: item?.url || "",
    publishYear: initialDates.year,
    publishMonth: fetchWhitePaperData?.publishedOn?.month_id,
    description: item?.description || "",
  });

  console.log("formData value:",formData)

  useEffect(() => {
    if (item) {
      const dates = getInitialDates(item);
      setFormData({
        _id: item._id || "",
        title: item.title || "",
        url: item.url || "",
        publishYear: dates.year,
        publishMonth: dates.month,
        description: item.description || "",
      });
    }
  }, [item]);

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleHelpMeWrite = async () => {
    if (!formData.title) {
      toast({ title: "Missing title", description: "Please enter a title first.", variant: "destructive" });
      return;
    }
    setAiLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const generatedText = `<p>This research publication titled "<strong>${formData.title}</strong>" explores key insights, methodologies, and outcomes in its domain.</p>`;
      setFormData((p) => ({ ...p, description: generatedText }));
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.url) {
      toast({ title: "Validation error", description: "Title and URL are required.", variant: "destructive" });
      return;
    }
    if (!validateURL(formData.url)) {
      toast({ title: "Invalid URL", description: "Please enter a valid URL.", variant: "destructive" });
      return;
    }

    const payload = {
      _id: formData._id || "",
      title: formData.title,
      url: formData.url,
      publishYear: formData.publishYear ? Number(formData.publishYear) : null,
      publishMonth: formData.publishMonth ? Number(formData.publishMonth) : null,
      description: formData.description,
    };

    setLoading(true);
    try {
      if (formData._id) {
        await API.put("/api/candidate/accomplishments/update_research_publication", payload);
        toast({ title: "Updated", description: "Publication updated successfully." });
      } else {
        await API.post("/api/candidate/accomplishments/add_research_publication", payload);
        toast({ title: "Saved", description: "Publication added successfully." });
      }
      fetchWhitePaperData();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await API.delete("/api/candidate/accomplishments/delete_research_publication", { data: { _id: formData._id } });
      toast({ title: "Deleted", description: "Publication removed successfully." });
      fetchWhitePaperData();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };
 {console.log("formData.publishMonth",fetchWhitePaperData?.publishedOn?.month_id)}
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between mb-5 pr-6">
          <DialogHeader className="text-left">
            <DialogTitle>White paper / Research publication / Journal entry</DialogTitle>
            <DialogDescription>Add links to your online publications</DialogDescription>
          </DialogHeader>

          {formData._id && (
            <Button type="button" variant="ghost" size="icon" onClick={handleDelete} className="text-red-500">
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div>
            <Label>URL *</Label>
            <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Published on</Label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* YEAR SELECT INCLUDING FUTURE ENTRIES */}
              <select
                value={formData.publishYear}
                onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-black"
              >
                <option value="">Year</option>
                {/* Changed index offset logic to allow years up to 5 years into the future */}
                {Array.from({ length: 35 }, (_, i) => {
                  const year = (currentYear + 5) - i;
                  return <option key={year} value={String(year)}>{year}</option>;
                })}
              </select>
                 
              {/* MONTH SELECT */}
              <select
                
                onChange={(e) => setFormData({ ...formData, publishMonth: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-black"
              >
                <option value="">Month</option>
                {monthList.map((m) => (
                  <option key={m.value} value={m.value} selected={fetchWhitePaperData?.publishedOn?.month_id==m.value}>{m.name}</option>
                ))}
              </select>

            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <div className="bg-white rounded-md border text-black">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                modules={quillModules}
                placeholder="Write your description here..."
                className="prose max-w-none [&>.ql-toolbar]:border-0 [&>.ql-toolbar]:border-b [&>.ql-container]:border-0 [&>.ql-container]:min-h-[160px]"
              />
            </div>
          </div>

          <Button type="button" onClick={handleHelpMeWrite} disabled={aiLoading}>
            {aiLoading ? "Writing..." : "Help me write"}
          </Button>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : formData._id ? "Update" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhitePaperModal;

