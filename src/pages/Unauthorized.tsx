import { Link, useLocation } from "react-router-dom";
import { Home, LogIn, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--destructive)/0.12),transparent_55%),radial-gradient(circle_at_80%_75%,hsl(var(--primary)/0.10),transparent_55%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-xl text-center">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <ShieldAlert className="h-7 w-7 text-destructive" />
        </div>
       {/*  <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          Error 401
        </p> */}
       {/*  <h1 className="font-display text-7xl md:text-8xl font-extrabold tracking-tight text-foreground">
          401
        </h1> */}
        <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold text-foreground">
          Not authorized
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm md:text-base text-muted-foreground">
          You don’t have permission to access{" "}
          {/* <span className="font-mono text-foreground/80">{from ?? "this page"}</span>. */} Please sign in with an account that has the right access.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
         {/*  <Button asChild className="gap-2 shadow-brand">
            <Link to="/login"><LogIn className="h-4 w-4" /> Sign in</Link>
          </Button> */}
           {localStorage.getItem("role" )==='2' && <Button asChild variant="outline">
            <Link to="/employer"><Home className="h-4 w-4" /> Back to home</Link>
          </Button>}
           {localStorage.getItem("role" )==='3' && <Button asChild variant="outline">
            <Link to="/institute"><Home className="h-4 w-4" /> Back to home</Link>
          </Button>}
         {/*  <Button asChild variant="outline" className="gap-2">
            <Link to="/"><Home className="h-4 w-4" /> Back to home</Link>
          </Button> */}
        </div>
      </div>
    </main>
  );
};

export default Unauthorized;
