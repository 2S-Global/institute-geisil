// components/common/payments/RazorpayPayment.jsx
import React, { useEffect, useState } from "react";
import API from "../../../lib/axios";
import { Button } from "@/components/ui/button";
const RazorpayPayment = ({ onSuccess, documentType, text }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

  const [token, setToken] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

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
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handlePayment}
        disabled={!isRazorpayLoaded}
        className="w-full mt-2 h-8 text-xs font-semibold rounded-lg
             bg-[#28406F] text-white border-[#28406F]
             hover:bg-[#1f3359] hover:text-white
             dark:bg-[#28406F] dark:text-white dark:border-[#28406F]
             dark:hover:bg-[#1f3359] dark:hover:text-white"
      >
        {text}
      </Button>
    </>
  );
};

export default RazorpayPayment;
