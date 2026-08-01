import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { isAxiosError } from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImagePlus, Loader2, Pencil, Upload } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import API from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

type AboutDetails = {
  _id: string;
  title: string;
  description: string;
  image?: string;
};

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

const imageUrl = (image?: string) => {
  if (!image || image.startsWith("data:") || /^https?:\/\//i.test(image)) {
    return image || "";
  }

  return new URL(image, import.meta.env.VITE_API_URL).toString();
};

const hasText = (value: string) =>
  value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;

const getErrorMessage = (error: unknown) =>
  isAxiosError(error) && typeof error.response?.data?.message === "string"
    ? error.response.data.message
    : "Please try again.";

export default function AboutPage() {
  const { toast } = useToast();
  const [aboutDetails, setAboutDetails] = useState<AboutDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    image?: string;
  }>({});

  const fetchAboutDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/about/details");
      const data = response.data?.data;
      setAboutDetails(Array.isArray(data) ? data[0] || null : data || null);
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Unable to load About page",
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAboutDetails();
  }, [fetchAboutDetails]);

  useEffect(() => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [file]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setImagePreview("");
    setErrors({});
  };

  const openEditDialog = () => {
    if (!aboutDetails) return;

    setTitle(aboutDetails.title || "");
    setDescription(aboutDetails.description || "");
    setFile(null);
    setImagePreview(imageUrl(aboutDetails.image));
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        image: "Please choose an image file.",
      }));
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setErrors((current) => ({ ...current, image: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!aboutDetails) return;

    const nextErrors: { title?: string; description?: string } = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!hasText(description)) {
      nextErrors.description = "Description is required.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description);
    formData.append("id", aboutDetails._id);
    if (file) formData.append("image", file);

    try {
      setSubmitting(true);
      await API.post("/api/about/updateAbout", formData);
      toast({
        title: "About page updated",
        description: "Your changes have been saved successfully.",
      });
      setIsDialogOpen(false);
      resetForm();
      await fetchAboutDetails();
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Unable to update About page",
        description: getErrorMessage(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="About Page"
        description="Manage the content displayed on the website About page."
      />

      <Card className="mt-6 overflow-hidden border-border/60">
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading About page...</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-16 text-center">SL</TableHead>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="w-24 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aboutDetails ? (
                <TableRow className="hover:bg-muted/30">
                  <TableCell className="text-center text-sm text-muted-foreground">1</TableCell>
                  <TableCell className="text-center font-medium text-foreground">{aboutDetails.title}</TableCell>
                  <TableCell className="text-center">
                    {aboutDetails.image ? (
                      <img
                        src={imageUrl(aboutDetails.image)}
                        alt={aboutDetails.title}
                        className="mx-auto h-14 w-28 rounded-md border object-cover"
                      />
                    ) : (
                      <div className="mx-auto flex h-14 w-28 items-center justify-center rounded-md border bg-muted">
                        <ImagePlus className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={openEditDialog}
                        aria-label="Edit About page"
                        title="Edit About page"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    No About page details found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit About page</DialogTitle>
            <DialogDescription>Update the title, description, and image shown on the website.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="about-title">Title <span className="text-destructive">*</span></Label>
              <Input
                id="about-title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setErrors((current) => ({ ...current, title: undefined }));
                }}
                placeholder="Enter title"
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Description <span className="text-destructive">*</span></Label>
              <ReactQuill
                value={description}
                onChange={(value) => {
                  setDescription(value);
                  setErrors((current) => ({ ...current, description: undefined }));
                }}
                modules={quillModules}
                theme="snow"
                className="bg-background [&_.ql-container]:min-h-40 [&_.ql-editor]:min-h-40"
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="about-image">Image</Label>
              <label
                htmlFor="about-image"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <Upload className="h-4 w-4" /> {file ? file.name : "Replace image (optional)"}
              </label>
              <Input id="about-image" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
              {imagePreview && <img src={imagePreview} alt="About page preview" className="h-40 w-full rounded-md border object-cover" />}
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
