import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, LogIn, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  /*   const navigate = useNavigate();
  useEffect(() => {
      if(localStorage.getItem("role" )==='2'){
        navigate('/employer')
      }
      if(localStorage.getItem("role" )==='3'){
        navigate('/institute')
      }

}, [navigate]);  */

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(circle_at_75%_80%,hsl(var(--accent)/0.12),transparent_55%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-xl text-center">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <Compass className="h-7 w-7 text-primary" />
        </div>
        {/*  <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5" /> Error 404
        </p>
        <h1 className="font-display text-7xl md:text-8xl font-extrabold tracking-tight text-foreground">
          404
        </h1> */}
        <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold text-foreground">
          Page not found
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm md:text-base text-muted-foreground">
          The page{" "}
          {/* <span className="font-mono text-foreground/80">{location.pathname}</span>  */}
          doesn’t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {/*  <Button asChild className="gap-2 shadow-brand">
            <Link to="/"><Home className="h-4 w-4" /> Back to home</Link>
          </Button> */}
          {localStorage.getItem("role") === "1" && (
            <Button asChild variant="outline">
              <Link to="/candidate/dashboard">
                <Home className="h-4 w-4" /> Back to home
              </Link>
            </Button>
          )}
          {localStorage.getItem("role") === "2" && (
            <Button asChild variant="outline">
              <Link to="/employer/dashboard">
                <Home className="h-4 w-4" /> Back to home
              </Link>
            </Button>
          )}
          {localStorage.getItem("role") === "3" && (
            <Button asChild variant="outline">
              <Link to="/institute/dashboard">
                <Home className="h-4 w-4" /> Back to home
              </Link>
            </Button>
          )}
          {/*    {!localStorage.getItem("token") && <Button asChild className="gap-2 shadow-brand">
            <Link to="https://geisil.com/"><LogIn className="h-4 w-4" /> Sign in</Link>
          </Button>} */}
        </div>
      </div>
    </main>
  );
};

export default NotFound;
