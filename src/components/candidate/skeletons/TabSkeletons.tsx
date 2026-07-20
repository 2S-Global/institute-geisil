import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

// About Tab Skeleton (KYC, Resume Headline, Profile Summary, Skills, etc.)
export function AboutTabSkeleton() {
  return (
    <div className="space-y-6 mt-6 animate-pulse">
      {/* KYC Skeleton */}
      <Card className="border-border/60">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-muted" />
          <Skeleton className="h-4 w-64 bg-muted mt-2" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-24 bg-muted" />
              <Skeleton className="h-4 w-40 bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resume Headline Skeleton */}
      <Card className="border-border/60">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-muted" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full bg-muted" />
        </CardContent>
      </Card>

      {/* Profile Summary Skeleton */}
      <Card className="border-border/60">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-muted" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-5/6 bg-muted" />
          <Skeleton className="h-4 w-4/5 bg-muted" />
        </CardContent>
      </Card>

      {/* Skills Skeleton */}
      <Card className="border-border/60">
        <CardHeader>
          <Skeleton className="h-6 w-20 bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-28 bg-muted" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded bg-muted" />
                <Skeleton className="h-6 w-24 rounded bg-muted" />
                <Skeleton className="h-6 w-20 rounded bg-muted" />
                <Skeleton className="h-6 w-14 rounded bg-muted" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Experience Tab Skeleton (Employment details, Work profiles, Career profiles)
export function ExperienceTabSkeleton() {
  return (
    <div className="space-y-6 mt-6 animate-pulse">
      {/* Employment Skeleton */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row justify-between items-center pb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 bg-muted" />
            <Skeleton className="h-4 w-60 bg-muted" />
          </div>
          <Skeleton className="h-9 w-32 bg-muted" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 bg-muted" />
                  <Skeleton className="h-4 w-36 bg-muted" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-muted" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 bg-muted" />
                  <Skeleton className="h-4 w-32 bg-muted" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 bg-muted" />
                  <Skeleton className="h-4 w-32 bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Work Profile List Skeleton */}
      <Card className="border-border/60">
        <CardHeader>
          <Skeleton className="h-6 w-44 bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 items-start border-b pb-4 last:border-b-0 last:pb-0">
              <Skeleton className="h-10 w-10 rounded bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40 bg-muted" />
                <Skeleton className="h-4 w-28 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Education Tab Skeleton (Academics & Certifications)
export function EducationTabSkeleton() {
  return (
    <div className="space-y-6 mt-6 animate-pulse">
      {/* Academics Skeleton */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row justify-between items-center pb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24 bg-muted" />
            <Skeleton className="h-4 w-52 bg-muted" />
          </div>
          <Skeleton className="h-9 w-28 bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 items-start border-b pb-4 last:border-b-0 last:pb-0">
              <Skeleton className="h-10 w-10 rounded bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48 bg-muted" />
                <Skeleton className="h-4 w-36 bg-muted" />
                <Skeleton className="h-3.5 w-20 bg-muted" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Certifications Skeleton */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row justify-between items-center pb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 bg-muted" />
          </div>
          <Skeleton className="h-9 w-24 bg-muted" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 items-center border rounded-lg p-4">
              <Skeleton className="h-8 w-8 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36 bg-muted" />
                <Skeleton className="h-3.5 w-24 bg-muted" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Projects Tab Skeleton (Project cards grid)
export function ProjectsTabSkeleton() {
  return (
    <div className="space-y-6 mt-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24 bg-muted" />
          <Skeleton className="h-4 w-48 bg-muted" />
        </div>
        <Skeleton className="h-9 w-28 bg-muted" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/60">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-40 bg-muted" />
                <Skeleton className="h-8 w-8 rounded bg-muted" />
              </div>
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-5/6 bg-muted" />
              <div className="flex gap-1.5 pt-2">
                <Skeleton className="h-5 w-12 rounded-full bg-muted" />
                <Skeleton className="h-5 w-16 rounded-full bg-muted" />
                <Skeleton className="h-5 w-14 rounded-full bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Resume Tab Skeleton (Resume Dropzone & Reports)
export function ResumeTabSkeleton() {
  return (
    <div className="space-y-6 mt-6 animate-pulse">
      <Card className="border-border/60">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-muted" />
          <Skeleton className="h-4 w-72 bg-muted mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dropzone Skeleton */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/10">
            <Skeleton className="h-8 w-8 mx-auto bg-muted rounded-full mb-3" />
            <Skeleton className="h-4 w-36 mx-auto bg-muted mb-2" />
            <Skeleton className="h-3 w-28 mx-auto bg-muted mb-4" />
            <Skeleton className="h-8 w-24 mx-auto bg-muted" />
          </div>

          {/* Uploaded file entry */}
          <div className="flex items-center gap-3 rounded-md border p-3">
            <Skeleton className="h-9 w-9 rounded bg-muted" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40 bg-muted" />
              <Skeleton className="h-3 w-24 bg-muted" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
          </div>

          {/* Download Report Bar */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-muted" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 bg-muted" />
                <Skeleton className="h-3 w-40 bg-muted" />
              </div>
            </div>
            <Skeleton className="h-9 w-24 bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
