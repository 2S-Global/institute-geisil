import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import API from "../lib/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/api/auth/forgotpass", {
        email,
      });

      setSent(true);

      toast({
        title: "Success",
        description: data.message,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Failed to send password.",
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

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight">
            Reset your password securely.
          </h1>
          {/* <p className="mt-5 text-primary-foreground/80 leading-relaxed">
            We'll email you a single-use link to set a new password. Links
            expire after 30 minutes for your safety.
          </p> */}

          <ul className="mt-10 space-y-4">
            {[
              {
                icon: KeyRound,
                text: "Single-use, time-limited recovery link",
              },
              { icon: ShieldCheck, text: "Encrypted in transit and at rest" },
              {
                icon: MailCheck,
                text: "Audit-logged for institute compliance",
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

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>

          {!sent ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-5">
                <KeyRound className="h-5 w-5" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">
                Forgot your password?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter the email associated with your account and we'll send a
                link to reset it.
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="admin@institute.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground font-semibold shadow-brand transition-all"
                >
                  {loading ? "Sending Password…" : "Send Password"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Remembered it?{" "}
                  <Link
                    to="/"
                    className="font-semibold text-primary hover:underline"
                  >
                    Sign in instead
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-5">
                <MailCheck className="h-5 w-5" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">
                Password Sent
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                A new temporary password has been sent to{" "}
                <span className="font-semibold text-foreground">{email}</span>.
                Please log in using the new password and change it immediately.
              </p>

              <div className="mt-8 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                Didn't get the email? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="font-semibold text-primary hover:underline"
                >
                  try a different address
                </button>
                .
              </div>

              <Button
                asChild
                className="w-full h-11 mt-6 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground font-semibold shadow-brand"
              >
                <Link to="/">Return to sign in</Link>
              </Button>
            </>
          )}

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
