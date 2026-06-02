import { useEffect, useState } from "react";
import { EmployerLayout } from "@/components/EmployerLayout";
import API from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

import RazorpayCartPayment from "@/components/employer/paynow/RazorpayCartPayment";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";

const PayNow = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPayments = async () => {
    try {
      const response = await API.get("/api/usercart/list_user_cart");

      if (response.data.success) {
        setPayments(response.data.data);

        setSubTotal(parseFloat(response.data.overall_billing.subtotal || 0));

        setGst(parseFloat(response.data.overall_billing.gst || 0));

        setTotal(parseFloat(response.data.overall_billing.total || 0));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await API.post("/api/usercart/deleteUser", { id });

      if (response.data.updatedCart?.success) {
        setPayments(response.data.updatedCart.data);

        setSubTotal(
          parseFloat(response.data.updatedCart.overall_billing.subtotal),
        );

        setGst(parseFloat(response.data.updatedCart.overall_billing.gst));

        setTotal(parseFloat(response.data.updatedCart.overall_billing.total));

        toast({
          title: "Success",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentSuccess = async (
    response: any,
    pay: number,
    pids: string,
  ) => {
    try {
      const paymentResponse = await api.post("/api/verify/paynow", {
        razorpay_response: response,
        amount: pay,
        paymentIds: pids,
      });

      if (paymentResponse.status === 200) {
        toast({
          title: "Success",
          description: paymentResponse.data.message || "Payment Successful",
        });

        navigate("/employer/download-center");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Payment failed",
        variant: "destructive",
      });
    }
  };

  const paymentIdsString = payments.map((item: any) => item.id).join(",");

  if (loading) {
    return (
      <EmployerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Loading payment details...</p>
          </div>
        </div>
      </EmployerLayout>
    );
  }

  const isEmpty = payments.length === 0;

  return (
    <EmployerLayout>
      <div className="space-y-4">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold">Payment Details</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and process your payment</p>
        </div>

        {isEmpty && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              No items in your cart. Add items to proceed with payment.
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Items Table */}
        {!isEmpty && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Mobile</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Service</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Amount</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {item.mobile || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {item.payFor}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-right text-primary">
                          ₹{parseFloat(item.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing Summary */}
        {!isEmpty && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-b pb-3">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Button Section */}
        {!isEmpty && (
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/employer/company")}
            >
              Cancel
            </Button>
            <RazorpayCartPayment
              amount={total}
              paymentIds={paymentIdsString}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        )}
      </div>
    </EmployerLayout>
  );
};

export default PayNow;
