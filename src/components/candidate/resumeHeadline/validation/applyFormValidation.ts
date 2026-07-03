import z from 'zod'


export const applySchema = z.object({
  experienceLevel: z
    .string()
    .refine((val) => val !== "" && !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 40, {
      message: "* Invalid experience (0 - 40 years required)",
    }),
  noticePeriod: z.string().min(1, "* Required"),
  preferredTime: z.string().min(1, "* Required"),
  willingToRelocate: z.string().min(1, "* Required"),
  availabilityOnSaturday: z.string().min(1, "* Required"),
  description: z.string().min(1, "* Required"),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "* Please accept terms",
  }),
});

  export type ApplyFormValues = z.infer<typeof applySchema>;