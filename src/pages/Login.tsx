import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Sparkles, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Link } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const apiurl = import.meta.env.VITE_API_URL; // React Vite

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "1") {
        navigate("/candidate/dashboard");
      } else if (role === "2") {
        navigate("/employer");
      } else if (role === "3") {
        navigate("/employer");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${apiurl}/api/auth/login`, formData, {
        withCredentials: true,
      });

      console.log("LOGIN RESPONSE", response);
      console.log("LOGIN DATA", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const token = response.data.token;
      const role = response.data.role;
      const employerName = response.data.data?.name || "";

      localStorage.setItem("user_name", response?.data?.data?.name || "");

      setSuccess(response.data.message || "Login successful");

      toast({
        title: "Login Successful",
        description: response.data.message || "Welcome back!",
      });
      if (role == "1") {
        localStorage.setItem("token", token);
        // localStorage.setItem("candidate_name", candidateName);
        localStorage.setItem("role", role);
        window.location.href = "/candidate/dashboard";
      } else if (role == "2") {
        localStorage.setItem("token", token);
        localStorage.setItem("employer_name", employerName);
        localStorage.setItem("role", role);

        window.location.href = "/employer";
      } else if (role == "3") {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        window.location.href = "/institute";
      } else {
        setError("Unauthorized access");

        toast({
          title: "Access Denied",
          description: "Unauthorized access",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      setError(message);

      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-brand text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <Link to="/">
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground text-primary font-display font-extrabold text-xl">
              G
            </div>
            <div>
              <p className="font-display font-bold text-xl leading-none">
                GEISIL
              </p>
              <p className="text-xs text-primary-foreground/70 mt-1">
                Institute Portal
              </p>
            </div>
          </div>
        </Link>
        <div className="relative max-w-md">
          <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight">
            Access. Evaluate. Recruit.
          </h1>
          <p className="mt-5 text-primary-foreground/80 leading-relaxed">
            Manage student employability, evaluations and placements from a
            single, secure workspace built for institutions.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              {
                icon: Users2,
                text: "Unified roster of 12,000+ students & faculty",
              },
              {
                icon: Sparkles,
                text: "AI-assisted evaluations & skill mapping",
              },
              {
                icon: ShieldCheck,
                text: "Bank-grade security and audit trails",
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
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-extrabold">
              G
            </div>
            <div>
              <p className="font-display font-bold text-lg leading-none text-foreground">
                GEISIL
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Institute Portal
              </p>
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Sign in to your workspace
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your institute credentials to continue.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@institute.edu"
                className="h-11"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium"
                >
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-11 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* <div className="flex items-center gap-2">
              <Checkbox id="remember" defaultChecked />
              <Label
                htmlFor="remember"
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                Keep me signed in for 30 days
              </Label>
            </div> */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground font-semibold shadow-brand transition-all"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>

          <p className="mt-10 text-center text-xs text-muted-foreground">
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
