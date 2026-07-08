import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Check, ChevronsUpDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { generatePassword } from "../employer/utils/generatePassword";
import {
  employerRegisterSchema,
  type EmployerRegisterInput,
} from "../employer/validation/CandidateRegisterValidation";
import { useCompanyTypes } from "../employer/hooks/useCompanyTypes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";



//made it configureable
const USE_DROPDOWN_FOR_COMPANY_TYPE = false;




interface EmployerFormProps {
  loading: boolean;
  onSubmit: (payload: any) => void;
}

export default function EmployerForm({ loading, onSubmit }: EmployerFormProps) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openCompanyType, setOpenCompanyType] = useState(false);
  const { data: companyTypes, loading: fetchingTypes, error: fetchError } = useCompanyTypes();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, touchedFields, dirtyFields, isSubmitted },
  } = useForm<EmployerRegisterInput>({
    resolver: zodResolver(employerRegisterSchema),
    mode: "onChange",
    defaultValues: {
      company_type: "",
      name: "",
      email: "",
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

  const handleFormSubmit = (data: EmployerRegisterInput) => {
    onSubmit({
      company_type: data.company_type,
      name: data.name,
      email: data.email,
      phone_number: `91${data.phone}`,
      password: data.password,
    });
  };

  const companyTypeList = companyTypes.length > 0 ? companyTypes : []

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Company Type */}
      <div className="space-y-2">
        <Label className="text-foreground font-medium">
          Company Type<span className="text-destructive font-bold ml-0.5">*</span>
        </Label>

        {fetchingTypes ? (
          <p className="text-xs text-muted-foreground animate-pulse">Loading company types...</p>
        ) : (
          USE_DROPDOWN_FOR_COMPANY_TYPE ? (
            <Controller
              control={control}
              name="company_type"
              render={({ field }) => (
                <Popover open={openCompanyType} onOpenChange={setOpenCompanyType}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCompanyType}
                      className="h-11 w-full justify-between bg-background border border-input text-sm font-normal text-left px-3 hover:bg-background hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {field.value
                        ? companyTypeList.find((item: any) => item._id === field.value)?.Legal_Structure || "Select company type"
                        : "Select company type"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search company type..." />
                      <CommandList>
                        <CommandEmpty>No company type found.</CommandEmpty>
                        <CommandGroup>
                          {companyTypeList.map((item: any) => (
                            <CommandItem
                              key={item._id}
                              value={item.Legal_Structure}
                              onSelect={() => {
                                field.onChange(item._id);
                                setOpenCompanyType(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === item._id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {item.Legal_Structure}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
          ) : (
            <div className="flex flex-wrap gap-4 mt-2">
              {companyTypeList.map((item) => (
                <div className="flex items-center gap-2" key={item._id}>
                  <input
                    className="form-check-input h-4 w-4 text-primary border-gray-300 focus:ring-primary cursor-pointer"
                    type="radio"
                    id={`company-${item._id}`}
                    value={item._id}
                    {...register("company_type")}
                  />
                  <label
                    className="text-sm font-medium text-foreground cursor-pointer"
                    htmlFor={`company-${item._id}`}
                  >
                    {item.Legal_Structure}
                  </label>
                </div>
              ))}
            </div>
          )
        )}

        {fetchError && (
          <p className="text-xs text-amber-600 mt-1">Note: Using offline fallback company types.</p>
        )}

        {errors.company_type && (touchedFields.company_type || isSubmitted) && (
          <p className="text-xs text-destructive mt-1">{errors.company_type.message}</p>
        )}
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground font-medium">
          Company Name<span className="text-destructive font-bold ml-0.5">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Company name"
          className="h-11"
          {...register("name")}
        />
        {errors.name && (touchedFields.name || isSubmitted) && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Official Email Address */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium">
          Official Email Address<span className="text-destructive font-bold ml-0.5">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter official email address"
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
          <Label htmlFor="password" className="text-foreground font-medium flex items-center gap-1.5">
            Password<span className="text-destructive font-bold ml-0.5">*</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="inline-flex text-muted-foreground hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-full">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-3 bg-popover text-popover-foreground border border-border shadow-lg rounded-lg max-w-xs" side="right" align="start">
                <div className="space-y-1 text-xs leading-normal">
                  <p className="font-medium text-foreground mb-1">Password requirements:</p>
                  <div className="text-muted-foreground space-y-0.5 font-normal">
                    <p>1) Password must be at least 8 characters long.</p>
                    <p>2) Must contain at least one uppercase letter.</p>
                    <p>3) Must contain at least one lowercase letter.</p>
                    <p>4) Must contain at least one number.</p>
                    <p>5) Must contain at least one special character.</p>
                    <p>6) Spaces are not allowed.</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
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
