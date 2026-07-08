import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { generatePassword } from "../employer/utils/generatePassword";
import {
  candidateRegisterSchema,
  type CandidateRegisterInput,
} from "../employer/validation/CandidateRegisterValidation";

interface CandidateFormProps {
  loading: boolean;
  onSubmit: (payload: any) => void;
}

export default function CandidateForm({ loading, onSubmit }: CandidateFormProps) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields, dirtyFields, isSubmitted },
  } = useForm<CandidateRegisterInput>({
    resolver: zodResolver(candidateRegisterSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      dob: "",
      father_name: "",
      phone: "",
      password: "",
      confirm: "",
    },
  });

  const handleGeneratePassword = () => {
    const newPwd = generatePassword();
    setValue("password", newPwd, { shouldValidate: true });
    setValue("confirm", newPwd, { shouldValidate: true });
    setShowPwd(true);
    toast({
      title: "Password generated",
      description: "A strong password has been filled in.",
    });
  };

  const handleFormSubmit = (data: CandidateRegisterInput) => {
    // Reverse DOB from YYYY-MM-DD to DD-MM-YYYY (or vice versa depending on frontend requirements, but user did split("/").reverse().join("-"))
    // Wait, the input type date returns YYYY-MM-DD, and the split("/").reverse() was used when it was dd/mm/yyyy.
    // Let's keep the user's reversal logic if it splits by "/" or "-", or just pass the date format
    const reversedDOB = data.dob ? data.dob.split("-").reverse().join("-") : "";
    
    onSubmit({
      name: data.name,
      email: data.email,
      password: data.password,
      phone_number: `91${data.phone}`,
      dob: reversedDOB,
      father_name: data.father_name,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground font-medium">
          Full Name<span className="text-destructive font-bold ml-0.5">*</span>
        </Label>
        <Input id="name" placeholder="Name" className="h-11" {...register("name")} />
        {errors.name && (touchedFields.name || isSubmitted) && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* DOB and Father Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2" style={{ position: "relative" }}>
          <Label htmlFor="dob" className="text-foreground font-medium">
            DOB<span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <Input id="dob" type="date" className="h-11" {...register("dob")} />
          {errors.dob && (touchedFields.dob || isSubmitted) && (
            <p className="text-xs text-destructive mt-1">{errors.dob.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="father" className="text-foreground font-medium">
            Father Name<span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <Input
            id="father"
            placeholder="Father name"
            className="h-11"
            {...register("father_name")}
          />
          {errors.father_name && (touchedFields.father_name || isSubmitted) && (
            <p className="text-xs text-destructive mt-1">{errors.father_name.message}</p>
          )}
        </div>
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium">
          Email Address<span className="text-destructive font-bold ml-0.5">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          className="h-11"
          {...register("email")}
        />
        {errors.email && (touchedFields.email || isSubmitted) && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground font-medium">
          Phone Number<span className="text-destructive font-bold ml-0.5">*</span>
        </Label>
        <div className="flex">
          <span className="inline-flex items-center gap-1 rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm text-secondary-foreground">
            <span className="text-base leading-none">🇮🇳</span> +91
          </span>
          <Input
            id="phone"
            type="tel"
            placeholder="Phone"
            className="h-11 rounded-l-none"
            {...register("phone")}
          />
        </div>
        {errors.phone && (touchedFields.phone || isSubmitted) && (
          <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-foreground font-medium">
            Password<span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <button
            type="button"
            onClick={handleGeneratePassword}
            className="text-xs font-medium text-primary hover:underline"
          >
            Generate password
          </button>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            className="h-11 pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle password"
          >
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (touchedFields.password || isSubmitted) && (
          <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm" className="text-foreground font-medium">
          Confirm Password<span className="text-destructive font-bold ml-0.5">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter password"
            className="h-11 pr-10"
            {...register("confirm")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle confirm password"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirm && (dirtyFields.confirm || touchedFields.confirm || isSubmitted) && (
          <p className="text-xs text-destructive mt-1">{errors.confirm.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground font-semibold shadow-brand transition-all"
      >
        {loading ? "Creating account…" : "Register"}
      </Button>
    </form>
  );
}
