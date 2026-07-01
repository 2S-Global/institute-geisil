// components/common/payments/RazorpayPayment.jsx
import React, { useEffect, useState } from "react";
import API from "../../../lib/axios";

const RazorpayPayment = ({ onSuccess, documentType }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

  const [token, setToken] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const fetchFees = async () => {
    try {
      const response = await API.get(
        `/api/candidatekyc/fees/${documentType}`
      );
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
      const response = await API.post(
        `${apiurl}/api/candidatekyc/create-order`,
        { documentType }
      );

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
        order_id: order.id,
        handler: function (paymentResponse) {
          console.log("✅ Payment successful:", paymentResponse);
          if (onSuccess) onSuccess(paymentResponse);
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
    <button
      className="btn btn-primary ms-2"
      style={{
        fontSize: "10px",
        padding: "2px 6px",
        lineHeight: 1,
      }}
      onClick={handlePayment}
      disabled={!isRazorpayLoaded || !amount}
    >
      {isRazorpayLoaded && amount
        ? `Pay ₹${amount.toFixed(2)} to verify`
        : "Loading..."}
    </button>
  );
};

export default RazorpayPayment;
