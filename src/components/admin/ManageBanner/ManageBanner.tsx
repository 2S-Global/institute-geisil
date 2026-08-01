import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isAxiosError } from "axios";
import {
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import API from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

type Banner = {
  _id: string;
  banner_title: string;
  banner_image?: string;
};

const PAGE_SIZE = 10;

const imageUrl = (image?: string) => {
  if (!image || image.startsWith("data:") || /^https?:\/\//i.test(image)) {
    return image || "";
  }

  return new URL(image, import.meta.env.VITE_API_URL).toString();
};

const getErrorMessage = (error: unknown) =>
  isAxiosError(error) && typeof error.response?.data?.message === "string"
    ? error.response.data.message
    : "Please try again.";

export default function ManageBanner() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<{ title?: string; image?: string }>({});

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/home/all-banner");
      const data = response.data?.data ?? response.data;
      setBanners(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Unable to load banners",
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [file]);

  const filteredBanners = useMemo(
    () =>
      banners.filter((banner) =>
        banner.banner_title.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [banners, search],
  );

  const totalPages = Math.max(1, Math.ceil(filteredBanners.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedBanners = filteredBanners.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  );

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.min(Math.max(currentPage - 2, 1), totalPages - 4);
    return Array.from({ length: 5 }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setImagePreview("");
    setErrors({});
  };

  const openAddDialog = () => {
    setEditingBanner(null);
    resetForm();
    setIsFormOpen(true);
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.banner_title);
    setFile(null);
    setImagePreview(imageUrl(banner.banner_image));
    setErrors({});
    setIsFormOpen(true);
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
    const nextErrors: { title?: string; image?: string } = {};
    if (!title.trim()) nextErrors.title = "Banner title is required.";
    if (!editingBanner && !file) nextErrors.image = "Banner image is required.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const formData = new FormData();
    formData.append("banner_title", title.trim());
    if (file) formData.append("image", file);
    if (editingBanner) formData.append("id", editingBanner._id);

    try {
      setSubmitting(true);
      await API.post(
        editingBanner ? "/api/home/update-banner" : "/api/home/add-banner",
        formData,
      );
      toast({
        title: editingBanner ? "Banner updated" : "Banner added",
        description: "The banner has been saved successfully.",
      });
      setIsFormOpen(false);
      resetForm();
      await fetchBanners();
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Unable to save banner",
        description: getErrorMessage(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBanner) return;

    try {
      setSubmitting(true);
      await API.post("/api/home/delete-banner", { id: deletingBanner._id });
      toast({
        title: "Banner deleted",
        description: "The banner has been removed.",
      });
      setIsDeleteOpen(false);
      setDeletingBanner(null);
      await fetchBanners();
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Unable to delete banner",
        description: getErrorMessage(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        // eyebrow="CMS"
        title="Manage Banners"
        description="Add and maintain the banners displayed on the website."
        actions={
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" /> Add banner
          </Button>
        }
      />

      <Card className="mt-6 overflow-hidden border-border/60">
        {/* <div className="flex flex-col gap-3 border-b bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5"> */}
        {/* <p className="text-sm text-muted-foreground">
            {loading ? "Loading banners..." : `${filteredBanners.length} banner${filteredBanners.length === 1 ? "" : "s"} found`}
          </p> */}
        <div className="flex justify-end border-b bg-muted/20 p-4 md:p-5">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search banners by title"
              className="h-10 pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-[420px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading banners...
              </p>
            </div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-16 text-center">SL</TableHead>
                  <TableHead className="text-center">Banner Title</TableHead>
                  <TableHead className="text-center">Image</TableHead>
                  <TableHead className="w-32 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedBanners.length ? (
                  paginatedBanners.map((banner, index) => (
                    <TableRow key={banner._id} className="hover:bg-muted/30">
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {pageStart + index + 1}
                      </TableCell>

                      <TableCell className="text-center font-medium text-foreground">
                        {banner.banner_title}
                      </TableCell>

                      <TableCell className="text-center">
                        {banner.banner_image ? (
                          <img
                            src={imageUrl(banner.banner_image)}
                            alt={banner.banner_title}
                            className="mx-auto h-14 w-28 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="mx-auto flex h-14 w-28 items-center justify-center rounded-md border bg-muted">
                            <ImagePlus className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(banner)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                              setDeletingBanner(banner);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No banners found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {filteredBanners.length > 0 && (
              <div className="flex flex-col gap-3 border-t px-4 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between md:px-5">
                {/* Your existing pagination code */}
              </div>
            )}
          </>
        )}

        {!loading && filteredBanners.length > 0 && (
          <div className="flex flex-col gap-3 border-t px-4 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between md:px-5">
            <p className="text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {pageStart + 1}-
                {Math.min(pageStart + PAGE_SIZE, filteredBanners.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredBanners.length}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="flex items-center gap-1 px-1">
                {pageNumbers.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) resetForm();
        }}
      >
        {/* <DialogContent className="sm:max-w-[560px]"> */}
        <DialogContent
          className="sm:max-w-[560px]"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit banner" : "Add banner"}
            </DialogTitle>
            <DialogDescription>
              Provide a title and image for this website banner.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="banner-title">
                Banner title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="banner-title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setErrors((current) => ({ ...current, title: undefined }));
                }}
                placeholder="Enter banner title"
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-image">
                Banner image{" "}
                {!editingBanner && <span className="text-destructive">*</span>}
              </Label>
              <label
                htmlFor="banner-image"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <Upload className="h-4 w-4" />{" "}
                {file
                  ? file.name
                  : editingBanner
                    ? "Replace image (optional)"
                    : "Choose an image"}
              </label>
              <Input
                id="banner-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
              {errors.image && (
                <p className="text-xs text-destructive">{errors.image}</p>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Banner preview"
                  className="h-40 w-full rounded-md border object-cover"
                />
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingBanner ? "Update banner" : "Save banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove “{deletingBanner?.banner_title}”.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting && (
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
