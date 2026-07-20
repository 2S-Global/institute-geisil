import React, { useState } from "react";
import { CheckCircle, CircleX } from "lucide-react";
import RazorpayPayment from "./Razorpay";
import API from "../../../lib/axios";
import Swal from "sweetalert2";

const AadharCardInfo = ({
  userdata,
  openModalRH,
  setSectionloading,
  setError,
  setErrorId,
  setSuccess,
  setMessageId,
  setReload,
}) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [payment_Response, setPaymentResponse] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);

  // verify payment after Razorpay
  const handlePaymentSuccessAadhar = async (response) => {
    setSectionloading(true);
    setPaymentResponse(response);
    try {
      const res = await API.post(`${apiurl}/api/candidatekyc/verify-order`, {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (res?.data?.success) {
        setError(null);
        setErrorId(null);
        setSuccess(res.data.verificationResult?.message || res.data.message);
        setMessageId(Date.now());
        // setReload(true);
        setResendTimer(30);
        console.log("✅ Verified Order:", res.data.order);

        // show OTP modal after verification
        showOtpModal();
        startResendTimer();
      } else {
        setError(res.data.message);
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error("❌ Verification API Error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update KYC. Try again later.",
      );
      setErrorId(Date.now());
    } finally {
      setSectionloading(false);
    }
  };

  // resend OTP logic
  const handleResendOTP = async () => {
    console.log("OTP resent");
    if (payment_Response) {
      await handlePaymentSuccessAadhar(payment_Response);
    }
  };

  // submit OTP to backend
  const handleOTPSubmit = async (otp) => {
    //console.log("Submitting OTP:", otp);
    try {
      const res = await API.post(`${apiurl}/api/candidatekyc/verify-otp`, {
        otp,
      });

      if (res?.data?.success) {
        Swal.fire(
          "Success",
          res.data.message || "OTP Verified Successfully",
          "success",
        );

        if (typeof setReload === "function") {
          setReload((prev) => (typeof prev === "number" ? prev + 1 : 1));
        }
      } else {
        Swal.fire("❌ Failed", res.data.message, "error");
      }
    } catch (error) {
      Swal.fire(
        "❌ Error",
        error.response?.data?.message || "Failed to verify OTP",
        "error",
      );
    }
  };

  // SweetAlert2 OTP modal
  const showOtpModal = () => {
    let otpValue = "";

    Swal.fire({
      title: `<h3 class="mb-2 fw-semibold" style="color:#0f172a;">Enter OTP</h3>`,
      html: `
      <div class="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" style="font-size: 0.9rem;">
        <span style="color:#2563eb;">⚠️</span> <b style="color:#0f172a;">Do not refresh this page.</b>
      </div>
      <input type="text" id="otpInput" class="swal2-input" 
        placeholder="Enter 6-digit OTP" 
        style="text-align:center; font-size:1.1rem; letter-spacing:4px; border:1px solid #cbd5e1; border-radius:10px; padding:10px 12px; box-shadow:none;" />
      <button id="resendOtpBtn" class="w-100 mt-3 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600" ${
        resendTimer > 0 ? "disabled" : ""
      } style="${resendTimer > 0 ? "opacity:0.7; cursor:not-allowed;" : "cursor:pointer;"}">
        ${resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
      </button>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Verify OTP",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl shadow-xl border border-slate-200 p-4",
        confirmButton: "px-4 py-2 me-2 rounded-md",
        cancelButton: "px-4 py-2 rounded-md",
        title: "mb-3",
      },
      buttonsStyling: false,
      didRender: () => {
        const confirmBtn = document.querySelector('.swal2-confirm');
        const cancelBtn = document.querySelector('.swal2-cancel');
        if (confirmBtn) {
          confirmBtn.setAttribute('style', 'background:#2563eb;color:#fff;border:none;');
        }
        if (cancelBtn) {
          cancelBtn.setAttribute('style', 'background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;');
        }
      },
      preConfirm: () => {
        otpValue = document.getElementById("otpInput").value;
        if (!otpValue) {
          Swal.showValidationMessage("Please enter OTP");
        }
        return otpValue;
      },
      didOpen: () => {
        const resendBtn = document.getElementById("resendOtpBtn");
        resendBtn.addEventListener("click", async () => {
          if (resendTimer === 0) {
            await handleResendOTP();
            startResendTimer();
            Swal.showValidationMessage("✅ OTP resent successfully");
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleOTPSubmit(result.value);
      }
    });
  };

  // resend timer countdown
  const startResendTimer = () => {
    setResendTimer(30);
    let timeLeft = 30;

    const timerInterval = setInterval(() => {
      timeLeft -= 1;
      setResendTimer(timeLeft);

      const resendBtn = document.getElementById("resendOtpBtn");
      if (resendBtn) {
        resendBtn.innerText =
          timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP";
        resendBtn.disabled = timeLeft > 0;

        if (timeLeft > 0) {
          resendBtn.setAttribute(
            "style",
            "opacity:0.7; cursor:not-allowed; border:1px solid #cbd5e1; background:#fff; color:#334155;"
          );
        } else {
          resendBtn.setAttribute(
            "style",
            "cursor:pointer; border:1px solid #60a5fa; background:#eff6ff; color:#2563eb;"
          );
        }
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  };

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="text-base font-semibold text-slate-900">
            Aadhaar Number
          </span>

          {userdata?.aadhar_number &&
            (userdata?.aadhar_verified ? (
              <CheckCircle className="ml-2 h-4 w-4 text-green-600" />
            ) : (
              <>
                <CircleX className="ml-2 h-4 w-4 text-red-600" />
                <RazorpayPayment
                  onSuccess={handlePaymentSuccessAadhar}
                  documentType="aadhar"
                />
              </>
            ))}
        </div>

        <div className="text-sm">
          {userdata?.aadhar_number ? (
            <div className="text-slate-600 space-y-0.5">
              <div>
                <span className="font-medium text-slate-700">Name:</span>{" "}
                {userdata?.aadhar_name}
              </div>

              <div>
                <span className="font-medium text-slate-700">
                  Aadhaar Number:
                </span>{" "}
                {userdata?.aadhar_number}
              </div>
            </div>
          ) : (
            <span
              className="font-medium text-blue-600 cursor-pointer hover:underline"
              onClick={() => openModalRH("aadhar")}
            >
              Add Aadhaar Details
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default AadharCardInfo;
