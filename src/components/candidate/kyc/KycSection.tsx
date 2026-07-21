import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import { CheckCircle, CircleX, Pencil, Plus } from "lucide-react";
import RazorpayPayment from "./Razorpay";
import AadharCardInfo from "./AadharCardInfo";
import KycModal from "./KycModal";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const KycSection = ({ show, onClose, data = {}, setRefresh }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
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
      const response = await API.get(`${apiurl}/api/candidatekyc/kyc`);
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
    document.body.style.overflow = "hidden";
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handelpaymentsuccess = async (response) => {
    setSectionloading(true);
    try {
      const res = await API.post(`${apiurl}/api/candidatekyc/verify-order`, {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (res.data.success) {
        if (res.data.verificationResult?.success) {
          //setSuccess(res.data.verificationResult?.message || res.data.message);
          setReload(true);
          toast({
            title: "Success",
            description:
              res.data.verificationResult?.message || res.data.message,
          });
        } else {
          toast({
            title: "Error",
            variant: "destructive",
            description:
              res.data.verificationResult?.message || res.data.message,
          });
        }
      } else {
        //setError(res.data.message);
        toast({
          title: "Error",
          variant: "destructive",
          description: res.data.message,
        });
      }
    } catch (error) {
      //setError("Failed to update KYC. Try again later.");
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update KYC.",
      });
    } finally {
      setSectionloading(false);
    }
  };

  // Determine if any KYC data has been added
  const hasKycData =
    userdata?.pan_number ||
    userdata?.dl_number ||
    userdata?.epic_number ||
    userdata?.aadhaar_number;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">KYC</CardTitle>
            <CardDescription>
              Verify your identity and official documents.
            </CardDescription>
          </div>

          {!sectionloading &&
            (hasKycData ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openModalRH("all")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => openModalRH("all")}>
                <Plus className=" h-4 w-4" /> Add KYC
              </Button>
            ))}
        </CardHeader>

        <CardContent className="pt-2">
          {sectionloading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-28 bg-muted" />
                  <Skeleton className="h-4 w-44 bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PAN CARD */}
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="text-base font-semibold text-slate-900">
                    PAN Number
                  </span>
                  {userdata?.pan_number &&
                    (userdata?.pan_verified ? (
                      <CheckCircle className="ml-2 text-green-600 h-4 w-4" />
                    ) : (
                      <>
                        <CircleX className="ml-2 text-red-600 h-4 w-4" />
                        <RazorpayPayment
                          onSuccess={handelpaymentsuccess}
                          documentType="pan"
                        />
                      </>
                    ))}
                </div>
                <div className="text-sm">
                  {userdata?.pan_number ? (
                    <div className="text-slate-600 space-y-0.5">
                      <div>
                        <span className="font-medium text-slate-700">
                          Name:
                        </span>{" "}
                        {userdata.pan_name}
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">PAN:</span>{" "}
                        {userdata.pan_number}
                      </div>
                    </div>
                  ) : (
                    <span
                      className="font-medium text-blue-600 cursor-pointer hover:underline"
                      onClick={() => openModalRH("pan")}
                    >
                      Add PAN info
                    </span>
                  )}
                </div>
              </div>

              {/* Driving License */}
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="text-base font-semibold text-slate-900">
                    Driving License
                  </span>
                  {userdata?.dl_number &&
                    (userdata?.dl_verified ? (
                      <CheckCircle className="ml-2 text-green-600 h-4 w-4" />
                    ) : (
                      <>
                        <CircleX className="ml-2 text-red-600 h-4 w-4" />
                        <RazorpayPayment
                          onSuccess={handelpaymentsuccess}
                          documentType="dl"
                        />
                      </>
                    ))}
                </div>
                <div className="text-sm">
                  {userdata?.dl_number ? (
                    <div className="text-slate-600 space-y-0.5">
                      <div>
                        <span className="font-medium text-slate-700">
                          Name:
                        </span>{" "}
                        {userdata.dl_name}
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">
                          DL Number:
                        </span>{" "}
                        {userdata.dl_number}
                      </div>
                    </div>
                  ) : (
                    <span
                      className="font-medium text-blue-600 cursor-pointer hover:underline"
                      onClick={() => openModalRH("dl")}
                    >
                      Add Driving License Info
                    </span>
                  )}
                </div>
              </div>

              {/* EPIC */}
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="text-base font-semibold text-slate-900">
                    EPIC Number
                  </span>
                  {userdata?.epic_number &&
                    (userdata?.epic_verified ? (
                      <CheckCircle className="ml-2 text-green-600 h-4 w-4" />
                    ) : (
                      <>
                        <CircleX className="ml-2 text-red-600 h-4 w-4" />
                        <RazorpayPayment
                          onSuccess={handelpaymentsuccess}
                          documentType="epic"
                        />
                      </>
                    ))}
                </div>
                <div className="text-sm">
                  {userdata?.epic_number ? (
                    <div className="text-slate-600 space-y-0.5">
                      <div>
                        <span className="font-medium text-slate-700">
                          Name:
                        </span>{" "}
                        {userdata.epic_name}
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">
                          EPIC Number:
                        </span>{" "}
                        {userdata.epic_number}
                      </div>
                    </div>
                  ) : (
                    <span
                      className="font-medium text-blue-600 cursor-pointer hover:underline"
                      onClick={() => openModalRH("epic")}
                    >
                      Add EPIC Details
                    </span>
                  )}
                </div>
              </div>

              {/* Aadhaar (Handled by your existing child component) */}
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
