


// import React, { useMemo } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { User } from "lucide-react";


// // Imported variables
// import CibilLogo from "../../../../public/images/resource/Cibil Logo.png";
// import EisilScoreLogo from "../../../../public/images/resource/Eisil Score Logo.png";
// import { useProfileMetrics } from "../hooks/useProfileMetrics";

// const getStatusTheme = (value = 0) => {
//   if (value >= 85) {
//     return {
//       label: "Excellent",
//       textClass: "text-emerald-600 dark:text-emerald-400",
//       progressClass: "[&>div]:bg-emerald-500",
//     };
//   }
//   if (value >= 70) {
//     return {
//       label: "Strong",
//       textClass: "text-blue-600 dark:text-blue-400",
//       progressClass: "[&>div]:bg-blue-500",
//     };
//   }
//   if (value >= 50) {
//     return {
//       label: "Good",
//       textClass: "text-amber-600 dark:text-amber-400",
//       progressClass: "[&>div]:bg-amber-500",
//     };
//   }
//   return {
//     label: "Incomplete",
//     textClass: "text-slate-400 dark:text-slate-500",
//     progressClass: "[&>div]:bg-slate-400 dark:[&>div]:bg-slate-600",
//   };
// };

// const ProfileMetrics = ({ refresh = 0 }: { refresh?: number }) => {
//   const {
//     profileProgress,
//     geisilScore,
//     cibilScore,
//     profileLoading,
//     scoresLoading,
//   } = useProfileMetrics(refresh);

//   const profileTheme = useMemo(() => getStatusTheme(profileProgress), [profileProgress]);
//   const geisilTheme = useMemo(() => getStatusTheme(geisilScore), [geisilScore]);
  
//   const cibilPercentage = useMemo(() => {
//     if (!cibilScore) return 0;
//     const percentage = ((cibilScore - 300) / 600) * 100;
//     return Math.min(Math.max(percentage, 0), 100);
//   }, [cibilScore]);

//   const cibilTheme = useMemo(() => getStatusTheme(cibilPercentage), [cibilPercentage]);

//   return (
//     <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm w-full md:max-w-sm mx-auto rounded-xl bg-white dark:bg-slate-950">
//       <CardHeader className="pb-5 px-4 md:px-6 pt-4 md:pt-6">
//         <CardTitle className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
//           Account Status
//         </CardTitle>
//         <CardDescription className="text-xs text-slate-400 dark:text-slate-500">
//           Overview of platform matching index and profile verification.
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="space-y-6 px-4 md:px-6 pb-6">
//         {/* Metric Segment: Profile Completeness */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between w-full">
//             <div className="flex items-center gap-3">
//               <div className="p-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 flex-shrink-0">
//                 <User size={16} />
//               </div>
//               <h4 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">
//                 Profile Completeness
//               </h4>
//             </div>
//             <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 flex-shrink-0">
//               {profileLoading ? "—" : `${profileProgress}%`}
//             </span>
//           </div>
          
//           <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-wider">
//             {!profileLoading && <p className={profileTheme.textClass}>{profileTheme.label}</p>}
//           </div>
//           <Progress
//             value={profileLoading ? 0 : Number(profileProgress)}
//             className={`h-1 bg-slate-100 dark:bg-slate-900 transition-all ${profileTheme.progressClass}`}
//           />
//         </div>

//         {/* Metric Segment: Geisil Score */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between w-full">
//             <div className="flex items-center gap-3">
//               <div className="h-5 w-16 relative flex items-center justify-center flex-shrink-0">
//                 <img 
//                   src={EisilScoreLogo} 
//                   alt="Eisil Score" 
//                   className="object-contain h-full w-full dark:invert" 
//                 />
//               </div>
//               <h4 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">
//                 Geisil Score
//               </h4>
//             </div>
//             <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 flex-shrink-0">
//               {scoresLoading ? "—" : `${geisilScore}%`}
//             </span>
//           </div>

//           <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-wider">
//             {!scoresLoading && <p className={geisilTheme.textClass}>{geisilTheme.label}</p>}
//           </div>
//           <Progress
//             value={scoresLoading ? 0 : Number(geisilScore)}
//             className={`h-1 bg-slate-100 dark:bg-slate-900 transition-all ${geisilTheme.progressClass}`}
//           />
//         </div>

//         {/* Metric Segment: CIBIL Score */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between w-full">
//             <div className="flex items-center gap-3">
//               <div className="h-5 w-14 relative flex items-center justify-center flex-shrink-0">
//                 <img 
//                   src={CibilLogo} 
//                   alt="Cibil" 
//                   className="object-contain h-full w-full dark:invert" 
//                 />
//               </div>
//               <h4 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">
//                 CIBIL Score
//               </h4>
//             </div>
//             <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 flex-shrink-0">
//               {scoresLoading ? "—" : cibilScore}
//             </span>
//           </div>

