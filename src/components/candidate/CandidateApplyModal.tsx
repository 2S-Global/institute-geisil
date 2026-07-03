import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useApplyJob } from "@/pages/candidate/hooks/useApplyJob";
import { ApplyFormValues, applySchema } from "./resumeHeadline/validation/applyFormValidation";



interface CandidateApplyModalProps {
  open: boolean;
  onClose: () => void;
  job: any;
  onSuccess: (jobId: string) => void;
}

export default function CandidateApplyModal({
  open,
  onClose,
  job,
  onSuccess,
}: CandidateApplyModalProps) {
  console.log("is that working==>", job)
  const { applyJob, loading, error } = useApplyJob();
  // console.log("Check data ==>", data)

  //React-form-hook with validation
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      noticePeriod: "",
      preferredTime: "",
      availabilityOnSaturday: "",
      willingToRelocate: "",
      description: "",
      acceptedTerms: false,
      experienceLevel: "",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      reset({
        noticePeriod: "",
        preferredTime: "",
        availabilityOnSaturday: "",
        willingToRelocate: "",
        description: "",
        acceptedTerms: false,
        experienceLevel: "",
      });
    }
  }, [open, reset]);

  const onSubmit = async (values: ApplyFormValues) => {
    if (!job) return;

    try {

      //payload for sending data for the API
      const applyData = {
        noticePeriod: values.noticePeriod,
        preferredTime: values.preferredTime,
        availabilityOnSaturday: values.availabilityOnSaturday,
        experienceLevel: Number(values.experienceLevel),
        willingToRelocate: values.willingToRelocate,
        description: values.description,
        acceptedTerms: values.acceptedTerms,
      };

      const result = await applyJob(job._id, applyData);
      console.log("Result", result)
      if (result?.success || result) {
        toast.success("Job applied successfully 🎉");
        onSuccess(job._id);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to apply");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job?.jobTitle}</DialogTitle>
          <DialogDescription>
            Your profile and resume will be shared with {job?.companyName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Experience Level */}
            <div className="space-y-1">
              <Label htmlFor="experienceLevel">Experience (Years)</Label>
              <Input
                id="experienceLevel"
                type="number"
                placeholder="Experience (Years)"
                {...register("experienceLevel")}
                min="0"
                max="40"
              />
              {errors.experienceLevel && (
                <p className="text-xs text-destructive">{errors.experienceLevel.message}</p>
              )}
            </div>

            {/* Notice Period */}
            <div className="space-y-1">
              <Label htmlFor="noticePeriod">Notice Period</Label>
              <select
                id="noticePeriod"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register("noticePeriod")}
              >
                <option value="">Notice Period</option>
                <option value="immediate">Immediate</option>
                <option value="15 days">15 Days</option>
                <option value="30 days">30 Days</option>
                <option value="45 days">45 Days</option>
                <option value="60 days">60 Days</option>
              </select>
              {errors.noticePeriod && (
                <p className="text-xs text-destructive">{errors.noticePeriod.message}</p>
              )}
            </div>

            {/* Preferred Time */}
            <div className="space-y-1">
              <Label htmlFor="preferredTime">Preferred Time</Label>
              <select
                id="preferredTime"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register("preferredTime")}
              >
                <option value="">Preferred Time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.preferredTime && (
                <p className="text-xs text-destructive">{errors.preferredTime.message}</p>
              )}
            </div>

            {/* Willing to Relocate */}
            <div className="space-y-1">
              <Label htmlFor="willingToRelocate">Willing to Relocate</Label>
              <select
                id="willingToRelocate"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register("willingToRelocate")}
              >
                <option value="">Willing to Relocate</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.willingToRelocate && (
                <p className="text-xs text-destructive">{errors.willingToRelocate.message}</p>
              )}
            </div>

            {/* Saturday Availability */}
            <div className="space-y-1 md:col-span-2">
              <Label className="block mb-2">Availability on Saturday</Label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                  <input
                    type="radio"
                    value="yes"
                    {...register("availabilityOnSaturday")}
                    className="h-4 w-4 accent-primary"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                  <input
                    type="radio"
                    value="no"
                    {...register("availabilityOnSaturday")}
                    className="h-4 w-4 accent-primary"
                  />
                  No
                </label>
              </div>
              {errors.availabilityOnSaturday && (
                <p className="text-xs text-destructive mt-1">{errors.availabilityOnSaturday.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="description">Message</Label>
              <Textarea
                id="description"
                placeholder="Message"
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="space-y-1 md:col-span-2">
              <div className="flex items-start gap-2 mt-2">
                <Controller
                  control={control}
                  name="acceptedTerms"
                  render={({ field }) => (
                    <Checkbox
                      id="acceptedTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label htmlFor="acceptedTerms" className="text-sm font-normal text-muted-foreground leading-none cursor-pointer">
                  I accept{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms & Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.acceptedTerms && (
                <p className="text-xs text-destructive mt-1">{errors.acceptedTerms.message}</p>
              )}
            </div>
          </div>

          {/* <p className="text-xs text-muted-foreground pt-1 border-t">
            Using resume:{" "}
            <span className="font-medium text-foreground">
              Riya_Sharma_Resume.pdf
            </span>
          </p> */}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button loading={loading} type="submit" disabled={loading}>
              {loading ? "Applying..." : "Apply Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
