import React, { useState } from "react";
import { CheckCircle, CircleX } from "lucide-react";
import RazorpayPayment from "./Razorpay";
import axios from "axios";
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
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const [payment_Response, setPaymentResponse] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);

  // verify payment after Razorpay
  const handlePaymentSuccessAadhar = async (response) => {
    setSectionloading(true);
    setPaymentResponse(response);
    try {
      const res = await axios.post(
        `${apiurl}/api/candidatekyc/verify-order`,
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        }
      );

      if (res.data.success) {
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
          "Failed to update KYC. Try again later."
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
      const res = await axios.post(
        `${apiurl}/api/candidatekyc/verify-otp`,
        { otp },
      
      );

      if (res.data.success) {
        Swal.fire(
          "Success",
          res.data.message || "OTP Verified Successfully",
          "success"
        );
        setReload(true);
      } else {
        Swal.fire("❌ Failed", res.data.message, "error");
      }
    } catch (error) {
      Swal.fire(
        "❌ Error",
        error.response?.data?.message || "Failed to verify OTP",
        "error"
      );
    }
  };

  // SweetAlert2 OTP modal
  const showOtpModal = () => {
    let otpValue = "";

    Swal.fire({
      title: `<h3 class="mb-2 text-dark fw-bold">Enter OTP</h3>`,
      html: `
      <div class="mb-3 p-2 rounded bg-light text-dark" style="font-size: 0.9rem;">
        ⚠️ <b>Do not refresh this page.</b>
      </div>
      <input type="text" id="otpInput" class="swal2-input" 
        placeholder="Enter 6-digit OTP" 
        style="text-align:center; font-size:1.2rem; letter-spacing:4px;" />
      <button id="resendOtpBtn" class="btn btn-outline-primary w-100 mt-3" ${
        resendTimer > 0 ? "disabled" : ""
      }>
        ${resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
      </button>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Verify OTP",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "p-4 rounded-4 shadow-lg",
        confirmButton: "btn btn-success px-4 py-2 me-2",
        cancelButton: "btn btn-secondary px-4 py-2",
        title: "mb-3",
      },
      buttonsStyling: false, // allow Bootstrap classes
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
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  };

  return (
   <>
  <div className="mb-6">
    <div className="flex items-center gap-2">
      <strong>Aadhar Card With OTP</strong>

      {userdata?.aadhar_number &&
        (userdata?.aadhar_verified ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <>
            <CircleX className="h-5 w-5 text-red-600" />
            <RazorpayPayment
              onSuccess={handlePaymentSuccessAadhar}
              documentType="aadhar"
            />
          </>
        ))}
    </div>

    <div className="mt-2">
      {userdata?.aadhar_number ? (
        <div className="leading-6 text-gray-600">
          <div>
            <span className="font-semibold">Aadhar Number:</span>{" "}
            {userdata?.aadhar_number}
          </div>
          <div>
            <span className="font-semibold">Aadhar Name:</span>{" "}
            {userdata?.aadhar_name}
          </div>
        </div>
      ) : (
        <span
          className="cursor-pointer font-semibold font-bold text-blue-600 hover:underline"
          onClick={() => openModalRH("aadhar")}
        >
          Add Aadhar Card With OTP Info
        </span>
      )}
    </div>
  </div>
</>
  );
};

export default AadharCardInfo;
