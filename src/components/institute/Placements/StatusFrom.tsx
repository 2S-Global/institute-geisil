import { useEffect, useState } from "react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */

export const offerSchema = z.object({
  status: z.enum([
    "Online assessment",
    "Technical rounds",
    "Hiring manager round + culture fit",
    "Final interview cleared",
    "Offer extended",
    "Offer accepted",
    "Joined",
  ]),

  date: z.string().trim().min(1, "Date is required"),
  placementId: z.string().trim().optional(),

  remark: z
    .string()
    .trim()
    .max(500, "Remark must be 500 characters or less")
    .optional()
    .or(z.literal("")),
});

export type OfferStatusForm = z.infer<typeof offerSchema>;

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

type OfferStatusModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  offer?: {
    id: string;
    status?: string;
    date?: string;
    remark?: string;
  } | null;

  onSubmit: (offerId: string, data: OfferStatusForm) => void | Promise<void>;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function OfferStatusModal({
  open,
  onOpenChange,
  offer,
  onSubmit,
}: OfferStatusModalProps) {
  const [form, setForm] = useState<OfferStatusForm>({
    status: "Online assessment",
    date: "",
    remark: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ------------------------------------------------------------------------ */
  /* Populate form when selected offer changes                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!offer) {
      setForm({
        status: "Online assessment",
        date: "",
        remark: "",
      });

      setErrors({});
      return;
    }

    const validStatuses = [
      "Online assessment",
      "Technical rounds",
      "Hiring manager round + culture fit",
      "Final interview cleared",
      "Offer extended",
      "Offer accepted",
      "Joined",
      "Rejected",
    ] as const;

    const status = validStatuses.includes(
      offer.status as (typeof validStatuses)[number],
    )
      ? (offer.status as OfferStatusForm["status"])
      : "Online assessment";

    setForm({
      status,
      date: offer.date ?? "",
      remark: offer.remark ?? "",
    });

    setErrors({});
  }, [offer]);

  /* ------------------------------------------------------------------------ */
  /* Update field                                                              */
  /* ------------------------------------------------------------------------ */

  const update = <K extends keyof OfferStatusForm>(
    field: K,
    value: OfferStatusForm[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                    */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = offerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    if (!offer?.id) {
      return;
    }
    result.data.placementId = offer?.id;

    console.log("result.data=>", result.data);
    setErrors({});

    await onSubmit(result.data);
  };

  /* ------------------------------------------------------------------------ */
  /* Close                                                                     */
  /* ------------------------------------------------------------------------ */

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Update Status
          </DialogTitle>

          <DialogDescription>
            Update the placement status, date and remark.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid gap-4 md:grid-cols-2">
            {/* ============================================================ */}
            {/* Status                                                         */}
            {/* ============================================================ */}

            <div className="space-y-1.5">
              <Label htmlFor="offer-status">Status *</Label>

              <Select
                value={form.status}
                onValueChange={(value) =>
                  update("status", value as OfferStatusForm["status"])
                }
              >
                <SelectTrigger id="offer-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Online assessment">
                    Online assessment
                  </SelectItem>

                  <SelectItem value="Technical rounds">
                    Technical rounds
                  </SelectItem>

                  <SelectItem value="Hiring manager round + culture fit">
                    Hiring manager round + culture fit
                  </SelectItem>

                  <SelectItem value="Final interview cleared">
                    Final interview cleared
                  </SelectItem>

                  <SelectItem value="Offer extended">Offer extended</SelectItem>

                  <SelectItem value="Offer accepted">Offer accepted</SelectItem>
                  <SelectItem value="Joined">Joined</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {errors.status && (
                <p className="text-xs text-destructive">{errors.status}</p>
              )}
            </div>

            {/* ============================================================ */}
            {/* Date                                                           */}
            {/* ============================================================ */}

            <div className="space-y-1.5">
              <Label htmlFor="offer-date">Date *</Label>

              <div className="relative">
                <Input
                  id="offer-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>

              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
            </div>

            {/* ============================================================ */}
            {/* Remark                                                         */}
            {/* ============================================================ */}

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="offer-remark">Remark</Label>

              <Textarea
                id="offer-remark"
                value={form.remark}
                onChange={(e) => update("remark", e.target.value)}
                placeholder="Add a remark..."
                maxLength={500}
                rows={4}
                className="resize-none"
              />

              {errors.remark && (
                <p className="text-xs text-destructive">{errors.remark}</p>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* Footer                                                         */}
          {/* ============================================================ */}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-primary text-primary-foreground shadow-brand hover:bg-[hsl(var(--primary-hover))]"
            >
              Update offer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
