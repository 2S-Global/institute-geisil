import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Briefcase, GraduationCap, Sparkles, ShieldCheck, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Role = "candidate" | "employer" | "institute";

const roles: { id: Role; label: string; icon: typeof User }[] = [
  { id: "candidate", label: "Candidate", icon: User },
  { id: "employer", label: "Employer", icon: Briefcase },
  { id: "institute", label: "Institute", icon: GraduationCap },
];

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("candidate");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 12; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setPassword(pwd);
    setConfirm(pwd);
    setShowPwd(true);
    toast({ title: "Password generated", description: "A strong password has been filled in." });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", description: "Please re-enter your password." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Account created", description: `Welcome to GEISIL as a ${role}.` });
      navigate("/login");
    }, 700);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-brand text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground text-primary font-display font-extrabold text-xl">
            G
          </div>
          <div>
            <p className="font-display font-bold text-xl leading-none">
              GEISIL
            </p>
            <p className="text-xs text-primary-foreground/70 mt-1">
              Employability Reimagined
            </p>
          </div>
        </div>

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
      <section className="flex items-center justify-center p-6 sm:p-10">
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

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Full Name
              </Label>
              <Input id="name" required placeholder="Name" className="h-11" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2" style={{ position: "relative" }}>
                <Label htmlFor="dob" className="text-foreground font-medium">
                  DOB
                </Label>
                <Input id="dob" type="date" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father" className="text-foreground font-medium">
                  {role === "employer"
                    ? "Company"
                    : role === "institute"
                      ? "Institute"
                      : "Father Name"}
                </Label>
                <Input
                  id="father"
                  required
                  placeholder={
                    role === "employer"
                      ? "Company name"
                      : role === "institute"
                        ? "Institute name"
                        : "Father name"
                  }
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Enter your email address"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">
                Phone Number
              </Label>
              <div className="flex">
                <span className="inline-flex items-center gap-1 rounded-l-md border border-r-0 border-input bg-secondary px-3 text-sm text-secondary-foreground">
                  <span className="text-base leading-none">🇮🇳</span> +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="Phone"
                  className="h-11 rounded-l-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium"
                >
                  Password
                </Label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Generate password
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password"
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-foreground font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle confirm password"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground font-semibold shadow-brand transition-all"
            >
              {loading ? "Creating account…" : "Register"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-primary hover:underline"
              >
                LogIn
              </Link>
            </p>
          </form>

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
