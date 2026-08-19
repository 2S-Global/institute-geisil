import React, { useMemo, useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import API from "../../../lib/axios";
import RazorpayPayment from "@/components/candidate/score/Razorpay";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import { toLocalDateTime } from "../../../utils/utils";

// Imported variables
import CibilLogo from "../../../../public/images/resource/Cibil Logo.png";
import ExperianLogo from "../../../../public/images/resource/EXPGF_BIG.png";
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
    label: "Poor",
    textClass: "text-slate-400 dark:text-slate-500",
    progressClass: "[&>div]:bg-slate-400 dark:[&>div]:bg-slate-600",
  };
};

const ProfileMetrics = ({ refresh = 0 }: { refresh?: number }) => {
  const [reload, setReload] = useState(false);
  const [sectionloading, setSectionloading] = useState(true);
  const [cibil, setCibil] = useState();
  const [experian, setExperian] = useState();
  const { toast } = useToast();
  const {
    profileProgress,
    geisilScore,
    cibilScore,
    profileLoading,
    scoresLoading,
  } = useProfileMetrics(refresh);

  const profileTheme = useMemo(
    () => getStatusTheme(profileProgress),
    [profileProgress],
  );
  const geisilTheme = useMemo(() => getStatusTheme(geisilScore), [geisilScore]);

  const cibilPercentage = useMemo(() => {
    if (!cibil?.Score) return 0;
    const percentage = ((cibil?.Score - 300) / 600) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }, [cibil?.Score]);

  const cibilTheme = useMemo(
    () => getStatusTheme(cibilPercentage),
    [cibilPercentage],
  );
  console.log("cibilPercentage", cibilPercentage);
  console.log("cibilTheme", cibilTheme);

  const experianPercentage = useMemo(() => {
    if (!experian?.Score) return 0;
    const percentage = ((experian?.Score - 300) / 600) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  }, [experian?.Score]);

  const experianTheme = useMemo(
    () => getStatusTheme(experianPercentage),
    [experianPercentage],
  );

  const handlePaymentSuccess = async (response, documentType) => {
    setSectionloading(true);
    try {
      const res = await API.post(`/api/candidate/score/credit-report/verify`, {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        type: documentType,
      });

      if (res.data.success) {
        setReload(true);
        scoreData();
        toast({
          title: "Success",
          description: res.data.message,
        });
      } else {
        //setError(res.data.message);
        toast({
          title: "Error",
          variant: "destructive",
          description: res.data.message,
        });
      }
    } catch (error) {
      //setError("Failed to update KYC. Try again later.");
      toast({
        title: "Error",
        variant: "destructive",
        description: `Failed try again later`,
      });
    } finally {
      setSectionloading(false);
    }
  };
  const scoreData = async () => {
    try {
      const res1 = await API.get(`/api/candidate/score/my-score/CIBIL`);
      const res2 = await API.get(`/api/candidate/score/my-score/EXPERIAN`);

      if (res1?.data.data) {
        console.log("res1", res1?.data?.data);
        setCibil(res1?.data.data);
      }
      if (res2?.data.data) {
        console.log("res2", res2?.data.data);
        setExperian(res2?.data.data);
      }
    } catch (error) {
      console.log("");
    }
  };
  useEffect(() => {
    scoreData();
  }, []);
  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm w-full rounded-xl bg-white dark:bg-slate-950 transition-all">
      <CardHeader className="pb-4 sm:pb-5 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-sm sm:text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Account Status
        </CardTitle>

        <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Overview of platform matching index and profile verification.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-5 sm:pb-6">
        <div className="space-y-4 sm:space-y-5">
          {/* Profile Completeness Card */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5 shadow-sm">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex-shrink-0">
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
                className={`h-1.5 bg-slate-200/70 dark:bg-slate-800 transition-all ${profileTheme.progressClass}`}
              />
            </div>
          </div>

          {/* Geisil Score Card */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5 shadow-sm">
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
                    {geisilScore}
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
                className={`h-1.5 bg-slate-200/70 dark:bg-slate-800 transition-all ${geisilTheme.progressClass}`}
              />
            </div>
          </div>

          {/* CIBIL Score Card */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5 shadow-sm">
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
                    {cibil?.Score || 0}
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
                value={!cibil?.Score ? 0 : cibilPercentage}
                className={`h-1.5 bg-slate-200/70 dark:bg-slate-800 transition-all ${cibilTheme.progressClass}`}
              />

              {/* Last CIBIL Check */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Last checked
                </span>

                {scoresLoading ? (
                  <Skeleton className="h-3 w-24 rounded" />
                ) : (
                  <span className="text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300">
                    {cibil?.paymentDate
                      ? toLocalDateTime(cibil?.paymentDate)
                      : "Not checked yet"}
                  </span>
                )}
              </div>

              {/* Payment */}
              <RazorpayPayment
                onSuccess={handlePaymentSuccess}
                documentType="CIBIL"
                text="for Latest CIBIL Score"
                feesType="cibil"
              />
            </div>
          </div>

          {/* Experian Score Card */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5 shadow-sm">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="h-5 w-12 sm:w-14 relative flex items-center justify-center flex-shrink-0">
                    <img
                      src={ExperianLogo}
                      alt="Experian"
                      className="object-contain h-full w-full dark:invert"
                    />
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 truncate">
                    Experian Score
                  </h4>
                </div>

                {scoresLoading ? (
                  <Skeleton className="h-6 w-12 rounded" />
                ) : (
                  <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 flex-shrink-0">
                    {experian?.Score || 0}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-h-[16px]">
                {scoresLoading ? (
                  <Skeleton className="h-3 w-16 rounded" />
                ) : (
                  <p className={experianTheme.textClass}>
                    {experianTheme.label}
                  </p>
                )}
              </div>

              <Progress
                value={!experian?.Score ? 0 : experianPercentage}
                className={`h-1.5 bg-slate-200/70 dark:bg-slate-800 transition-all ${experianTheme.progressClass}`}
              />

              {/* Last Experian Check */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Last checked
                </span>

                {scoresLoading ? (
                  <Skeleton className="h-3 w-24 rounded" />
                ) : (
                  <span className="text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300">
                    {experian?.paymentDate
                      ? toLocalDateTime(experian?.paymentDate)
                      : "Not checked yet"}
                  </span>
                )}
              </div>

              {/* Payment */}
              <RazorpayPayment
                onSuccess={handlePaymentSuccess}
                documentType="EXPERIAN"
                feesType="experian"
                text="for Latest Experian Score"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileMetrics;