//           <div className="flex justify-between items-center text-[10px] font-medium uppercase tracking-wider">
//             {!scoresLoading && <p className={cibilTheme.textClass}>{cibilTheme.label}</p>}
//           </div>
//           <Progress
//             value={scoresLoading ? 0 : cibilPercentage}
//             className={`h-1 bg-slate-100 dark:bg-slate-900 transition-all ${cibilTheme.progressClass}`}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProfileMetrics;


import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

// Imported variables
import CibilLogo from "../../../../public/images/resource/Cibil Logo.png";
import EisilScoreLogo from "../../../../public/images/resource/Eisil Score Logo.png";
import { useProfileMetrics } from "../hooks/useProfileMetrics";

const getStatusTheme = (value = 0) => {
  if (value >= 85) {
    return {
      label: "Excellent",
      textClass: "text-emerald-600 dark:text-emerald-400",
      progressClass: "[&>div]:bg-emerald-500",
    };
  }
  if (value >= 70) {
    return {
      label: "Strong",
      textClass: "text-blue-600 dark:text-blue-400",
      progressClass: "[&>div]:bg-blue-500",
    };
  }
  if (value >= 50) {
    return {
      label: "Good",
      textClass: "text-amber-600 dark:text-amber-400",
      progressClass: "[&>div]:bg-amber-500",
    };
  }
  return {
    label: "Incomplete",
    textClass: "text-slate-400 dark:text-slate-500",
    progressClass: "[&>div]:bg-slate-400 dark:[&>div]:bg-slate-600",
  };
};

const ProfileMetrics = ({ refresh = 0 }: { refresh?: number }) => {
  const {
    profileProgress,
    geisilScore,
    cibilScore,
    profileLoading,
    scoresLoading,
  } = useProfileMetrics(refresh);

  const profileTheme = useMemo(
    () => getStatusTheme(profileProgress),
    [profileProgress]
  );
  const geisilTheme = useMemo(
    () => getStatusTheme(geisilScore),
    [geisilScore]
  );

  const cibilPercentage = useMemo(() => {
    if (!cibilScore) return 0;
    const percentage = ((cibilScore - 300) / 600) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }, [cibilScore]);

  const cibilTheme = useMemo(
    () => getStatusTheme(cibilPercentage),
    [cibilPercentage]
  );

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto rounded-xl bg-white dark:bg-slate-950 transition-all">
      <CardHeader className="pb-4 sm:pb-5 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-sm sm:text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Account Status
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Overview of platform matching index and profile verification.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-5 sm:pb-6">
        {/* Metric Segment: Profile Completeness */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex-shrink-0">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 truncate">
                Profile Completeness
              </h4>
            </div>

            {profileLoading ? (
              <Skeleton className="h-6 w-12 rounded" />
            ) : (
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 flex-shrink-0">
                {`${profileProgress}%`}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-h-[16px]">
            {profileLoading ? (
              <Skeleton className="h-3 w-16 rounded" />
            ) : (
              <p className={profileTheme.textClass}>{profileTheme.label}</p>
            )}
          </div>

          <Progress
            value={profileLoading ? 0 : Number(profileProgress)}
            className={`h-1.5 bg-slate-100 dark:bg-slate-900 transition-all ${profileTheme.progressClass}`}
          />
        </div>

        {/* Metric Segment: Geisil Score */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="h-5 w-14 sm:w-16 relative flex items-center justify-center flex-shrink-0">
                <img
                  src={EisilScoreLogo}
                  alt="Eisil Score"
                  className="object-contain h-full w-full dark:invert"
                />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 truncate">
                Geisil Score
              </h4>
            </div>

            {scoresLoading ? (
              <Skeleton className="h-6 w-12 rounded" />
            ) : (
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 flex-shrink-0">
                {`${geisilScore}%`}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-h-[16px]">
            {scoresLoading ? (
              <Skeleton className="h-3 w-16 rounded" />
            ) : (
              <p className={geisilTheme.textClass}>{geisilTheme.label}</p>
            )}
          </div>

          <Progress
            value={scoresLoading ? 0 : Number(geisilScore)}
            className={`h-1.5 bg-slate-100 dark:bg-slate-900 transition-all ${geisilTheme.progressClass}`}
          />
        </div>

        {/* Metric Segment: CIBIL Score */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="h-5 w-12 sm:w-14 relative flex items-center justify-center flex-shrink-0">
                <img
                  src={CibilLogo}
                  alt="CIBIL"
                  className="object-contain h-full w-full dark:invert"
                />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 truncate">
                CIBIL Score
              </h4>
            </div>

            {scoresLoading ? (
              <Skeleton className="h-6 w-12 rounded" />
            ) : (
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 flex-shrink-0">
                {cibilScore}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-h-[16px]">
            {scoresLoading ? (
              <Skeleton className="h-3 w-16 rounded" />
            ) : (
              <p className={cibilTheme.textClass}>{cibilTheme.label}</p>
            )}
          </div>

          <Progress
            value={scoresLoading ? 0 : cibilPercentage}
            className={`h-1.5 bg-slate-100 dark:bg-slate-900 transition-all ${cibilTheme.progressClass}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileMetrics;