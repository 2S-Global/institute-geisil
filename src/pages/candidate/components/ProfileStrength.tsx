

// import React, { useEffect, useMemo, useState } from "react";
// import API from "@/lib/axios";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";

// // Professional styling configuration
// const getMetricTheme = (value = 0, type = "progress") => {
//   const isProfile = type === "progress";
  
//   if (value >= 90) {
//     return {
//       label: "Exceptional",
//       badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
//       progressClass: "[&>div]:bg-emerald-500",
//       bgClass: "bg-emerald-500/5",
//     };
//   }
//   if (value >= 70) {
//     return {
//       label: "Strong",
//       badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
//       progressClass: "[&>div]:bg-blue-500",
//       bgClass: "bg-blue-500/5",
//     };
//   }
//   if (value >= 50) {
//     return {
//       label: "Optimal",
//       badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
//       progressClass: "[&>div]:bg-amber-500",
//       bgClass: "bg-amber-500/5",
//     };
//   }
//   return {
//     label: isProfile ? "Incomplete" : "Attention Required",
//     badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
//     progressClass: "[&>div]:bg-rose-500",
//     bgClass: "bg-rose-500/5",
//   };
// };

// const ProfileMetrics = () => {
//   const [profileProgress, setProfileProgress] = useState(0);
//   const [geisilScore, setGeisilScore] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const fetchMetricsData = async () => {
//     try {
//       setLoading(true);
//       const [userDataRes, scoreRes] = await Promise.all([
//         API.get("api/userdata/userdata"),
//         API.get("api/userdata/getscore")
//       ]);

//       const progressValue = userDataRes.data?.progress ?? userDataRes.data?.data?.progress ?? 0;
//       const scoreValue = scoreRes.data?.GeisilScore ?? scoreRes.data?.data?.GeisilScore ?? scoreRes.data?.score ?? scoreRes.data?.data?.score ?? 0;

//       setProfileProgress(Number(progressValue) || 0);
//       setGeisilScore(Number(scoreValue) || 0);
//     } catch (error) {
//       console.error("Error fetching metrics data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMetricsData();
//   }, []);

//   const profileTheme = useMemo(() => getMetricTheme(profileProgress, "progress"), [profileProgress]);
//   const geisilTheme = useMemo(() => getMetricTheme(geisilScore, "score"), [geisilScore]);

//   return (
//     <Card className="overflow-hidden border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md">
//       <CardHeader className="space-y-1.5 pb-4">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
//             Performance Overview
//           </CardTitle>
//           {loading && (
//             <span className="text-xs font-medium text-slate-400 animate-pulse">
//               Syncing...
//             </span>
//           )}
//         </div>
//         <CardDescription className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
//           Real-time diagnostics tracking your profile validity and platform alignment index.
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="space-y-4 pt-0">
//         {/* --- Profile Strength Block --- */}
//         <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-200 hover:shadow-sm">
//           <div className="flex items-center justify-between mb-2.5">
//             <div className="space-y-0.5">
//               <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
//                 Profile Completeness
//               </p>
//               <h4 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
//                 {loading ? "—" : `${profileProgress}%`}
//               </h4>
//             </div>
//             {!loading && (
//               <Badge
//                 variant="outline"
//                 className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${profileTheme.badgeClass}`}
//               >
//                 {profileTheme.label}
//               </Badge>
//             )}
//           </div>
//           <Progress
//             value={loading ? 0 : Number(profileProgress)}
//             className={`h-1.5 bg-slate-100 dark:bg-slate-800 transition-all ${profileTheme.progressClass}`}
//           />
//         </div>

//         {/* --- Geisil Score Block --- */}
//         <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-200 hover:shadow-sm">
//           <div className="flex items-center justify-between mb-2.5">
//             <div className="space-y-0.5">
//               <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
//                 Geisil Score
//               </p>
//               <h4 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
//                 {loading ? "—" : `${geisilScore}%`}
//               </h4>
//             </div>
//             {!loading && (
//               <Badge
//                 variant="outline"
//                 className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${geisilTheme.badgeClass}`}
//               >
//                 {geisilTheme.label}
//               </Badge>
//             )}
//           </div>
//           <Progress
//             value={loading ? 0 : Number(geisilScore)}
//             className={`h-1.5 bg-slate-100 dark:bg-slate-800 transition-all ${geisilTheme.progressClass}`}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProfileMetrics;

