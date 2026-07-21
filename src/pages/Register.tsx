import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Users2,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CandidateForm from "./register/CandidateForm";
import EmployerForm from "./register/EmployerForm";
import InstituteForm from "./register/InstituteForm";
import { cn } from "@/lib/utils";
import {
  Candidatetype,
  useRegisterCandidate,
} from "./employer/hooks/useRegisterCandidate";
import {
  EmployerType,
  useRegisterEmployer,
} from "./employer/hooks/useRegisterEmployer";
import {
  Institutetype,
  useRegisterInstitute,
} from "./employer/hooks/useRegisterInstitute";
import Logo from "../assets/img/Logo.webp";
type Role = "candidate" | "employer" | "institute";

const roles: { id: Role; label: string; icon: typeof User }[] = [
  { id: "candidate", label: "Candidate", icon: User },
  { id: "employer", label: "Employer", icon: Briefcase },
  { id: "institute", label: "Institute", icon: GraduationCap },
];

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("candidate");

  //custom hooks for 3 apis
  const {
    registerCandidate,
    loading: candidateLoading,
    error: candidateError,
  } = useRegisterCandidate();
  const {
    registerEmployer,
    loading: employerLoading,
    error: employerError,
  } = useRegisterEmployer();
  const {
    registerInstitute,
    loading: instituteLoading,
    error: instituteError,
  } = useRegisterInstitute();

  const loading = candidateLoading || employerLoading || instituteLoading;

  const activeError =
    role === "candidate"
      ? candidateError
      : role === "employer"
        ? employerError
        : instituteError;

  const handleRegisterSubmit = async (
    payload: Candidatetype | EmployerType | Institutetype,
  ) => {
    try {
      if (role === "candidate") {
        await registerCandidate(payload as Candidatetype);
      } else if (role === "employer") {
        await registerEmployer(payload as EmployerType);
      } else if (role === "institute") {
        await registerInstitute(payload as Institutetype);
      }

      toast({
        title: "Account created",
        description: `Welcome to GEISIL as a ${role}.`,
      });
      navigate("/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err.message || "Registration failed";
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: msg,
      });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <aside className="sticky top-0 h-screen hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-brand text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <Link to="/">
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground overflow-hidden">
              <img
                src={Logo}
                alt="GEISIL Logo"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div>
              <p className="font-display font-bold text-xl leading-none">
                GEISIL
              </p>
              <p className="mt-1 text-xs text-primary-foreground/70">
                Employability Reimagined
              </p>
            </div>
          </div>
        </Link>
        <div className="relative max-w-md">
          <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight">
            Join the network. Grow your career.
          </h1>
          <p className="mt-5 text-primary-foreground/80 leading-relaxed">
            Create your account to access jobs, evaluations, and placement
            opportunities from one connected workspace.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              {
                icon: Users2,
                text: "Connect with 2,000+ employers hiring today",
              },
              {
                icon: Sparkles,
                text: "AI-powered profile matching and assessments",
              },
              {
                icon: ShieldCheck,
                text: "Secure, verified institute-backed credentials",
              },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-primary-foreground/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Global Employability Information Services
          India Limited
        </div>
      </aside>

      {/* Form panel */}
      <section className="flex items-start justify-center p-6 sm:p-10 lg:pt-20 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-extrabold">
              G
            </div>
            <div>
              <p className="font-display font-bold text-lg leading-none text-foreground">
                GEISIL
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Create your account
              </p>
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose your role and fill in your details to get started.
          </p>

          {/* Role tabs */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {roles.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-all",
                  role === id
                    ? "bg-primary text-primary-foreground border-primary shadow-brand"
                    : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/70",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeError && (
              <div className="mb-4 p-3 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold block mb-0.5 text-xs uppercase tracking-wide">
                    Registration Failed
                  </span>
                  <p className="text-sm font-medium">{activeError}</p>
                </div>
              </div>
            )}

            {role === "candidate" && (
              <CandidateForm
                loading={loading}
                onSubmit={handleRegisterSubmit}
              />
            )}
            {role === "employer" && (
              <EmployerForm loading={loading} onSubmit={handleRegisterSubmit} />
            )}
            {role === "institute" && (
              <InstituteForm
                loading={loading}
                onSubmit={handleRegisterSubmit}
              />
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                LogIn
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Developed and maintained by{" "}
            <span className="font-semibold text-foreground">
              2S Global Technologies Ltd
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
