import React, { useEffect, useState, useRef } from "react";
import API from "../../../lib/axios";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  Wand2,
  Loader2,
} from "lucide-react";

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

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const WhitePaperModal = ({ open, onOpenChange, item, fetchWhitePaperData }) => {
  const textareaRef = useRef(null);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    url: "",
    publishYear: "",
    publishMonth: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          _id: item._id || "",
          title: item.title || "",
          url: item.url || "",
          publishYear:
            item.publishYear || item.publishedOn?.year
              ? String(item.publishYear || item.publishedOn?.year)
              : "",
          publishMonth:
            item.publishMonth || item.publishedOn?.month
              ? String(item.publishMonth || item.publishedOn?.month)
              : "",
          description: item.description || "",
        });
      } else {
        setFormData({
          _id: "",
          title: "",
          url: "",
          publishYear: "",
          publishMonth: "",
          description: "",
        });
      }
    }
  }, [item, open]);

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateMonthOptions = () => {
    const max =
      Number(formData.publishYear) === currentYear ? currentMonth : 12;
    return monthNames.slice(0, max);
  };

  const applyFormatting = (formatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.description || "";
    const selectedText = text.substring(start, end);

    let prefix = "";
    let suffix = "";

    switch (formatType) {
      case "bold":
        prefix = "**";
        suffix = "**";
        break;
      case "italic":
        prefix = "*";
        suffix = "*";
        break;
      case "underline":
        prefix = "<u>";
        suffix = "</u>";
        break;
      case "strikethrough":
        prefix = "~~";
        suffix = "~~";
        break;
      case "superscript":
        prefix = "<sup>";
        suffix = "</sup>";
        break;
      case "subscript":
        prefix = "<sub>";
        suffix = "</sub>";
        break;
      default:
        return;
    }

    const replacement = prefix + (selectedText || "text") + suffix;

    const updated =
      text.substring(0, start) + replacement + text.substring(end);

    setFormData((p) => ({ ...p, description: updated }));

    setTimeout(() => {
      textarea.focus();
      const offset = prefix.length;
      textarea.setSelectionRange(
        start + offset,
        start + offset + (selectedText ? selectedText.length : 4),
      );
    }, 0);
  };

  const handleHelpMeWrite = async () => {
    if (!formData.title) {
      toast({
        title: "Missing title",
        description: "Please enter a title first.",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));

      const generatedText = `This research publication titled "${formData.title}" explores key insights, methodologies, and outcomes in its domain.`;

      setFormData((p) => ({ ...p, description: generatedText }));
    } catch (err) {
      console.error(err);
      toast({
        title: "AI error",
        description: "Failed to generate description.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast({
        title: "Validation error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.url) {
      toast({
        title: "Validation error",
        description: "URL is required.",
        variant: "destructive",
      });
      return;
    }

    if (!validateURL(formData.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      _id: formData._id || "",
      title: formData.title,
      url: formData.url,
      publishYear: formData.publishYear || null,
      publishMonth: formData.publishMonth || null,
      description: formData.description,
    };

    setLoading(true);

    try {
      if (formData._id) {
        await API.put(
          "/api/candidate/accomplishments/update_research_publication",
          payload,
        );

        toast({
          title: "Updated",
          description: "Publication updated successfully.",
        });
      } else {
        await API.post(
          "/api/candidate/accomplishments/add_research_publication",
          payload,
        );

        toast({
          title: "Saved",
          description: "Publication added successfully.",
        });
      }

      fetchWhitePaperData();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to save publication.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Delete this record?");
    if (!ok) return;

    try {
      await API.delete(
        "/api/candidate/accomplishments/delete_research_publication",
        { data: { _id: formData._id } },
      );

      toast({
        title: "Deleted",
        description: "Publication removed successfully.",
      });

      fetchWhitePaperData();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete publication.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between mb-5 pr-6">
          <DialogHeader className="text-left">
            <DialogTitle>
              White paper / Research publication / Journal entry
            </DialogTitle>
            <DialogDescription>
              Add links to your online publications
            </DialogDescription>
          </DialogHeader>

          {formData._id && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <Label>URL *</Label>
            <Input
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Published on</Label>

            <div className="grid grid-cols-2 gap-3">
              <Select
                value={formData.publishYear}
                onValueChange={(v) =>
                  setFormData({ ...formData, publishYear: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>

                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => {
                    const year = currentYear - i;
                    return (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select
                value={formData.publishMonth}
                onValueChange={(v) =>
                  setFormData({ ...formData, publishMonth: v })
                }
                disabled={!formData.publishYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>

                <SelectContent>
                  {generateMonthOptions().map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea
            ref={textareaRef}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <Button
            type="button"
            onClick={handleHelpMeWrite}
            disabled={aiLoading}
          >
            {aiLoading ? "Writing..." : "Help me write"}
          </Button>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : formData._id ? "Update" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhitePaperModal;
