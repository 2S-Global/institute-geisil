import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loading from "@/components/common/Loading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const OTPModal = ({ show,
  onClose,
  setReload,
  setError_main,
  setSuccess_main,
  phone }) => {
  const apiurl =  import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ otp: "" });
  const [resendTimer, setResendTimer] = useState(0);
  const [showOTPField, setShowOTPField] = useState(false);

  //const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("token");
const { toast } = useToast();
  if (!show) return null;

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setFormData({ otp: value });
    }
  };

  // First step: verify mobile number (send OTP)
  const handleVerifyNumber = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await API.post(
        `/api/userdata/candidate_phonenumber_verify`,
        { phone: phone }
      );

      if (response.data.success) {
        //setSuccess("OTP sent successfully!");
         toast({
        title: "Success",
        description: "OTP sent successfully!",
      });
        setShowOTPField(true);
        setResendTimer(60);
      } else {
        //setError(response.data.message || "Failed to send OTP.");
          toast({
        title: "Error",
        variant: "destructive",
        description: response.data.message || "Failed to send OTP.",
      });
      }
    } catch (err) {
      console.error(err);
      //setError("Failed to send OTP. Try again later.");
        toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to send OTP. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.otp || formData.otp.length < 4) {
      //setError("Please enter a valid OTP.");
       toast({
        title: "Error",
        variant: "destructive",
        description: "Please enter a valid OTP.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await API.post(
        `/api/userdata/verify-otp`,
        { otp: formData.otp },
      );

      if (response.data.success) {
        //setSuccess("OTP verified successfully!");
        //setSuccess_main("OTP verified successfully!");
             toast({
        title: "Success",
        description: "OTP verified successfully!",
      });
        setReload(true);
        setTimeout(() => onClose(), 1500);
      } else {
        //setError(response.data.message || "OTP verification failed.");
        //setError_main(response.data.message || "OTP verification failed.");
         toast({
        title: "Error",
        variant: "destructive",
        description: response.data.message || "OTP verification failed.",
      });
      }
    } catch (err) {
      console.error(err);
      //setError("Something went wrong. Please try again.");
      //setError_main("Something went wrong. Please try again.");
       toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await API.post(
        `/api/userdata/candidate_phonenumber_verify`,
        { phone: null }
      );

      if (response.data.success) {
        //setSuccess("OTP resent successfully!");
              toast({
        title: "Success",
        description:"OTP resent successfully!",
      });
        setResendTimer(30);
      } else {
        //setError(response.data.message || "Failed to resend OTP.");
          toast({
        title: "Error",
        variant: "destructive",
        description: response.data.message || "Failed to resend OTP.",
      });
      }
    } catch (err) {
      console.error(err);
      //setError("Failed to resend OTP. Try again later.");
        toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to resend OTP. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const maskPhone = (num) => {
    if (!num) return num;
    // Remove spaces just for processing
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.length < 10) return num;

    // Keep first 6 characters (+91 84), mask 5 digits, keep last 2 digits
    return (
      cleanNum.substring(0, 6) +
      "*****" +
      cleanNum.substring(cleanNum.length - 2)
    );
  };

  return (
<Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[450px]">

    {/* Header */}
    <DialogHeader>
      <DialogTitle className="font-display text-xl">
        Phone Number Verification
      </DialogTitle>

      <DialogDescription>
        Verify your phone number using OTP.
      </DialogDescription>
    </DialogHeader>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5 pt-2">

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Error Alert */}
          {error && (
            <div className="flex items-center justify-between rounded-md bg-red-50 p-3 text-sm text-red-600">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="flex items-center justify-between rounded-md bg-green-50 p-3 text-sm text-green-600">
              <span>{success}</span>

              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="text-green-500 hover:text-green-700"
              >
                ✕
              </button>
            </div>
          )}


          {/* Phone Number */}
          {!showOTPField && (
            <div className="flex items-center gap-2">

              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={maskPhone(phone)}
                readOnly
              />

              <Button
                type="button"
                variant="success"
                onClick={handleVerifyNumber}
                className="whitespace-nowrap"
              >
                Send OTP
              </Button>

            </div>
          )}


          {/* OTP Field */}
          {showOTPField && (
            <>

              <div className="space-y-1.5">

                <label className="text-sm font-medium">
                  OTP <span className="text-red-500">*</span>
                </label>

                <input
                  name="otp"
                  type="number"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  required
                />

              </div>


              {/* Buttons */}
              <div className="flex gap-2">

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Verify
                </Button>


                <Button
                  type="button"
                  variant={resendTimer > 0 ? "secondary" : "default"}
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </Button>

              </div>

            </>
          )}

        </>
      )}


      {/* Footer */}
      <DialogFooter>

        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>

      </DialogFooter>

    </form>

  </DialogContent>
</Dialog>
  );
};

export default OTPModal;