import React, { useEffect, useMemo, useState } from "react";
import API from "@/lib/axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react"; 

// Imported variables
import CibilLogo from "../../../../public/images/resource/Cibil Logo.png";
import EisilScoreLogo from "../../../../public/images/resource/Eisil Score Logo.png";

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

const ProfileMetrics = () => {
  const [profileProgress, setProfileProgress] = useState(0);
  const [geisilScore, setGeisilScore] = useState(0);
  const [cibilScore, setCibilScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMetricsData = async () => {
    try {
      setLoading(true);
      const [userDataRes, scoreRes] = await Promise.all([
        API.get("api/userdata/userdata"),
        API.get("api/userdata/getscore")
      ]);

      const progressValue = userDataRes.data?.progress ?? userDataRes.data?.data?.progress ?? 0;
      const scoreValue = scoreRes.data?.GeisilScore ?? scoreRes.data?.data?.GeisilScore ?? scoreRes.data?.score ?? scoreRes.data?.data?.score ?? 0;
      const cibilValue = scoreRes.data?.CibilScore ?? scoreRes.data?.data?.CibilScore ?? 0;

      setProfileProgress(Number(progressValue) || 0);
      setGeisilScore(Number(scoreValue) || 0);
      setCibilScore(Number(cibilValue) || 0);
    } catch (error) {
      console.error("Error fetching metrics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricsData();
  }, []);

  const profileTheme = useMemo(() => getStatusTheme(profileProgress), [profileProgress]);
  const geisilTheme = useMemo(() => getStatusTheme(geisilScore), [geisilScore]);
  
  const cibilPercentage = useMemo(() => {
    if (!cibilScore) return 0;
    const percentage = ((cibilScore - 300) / 600) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }, [cibilScore]);

  const cibilTheme = useMemo(() => getStatusTheme(cibilPercentage), [cibilPercentage]);

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-sm rounded-xl bg-white dark:bg-slate-950">
      <CardHeader className="pb-5">
        <CardTitle className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Account Status
        </CardTitle>
        <CardDescription className="text-xs text-slate-400 dark:text-slate-500">
          Overview of platform matching index and profile verification.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Metric Segment: Profile Completeness */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500">
                <User size={16} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-200">
                  Profile Completeness
                </h4>
                {!loading && (
                  <p className={`text-[10px] font-medium uppercase tracking-wider ${profileTheme.textClass}`}>
                    {profileTheme.label}
                  </p>
                )}
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {loading ? "—" : `${profileProgress}%`}
            </span>
          </div>
          <Progress
            value={loading ? 0 : Number(profileProgress)}
            className={`h-1 bg-slate-100 dark:bg-slate-900 transition-all ${profileTheme.progressClass}`}
          />
        </div>

        {/* Metric Segment: Geisil Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 relative flex items-center justify-center">
                <img 
                  src={EisilScoreLogo} /* Changed from static string to imported variable */
                  alt="Eisil Score" 
                  className="object-contain h-full w-full dark:invert" 
                />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-200">
                  Geisil Score
                </h4>
                {!loading && (
                  <p className={`text-[10px] font-medium uppercase tracking-wider ${geisilTheme.textClass}`}>
                    {geisilTheme.label}
                  </p>
                )}
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {loading ? "—" : `${geisilScore}%`}
            </span>
          </div>
          <Progress
            value={loading ? 0 : Number(geisilScore)}
            className={`h-1 bg-slate-100 dark:bg-slate-900 transition-all ${geisilTheme.progressClass}`}
          />
        </div>

        {/* Metric Segment: CIBIL Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-14 relative flex items-center justify-center">
                <img 
                  src={CibilLogo} /* Changed from static string to imported variable */
                  alt="Cibil" 
                  className="object-contain h-full w-full dark:invert" 
                />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-200">
                  CIBIL Score
                </h4>
                {!loading && (
                  <p className={`text-[10px] font-medium uppercase tracking-wider ${cibilTheme.textClass}`}>
                    {cibilTheme.label}
                  </p>
                )}
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {loading ? "—" : cibilScore}
            </span>
          </div>
          <Progress
            value={loading ? 0 : cibilPercentage}
            className={`h-1 bg-slate-100 dark:bg-slate-900 transition-all ${cibilTheme.progressClass}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileMetrics;