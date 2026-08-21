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
import CreditScoreGauge from "./SpeedoMeter";

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
          {/* Profile Completeness Section (Unwrapped & Compact) */}
          <div className="space-y-2 pb-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 flex-shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 truncate">
                  Profile Completeness
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {profileLoading ? (
                  <Skeleton className="h-5 w-12 rounded" />
                ) : (
                  <>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${profileTheme.textClass}`}>
                      {profileTheme.label}
                    </span>
                    <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50">
                      {profileProgress}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <Progress
              value={profileLoading ? 0 : Number(profileProgress)}
              className={`h-1.5 bg-slate-100 dark:bg-slate-900 transition-all ${profileTheme.progressClass}`}
            />
          </div>

          {/* Geisil Score Card */}
          {/* <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 sm:p-5 shadow-sm">
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
          </div> */}

          {/* CIBIL & Experian Scores (Responsive layout: flex-col on mobile, sm:flex-row on larger screens) */}
          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-6 sm:gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            {/* CIBIL Column */}
            <div className="flex-1 flex flex-col items-center text-center w-full">
              <div className="flex items-center gap-1.5 mb-2 justify-between w-full">
                <img
                  src={CibilLogo}
                  alt="CIBIL"
                  className="object-contain h-4 w-10 dark:invert"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {cibil?.Score || "—"}
                </span>
              </div>

              <div className="w-full flex justify-center py-2 min-h-[90px]">
                {scoresLoading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Skeleton className="h-[55px] w-[80px] rounded-t-full" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-3.5 w-14 rounded-full" />
                  </div>
                ) : (
                  <CreditScoreGauge score={cibil?.Score} size={180} />
                )}
              </div>

              <div className="mt-2 text-[9px] text-slate-500 dark:text-slate-400">
                Last checked: {cibil?.paymentDate ? toLocalDateTime(cibil?.paymentDate).split(",")[0] : "Never"}
              </div>

              <RazorpayPayment
                onSuccess={handlePaymentSuccess}
                documentType="CIBIL"
                text="CIBIL"
                feesType="cibil"
              />
            </div>

            {/* Separators: Vertical on tablet/desktop (sm:block), Horizontal on mobile (block sm:hidden) */}
            <Separator orientation="vertical" className="hidden sm:block h-auto bg-slate-200/80 dark:bg-slate-800 w-[1px]" />
            <Separator orientation="horizontal" className="block sm:hidden w-full bg-slate-200/80 dark:bg-slate-800 h-[1px] my-2" />

            {/* Experian Column */}
            <div className="flex-1 flex flex-col items-center text-center w-full">
              <div className="flex items-center gap-1.5 mb-2 justify-between w-full">
                <img
                  src={ExperianLogo}
                  alt="Experian"
                  className="object-contain h-4 w-10 dark:invert"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {experian?.Score || "—"}
                </span>
              </div>

              <div className="w-full flex justify-center py-2 min-h-[90px]">
                {scoresLoading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Skeleton className="h-[55px] w-[80px] rounded-t-full" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-3.5 w-14 rounded-full" />
                  </div>
                ) : (
                  <CreditScoreGauge score={experian?.Score} size={180} />
                )}
              </div>

              <div className="mt-2 text-[9px] text-slate-500 dark:text-slate-400">
                Last checked: {experian?.paymentDate ? toLocalDateTime(experian?.paymentDate).split(",")[0] : "Never"}
              </div>

              <RazorpayPayment
                onSuccess={handlePaymentSuccess}
                documentType="EXPERIAN"
                feesType="experian"
                text="Experian"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileMetrics;
