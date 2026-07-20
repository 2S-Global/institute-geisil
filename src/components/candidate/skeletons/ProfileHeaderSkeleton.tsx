import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60 animate-pulse">
      {/* Cover Skeleton */}
      <div className="relative h-28 bg-muted">
        {/* Edit Profile Button Skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton className="h-9 w-28 bg-background/20" />
        </div>
      </div>

      <CardContent className="relative pt-0 pb-6">
        {/* Profile Header Container */}
        <div className="flex flex-col lg:flex-row lg:justify-between">
          {/* Left Side: Avatar & Details */}
          <div className="flex flex-col sm:flex-row gap-4 -mt-14">
            <div className="relative w-28 h-28">
              {/* Avatar Skeleton with border */}
              <Skeleton className="h-28 w-28 rounded-full border-4 border-background shadow-lg bg-muted" />
            </div>

            <div className="pt-14 sm:pt-14 space-y-3">
              {/* Name & Verification Badges */}
              <div className="flex flex-wrap items-center mt-2 gap-2">
                <Skeleton className="h-8 w-48 bg-muted" />
                <Skeleton className="h-5 w-20 rounded-full bg-muted" />
              </div>

              {/* Location, Salary, Phone, Email fields */}
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full bg-muted" />
                  <Skeleton className="h-4 w-32 bg-muted" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full bg-muted" />
                  <Skeleton className="h-4 w-24 bg-muted" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full bg-muted" />
                  <Skeleton className="h-4 w-36 bg-muted" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full bg-muted" />
                  <Skeleton className="h-4 w-40 bg-muted" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Resume Download Button */}
          <div className="flex flex-wrap gap-2 mt-4 lg:mt-6 lg:self-start">
            <Skeleton className="h-9 w-24 bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
