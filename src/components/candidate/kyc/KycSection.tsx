import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import { CheckCircle, CircleX, Pencil } from "lucide-react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import RazorpayPayment from "./Razorpay"
import AadharCardInfo from "./AadharCardInfo"
import KycModal from "./KycModal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import KycBox from "./KycBox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
const KycSection = ({ show, onClose, data = {}, setRefresh
}) => {
  const apiurl = import.meta.env.VITE_API_URL;
  // console.log("show",show)
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("token");
  const [focusSection, setFocusSection] = useState(null);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [reload, setReload] = useState(false);
  const [sectionloading, setSectionloading] = useState(true);

  const [userdata, setUserdata] = useState(null);
  const { toast } = useToast();
  useEffect(() => {
    if (reload) {
      FetchData();
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    FetchData();
  }, [token]);

  const FetchData = async () => {
    setSectionloading(true);
    try {
      const response = await API.get(`${apiurl}/api/candidatekyc/kyc`)
      if (response.data.success) {
        setUserdata(response.data.kyc);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  };

  const openModalRH = (type) => {
    setFocusSection(type);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  const handelpaymentsuccess = async (response) => {
    setSectionloading(true);
    try {
      const res = await API.post(
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
        setReload(true);
        toast({
          title: "Success",
          description: res.data.verificationResult?.message || res.data.message,
        });
        console.log("✅ Verified Order:", res.data.order);
      } else {
        setError(res.data.message);
        toast({
          title: "Error",
          variant: "destructive",
          description: res.data.message,
        })
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error("❌ Verification API Error:", error);
      setError("Failed to update KYC. Try again later.");
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update KYC. Try again later.",
      })
      setErrorId(Date.now());
    } finally {
      setSectionloading(false);
    }
  };
  //if (!show) return null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">KYC</CardTitle>
            <CardDescription>Verify your identity and official documents.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => openModalRH("all")}><Pencil className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent>
          {sectionloading ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-transparent"
                style={{ borderTopColor: "#223B6B" }}
              ></div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PAN CARD */}
                <div>
                  <div className="flex items-center">
                    <strong>PAN Number</strong>

                    {userdata?.pan_number && (
                      <>
                        {userdata?.pan_verified ? (
                          <CheckCircle className="ml-2 text-green-600" />
                        ) : (
                          <>
                            <CircleX className="ml-2 text-red-600" />

                            <RazorpayPayment
                              onSuccess={handelpaymentsuccess}
                              documentType="pan"
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-2">
                    {userdata?.pan_number ? (
                      <div className="text-gray-600 space-y-1">
                        <div>
                          <span className="font-semibold">Name:</span>{" "}
                          {userdata?.pan_name}
                        </div>

                        <div>
                          <span className="font-semibold">PAN Number:</span>{" "}
                          {userdata?.pan_number}
                        </div>
                      </div>
                    ) : (
                      <span
                        className="font-semibold text-blue-600 cursor-pointer"
                        onClick={() => openModalRH("pan")}
                      >
                        Add PAN info
                      </span>
                    )}
                  </div>
                </div>

                {/* DRIVING LICENSE */}
                <div>
                  <div className="flex items-center">
                    <strong>Driving License</strong>

                    {userdata?.dl_number && (
                      <>
                        {userdata?.dl_verified ? (
                          <CheckCircle className="ml-2 text-green-600" />
                        ) : (
                          <>
                            <CircleX className="ml-2 text-red-600" />

                            <RazorpayPayment
                              onSuccess={handelpaymentsuccess}
                              documentType="dl"
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-2">
                    {userdata?.dl_number ? (
                      <div className="text-gray-600 space-y-1">
                        <div>
                          <span className="font-semibold">Name:</span>{" "}
                          {userdata?.dl_name}
                        </div>

                        <div>
                          <span className="font-semibold">DL Number:</span>{" "}
                          {userdata?.dl_number}
                        </div>

                        <div>
                          <span className="font-semibold">DOB:</span>{" "}
                          {userdata?.dl_dob &&
                            new Date(userdata.dl_dob).toLocaleDateString("en-GB")}
                        </div>
                      </div>
                    ) : (
                      <span
                        className="font-semibold text-blue-600 cursor-pointer"
                        onClick={() => openModalRH("dl")}
                      >
                        Add Driving License Info
                      </span>
                    )}
                  </div>
                </div>

                {/* EPIC */}
                <div>
                  <div className="flex items-center">
                    <strong>EPIC Number</strong>

                    {userdata?.epic_number && (
                      <>
                        {userdata?.epic_verified ? (
                          <CheckCircle className="ml-2 text-green-600" />
                        ) : (
                          <>
                            <CircleX className="ml-2 text-red-600" />

                            <RazorpayPayment
                              onSuccess={handelpaymentsuccess}
                              documentType="epic"
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-2">
                    {userdata?.epic_number ? (
                      <div className="text-gray-600 space-y-1">
                        <div>
                          <span className="font-semibold">Name:</span>{" "}
                          {userdata?.epic_name}
                        </div>

                        <div>
                          <span className="font-semibold">EPIC Number:</span>{" "}
                          {userdata?.epic_number}
                        </div>
                      </div>
                    ) : (
                      <span
                        className="font-semibold text-blue-600 cursor-pointer"
                        onClick={() => openModalRH("epic")}
                      >
                        Add EPIC Details
                      </span>
                    )}
                  </div>
                </div>

                {/* Aadhaar */}
                <AadharCardInfo
                  userdata={userdata}
                  openModalRH={openModalRH}
                  setSectionloading={setSectionloading}
                  setError={setError}
                  setErrorId={setErrorId}
                  setSuccess={setSuccess}
                  setMessageId={setMessageId}
                  setReload={setReload}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>


      {isModalOpen && (
        <KycModal
          show={isModalOpen}
          onClose={closeModalRH}
          setError={setError}
          setSuccess={setSuccess}
          setMessageId={setMessageId}
          setErrorId={setErrorId}
          setReload={setReload}
          focusSection={focusSection}
          data={userdata}
        />
      )}
    </>
  );
};

export default KycSection;
