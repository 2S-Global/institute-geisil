import api from "@/lib/axios";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, MapPin, Users, Clock,Trash2 } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import AsyncCreatableSelect from "react-select/async-creatable";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "react-select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams ,useNavigate} from "react-router-dom";
const styles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  draft: "bg-warning/10 text-warning border-warning/20",
};
import AadharForm from "@/components/employer/aadharVerification/AadharForm"
import RazorpayPayment from "@/components/employer/aadharVerification/RazorpayPayment"
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "7px",
    borderRadius: "10px",
  }),
  /*  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#1e1e1e",
    borderColor: state.isFocused ? "#00bcd4" : "#444",
    color: "white",
    padding: "10px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#00bcd4",
    },
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: "#2a2a2a",
    color: "white",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#00bcd4"
      : state.isFocused
      ? "#444"
      : "#2a2a2a",
    color: "white",
    cursor: "pointer",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }), */
};
export default function AadharVerification() {
  const { toast } = useToast();
  const router = useNavigate();
  const params = useParams(); // for dynamic route parts like [jobId]
  //razor pay
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
  const [otp, setOtp] = useState("");
  const [request_id, setRequest_id] = useState("");
  const [newId, setNewId] = useState("");
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessage_id] = useState(null);
  const [formsubmitted, setFormsubmitted] = useState(false);
  //const router = useRouter();
  //rendering
  const [renderForm, setRenderForm] = useState(true);
  const [renderBill, setRenderBill] = useState(false);
  const [renderotp, setRenderotp] = useState(false);

  /* Billing part */
  const [paymentmethod, setPaymentmethod] = useState("online");
  const [subTotal, setSubTotal] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [sgstPercentage, setSgstPercentage] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [cgstPercentage, setCgstPercentage] = useState(0);
  const [payments, setPayments] = useState([]);
  const [overall_billing, setOverallBilling] = useState({});

  const [total, setTotal] = useState(0);

  const [walletBalance, setWalletBalance] = useState(0);
  const handlePaymentSuccess = async (response, pay, pids) => {
    setLoading(true);
    console.log("From handlePaymentSuccess response", response);
    console.log("From handlePaymentSuccess pay", pay);
    console.log("From handlePaymentSuccess pids", pids);

    try {
      const paymentResponse = await api.post(
        `/api/verify/paynowAadharOTP`,
        {
          razorpay_response: response,
          amount: pay,
          payment_method: paymentmethod,
          paymentIds: pids,
          overall_billing: overall_billing,
        }
      );
      console.log("From handlePaymentSuccess paymentResponse", paymentResponse);

      /* if code 200 */
      if (paymentResponse.status === 200) {
        setSuccess(
          "Your payment has been successfully processed. An invoice will be sent to your registered email shortly.Kindly Enter Your Aadhar OTP.",
        );
        setMessage_id(Date.now());
        setNewId(paymentResponse.data.newId);
        setPayments([]);
        setRequest_id(paymentResponse.data.aadhar_response.request_id);
        setRenderBill(false);
        setRenderForm(false);
        setRenderotp(true);
        setLoading(false);
        setResendTimer(60);
      }
    } catch (err) {
      setError("Error processing payment. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const handlefree = async (pay, pids) => {
    setLoading(true);
    console.log("From handlePaymentSuccess pay", pay);
    console.log("From handlePaymentSuccess pids", pids);

    try {
      const paymentResponse = await api.post(
        `/api/verify/paynowaadharotpfree`,
        {
          amount: pay,
          payment_method: "Free",
          paymentIds: pids,
          overall_billing: overall_billing,
        }
      );
      console.log("From handlePaymentSuccess paymentResponse", paymentResponse);

      /* if code 200 */
      if (paymentResponse.status === 200) {
        setSuccess(
          "Your payment has been successfully processed. An invoice will be sent to your registered email shortly.Kindly Enter Your Aadhar OTP.",
        );
        setMessage_id(Date.now());
        setNewId(paymentResponse.data.newId);
        setPayments([]);
        setRequest_id(paymentResponse.data.aadhar_response.request_id);
        setRenderBill(false);
        setRenderForm(false);
        setRenderotp(true);
        setLoading(false);
        setResendTimer(60);
      }
    } catch (err) {
      setError("Error processing payment. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setRenderBill(false);
      try {
        const response = await api.get(
          `/api/usercart/list_user_cart_aadhar_otp`
        );
        //   console.log("From useEffect fetchPayments response", response);

        if (response.data.success) {
          setOverallBilling(response.data.billing || {});
          const paymentData = response.data.data;
          const billing = response.data.billing;

          setPayments(paymentData);

          setSubTotal(parseFloat(billing.subtotal) || 0);
          setTotal(parseFloat(billing.total) || 0);
          setDiscount(parseFloat(billing.discount) || 0);
          setDiscountPercentage(parseFloat(billing.discount_percent) || 0);
          setSgst(parseFloat(billing.sgst) || 0);
          setSgstPercentage(parseFloat(billing.sgst_percent) || 0);
          setCgst(parseFloat(billing.cgst) || 0);
          setCgstPercentage(parseFloat(billing.cgst_percent) || 0);
          setWalletBalance(parseFloat(billing.wallet_amount) || 0);
          if (paymentData.length !== 0) {
            setRenderForm(false);
            setRenderBill(true);
          }
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []); // ← runs only once on mount

  const setPaymentvalues = async () => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        setRenderForm(false);
        const response = await api.get(
          `/api/usercart/list_user_cart_aadhar_otp`
        );

        if (response.data.success) {
          setOverallBilling(response.data.billing || {});
          setPayments(response.data.data);
          setSubTotal(parseFloat(response.data.billing.subtotal) || 0);
          setTotal(parseFloat(response.data.billing.total) || 0);
          setDiscount(parseFloat(response.data.billing.discount) || 0);
          setDiscountPercentage(
            parseFloat(response.data.billing.discount_percent) || 0,
          );
          setSgst(parseFloat(response.data.billing.sgst) || 0);
          setSgstPercentage(
            parseFloat(response.data.billing.sgst_percent) || 0,
          );
          setCgst(parseFloat(response.data.billing.cgst) || 0);
          setCgstPercentage(
            parseFloat(response.data.billing.cgst_percent) || 0,
          );
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err); // Debugging
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
        setRenderBill(true);
      }
    };

    fetchPayments();
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting OTP:", otp);
    console.log("request_id:", request_id);
    console.log("newId:", newId);

    try {
      const response = await api.post(
        `/api/verify/verifyOtpAadhar`,
        {
          otp: otp,
          request_id: request_id,
          newId: newId,
        }
      );

      console.log("From handleOTPSubmit response", response);

      if (response.data.success) {
        setSuccess(response.data.message);
        setMessage_id(Date.now());
        setRenderotp(false);
        setRenderForm(false);
        setRenderBill(false);
        setPayments([]);
        setRequest_id("");
        setOtp("");
        setTimeout(() => {
          router("/employer/download-center");
        }, 5000);
      } else {
        console.log("Error submitting OTP:", response.data.message);
        setError(response.data.message || "Invalid OTP. Please try again.");
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error("Error submitting OTP:", err);
      setError("Error submitting OTP. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;
    setLoading(true);
    console.log("Deleting payment with ID:", id);
    try {
      setLoading(true);
      const Dlt_response = await api.post(
        `/api/usercart/deleteUserAadharOTP`,
        { id }
      );

      if (Dlt_response.data.success) {
        setSubTotal(0);
        setPayments([]);
        setTotal(0);
        setDiscount(0);
        setDiscountPercentage(0);
        setSgst(0);
        setSgstPercentage(0);
        setCgst(0);
        setCgstPercentage(0);

        setSuccess(Dlt_response.data.message);
        setMessage_id(Date.now());
      }

      setRenderForm(true);
      setRenderBill(false);
      setFormsubmitted(false);
    } catch (err) {
      console.error("Error deleting payment:", err);
      setError("Error deleting payment. Please try again.");
      setErrorId(Date.now());
    }
    setLoading(false);
  };
  const paymentIdsString = payments.map((payment) => payment._id).join(", ");
  //console.log("Payment IDs:", paymentIdsString);
  const [resendTimer, setResendTimer] = useState(60);

  // Countdown for resend button
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResendOTP = async () => {
    console.log("OTP resent");

    setLoading(true);
    try {
      const response = await api.post(
        `/api/verify/resendAadharOTP`,
        {},
      );

      console.log("From handleResendOTP response", response);

      if (response.data.success) {
        setSuccess(response.data.message);
        setMessage_id(Date.now());
        setOtp(""); // Clear the OTP input
        setNewId(response.data.newId);
        setPayments([]);
        setRequest_id(response.data.aadhar_response.request_id);
      } else {
        setError(response.data.message || "Failed to resend OTP.");
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError("Error resending OTP. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
      setResendTimer(60);
    }
  };

  return (
    <EmployerLayout>
      <PageHeader title="Verify Aadhar with OTP" description="" actions={""} />
      <Card className="p-4 mb-4 border-border/60 shadow-sm">
        <div className="relative">
           <>
 

  {loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="mx-auto px-4">
      {renderForm && (
        <AadharForm
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
          setErrorId={setErrorId}
          success={success}
          setMessage_id={setMessage_id}
          setSuccess={setSuccess}
          setRenderBill={setRenderBill}
          setRenderForm={setRenderForm}
          setFormsubmitted={setFormsubmitted}
          formsubmitted={formsubmitted}
          setPaymentvalues={setPaymentvalues}
        />
      )}

      {renderBill ? (
        <>
          <div className="overflow-x-auto pt-10">
            <table className="min-w-full border border-gray-300 ">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-center">#</th>
                  <th className="border p-2 text-center">Name</th>
                  <th className="border p-2 text-center">Mobile Number</th>
                  <th className="border p-2 text-center">Pay For</th>
                  <th className="border p-2 text-center">Amount</th>
                  <th className="border p-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <tr key={payment._id}>
                      <td className="border p-2 text-center">
                        {index + 1}
                      </td>

                      <td className="border p-2 text-center">
                        {payment.candidate_name}
                      </td>

                      <td className="border p-2 text-center">
                        {payment.candidate_mobile || "N/A"}
                      </td>

                      <td className="border p-2 text-center">
                        Aadhar
                      </td>

                      <td className="border p-2 text-center">
                        {total?.toFixed(2)} INR
                      </td>

                      <td className="p-2 flex justify-center items-center">
                        <Trash2
                          size={16}
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDelete(payment._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      
                      className="border p-4 text-center"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded bg-gray-100 p-4">
            <p className="mb-1 flex justify-between">
              <span>Sub-Total :</span>
              <span>{subTotal?.toFixed(2)} INR</span>
            </p>

            <p className="mb-1 flex justify-between">
              <span>Discount ({discountPercentage}%) :</span>
              <span>- {discount?.toFixed(2)} INR</span>
            </p>

            <p className="mb-1 flex justify-between">
              <span>SGST ({sgstPercentage}%) :</span>
              <span>{sgst?.toFixed(2)} INR</span>
            </p>

            <p className="mb-1 flex justify-between">
              <span>CGST ({cgstPercentage}%) :</span>
              <span>{cgst?.toFixed(2)} INR</span>
            </p>

            <p className="flex justify-between text-xl font-bold">
              <span>Total :</span>
              <span>{total?.toFixed(2)} INR</span>
            </p>
          </div>

          <div className="mt-3">
            {role == "2" && total > 0 && (
              <div className="flex items-center justify-end gap-2">
                <label htmlFor="paymentmethod" className="mb-0">
                  Payment Method:
                </label>

                <select
                  className="w-auto rounded border border-gray-300 px-3 py-2"
                  id="paymentmethod"
                  value={paymentmethod}
                  onChange={(e) => setPaymentmethod(e.target.value)}
                  required
                >
                  <option value="online">Online</option>
                </select>
              </div>
            )}

            <div className="mt-3 flex justify-end gap-2">
              {total === 0 ? (
                <div className="mt-3 flex items-stretch gap-3">
                  <div className="mb-0 flex flex-grow items-center rounded border bg-gray-50 px-4 py-3 shadow-sm">
                    <span className="text-[15px] text-gray-600">
                      <strong>You're on our completely free plan</strong> — no
                      payment is needed. Please continue to complete the
                      verification.
                    </span>
                  </div>

                  <button
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() =>
                      handlefree(total, paymentIdsString)
                    }
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <>
                  {paymentmethod === "Wallet" && (
                    <>
                      {total > walletBalance ? (
                        <div
                          className="rounded border border-yellow-300 bg-yellow-100 px-4 py-3 text-yellow-800"
                          role="alert"
                        >
                          Your Credit balance is too low to make payment.
                          Please contact admin.
                        </div>
                      ) : (
                        <button
                          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={payments.length === 0}
                          onClick={() =>
                            handlePaymentSuccess(
                              null,
                              total,
                              paymentIdsString
                            )
                          }
                        >
                          Pay with Credit Balance (
                          {total?.toFixed(2)} INR)
                        </button>
                      )}
                    </>
                  )}

                  {paymentmethod === "online" && (
                    <RazorpayPayment
                      amount={total}
                      razorpayKey={razorpayKey}
                      onSuccess={handlePaymentSuccess}
                      paymentIds={paymentIdsString}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </>
      ) : null}

      {renderotp && (
        <form onSubmit={handleOTPSubmit} className="pt-10">
          <div className="mb-3 rounded border border-yellow-300 bg-yellow-100 p-2 text-yellow-800">
            ⚠️ Do not refresh this page.
          </div>

          <div className="mb-4">
            <label htmlFor="otp" className="mb-2 block">
              Enter OTP
            </label>

            <input
              type="text"
              id="otp"
              name="otp"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Verify OTP
          </button>

          <button
            type="button"
            className={`ml-2 mt-3 rounded px-4 py-2 text-white ${
              resendTimer > 0
                ? "bg-gray-500"
                : "bg-green-600 hover:bg-green-700"
            }`}
            onClick={handleResendOTP}
            disabled={resendTimer > 0}
          >
            {resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : "Resend OTP"}
          </button>
        </form>
      )}
    </div>
  )}
           </>
         
        </div>
      </Card>
    </EmployerLayout>
  );
}
