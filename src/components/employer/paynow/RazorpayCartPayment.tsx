import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

interface Props {
  amount: number;
  paymentIds: string;
  onSuccess: (
    response: any,
    amount: number,
    paymentIds: string
  ) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayCartPayment = ({
  amount,
  paymentIds,
  onSuccess,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

  useEffect(() => {
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      const response = await api.post(
        "/api/payment/create-order",
        {
          amount: parseFloat(amount.toString()),
        }
      );

      const orderId = response.data.order.id;

      const options = {
        key: razorpayKey,
        amount: response.data.order.amount,
        currency: "INR",
        name: "GEISIL",
        description: "Employee Verification Payment",
        order_id: orderId,

        handler: function (paymentResponse: any) {
          if (onSuccess) {
            onSuccess(
              paymentResponse,
              amount,
              paymentIds
            );
          }
        },

        prefill: {
          name: localStorage.getItem("name") || "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={!isLoaded || amount <= 0}
      size="lg"
    >
      {isLoaded ? `Pay ₹${amount.toFixed(2)}` : "Loading..."}
    </Button>
  );
};

export default RazorpayCartPayment;