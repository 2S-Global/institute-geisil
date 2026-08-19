// components/common/payments/RazorpayPayment.jsx
import React, { useEffect, useState } from "react";
import API from "../../../lib/axios";
import { Button } from "@/components/ui/button";
const RazorpayPayment = ({ onSuccess, documentType, feesType, text }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

  const [token, setToken] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [amount, setAmount] = useState(null);
  const [isPan, setIsPan] = useState();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);
  const panCheck = async () => {
    try {
      const res = await API.get(`/api/check/is-pan-added`);
      if (res?.data.data) {
        console.log("res1", res?.data?.data?.isPanAdded);
        setIsPan(res?.data?.data?.isPanAdded);
      }
    } catch (error) {
      console.log("");
    }
  };
  useEffect(() => {
    panCheck();
  }, []);
  const fetchFees = async () => {
    try {
      const response = await API.get(`/api/candidatekyc/fees/${feesType}`);
      if (response.data.success) {
        setAmount(Number(response.data.fees));
      }
    } catch (error) {
      console.error("❌ Error fetching fees:", error);
    }
  };

  useEffect(() => {
    if (token) fetchFees();
  }, [apiurl, token]);
  // Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setIsRazorpayLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!isRazorpayLoaded) return console.error("Razorpay SDK not loaded!");

    try {
      const response = await API.post(`/api/candidate/score/payment/create`, {
        type: documentType,
      });
      if (!response.data || !response.data.data) {
        throw new Error("Order creation failed");
      }
      const order = response.data.data;

      const options = {
        key: razorpayKey,
        amount: order.amount, // amount in paise from backend
        currency: "INR",
        name: "GEISIL",
        description: "Payment for Verification",
        order_id: order.orderId,
        handler: function (paymentResponse) {
          console.log("✅ Payment successful:", paymentResponse);
          if (onSuccess) onSuccess(paymentResponse, documentType);
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Error during order creation:", error);
    }
  };

  return (
    <>
      {isPan && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePayment}
          disabled={!isRazorpayLoaded || !amount}
          className="w-full mt-2 h-8 text-xs font-semibold rounded-lg
             bg-[#28406F] text-white border-[#28406F]
             hover:bg-[#1f3359] hover:text-white
             dark:bg-[#28406F] dark:text-white dark:border-[#28406F]
             dark:hover:bg-[#1f3359] dark:hover:text-white p-2"
        >
          {isRazorpayLoaded && amount
            ? `Pay ₹${amount.toFixed(2)} to verify ${text}`
            : "Loading..."}
        </Button>
      )}

      {!isPan && (
        <div className="relative group w-full mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            className="
        w-full p-2 h-8 text-xs font-semibold rounded-lg
        bg-[#28406F] text-white border-[#28406F]
        hover:bg-[#1f3359] hover:text-white
        dark:bg-[#28406F] dark:text-white dark:border-[#28406F]
      "
          >
            {isRazorpayLoaded && amount
              ? `Pay ₹${amount.toFixed(2)} to verify ${text}`
              : "Loading..."}
          </Button>

          {/* Professional Tooltip */}
          <div
            className="
        absolute bottom-full left-1/2 z-50
        mb-2 -translate-x-1/2
        w-max max-w-[90vw]
        rounded-md bg-gray-900
        px-3 py-2
        text-center text-xs font-medium text-white
        shadow-lg
        opacity-0 invisible
        transition-all duration-200
        group-hover:opacity-100
        group-hover:visible
      "
          >
            PAN number is required to continue with verification.
            {/* Arrow */}
            <div
              className="
          absolute left-1/2 top-full
          -translate-x-1/2
          border-4 border-transparent
          border-t-gray-900
        "
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RazorpayPayment;
