import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import API from "../../../lib/axios";
import { YMD } from "../../../lib/utils";
import { Search, CheckCircle, CircleX, Pencil } from "lucide-react";
import Select from "react-select";
import LogoCoverUploader from "./LogoCoverUploader";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import KycModal from "./kycmodal";
import RazorpayPayment from "./Razorpay";
const Kyc = () => {
  const [companyData, setCompanyData] = useState(null);
  const [focusSection, setFocusSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [reload, setReload] = useState(false);
  const [sectionloading, setSectionloading] = useState(true);
  const apiurl = "";
  const token = localStorage.getItem("token");
const { toast } = useToast();
  useEffect(() => {
    FetchData();
  }, [token]);

  useEffect(() => {
    if (reload) {
      FetchData();
      setReload(false);
    }
  }, [reload]);

  const FetchData = async () => {
    setSectionloading(true);
    try {
      const response = await API.get(`/api/companykyc/kyc`);

      if (response.data.success) {
        setCompanyData(response.data.kyc);
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
      const res = await API.post(`/api/companykyc/verify-order`, {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (res.data.success) {
        setError(null);
        setErrorId(null);
        setSuccess(res.data.verificationResult?.message || res.data.message);
        setMessageId(Date.now());
        setReload(true);
        toast({
          title: res.data.verificationResult?.message.include('error')?"Error":"Success",
          description: res.data.verificationResult?.message || res.data.message,
        });
        console.log("✅ Verified Order:", res.data.order);
      } else {
        setError(res.data.message);
        setErrorId(Date.now());
         toast({
          title: "Error",
           variant: "destructive",
          description: res.data.message,
        });
      }
    } catch (error) {
      console.error("❌ Verification API Error:", error);
      setError("Failed to update KYC. Try again later.");
       toast({
          title: "Error",
           variant: "destructive",
          description: 'Failed to update KYC. Try again later.',
        });
      setErrorId(Date.now());
    } finally {
      setSectionloading(false);
    }
  };

  return (
    <>
      {sectionloading ? (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-white/75">
          "loading...."
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between">
            <h3 className="font-semibold tracking-tight text-lg font-display"></h3>
            <div>
              {" "}
              <Pencil
                className="cursor-pointer text-lg"
                onClick={() => openModalRH("all")}
              />
            </div>
          </div>

          {/* KYC Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* CIN */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <strong>Company CIN</strong>

                {companyData?.cin_number && (
                  <>
                    {companyData?.cin_verified ? (
                      <CheckCircle className="text-green-600" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <CircleX className="text-red-600" />

                        <RazorpayPayment
                          onSuccess={handelpaymentsuccess}
                          documentType="cin"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-2">
                {companyData?.cin_number ? (
                  <div className="text-gray-600" style={{ lineHeight: 1.7 }}>
                    <div>
                      <span className="font-semibold">Name :</span>{" "}
                      {companyData?.cin_name || "N/A"}
                    </div>

                    <div>
                      <span className="font-semibold">CIN Number:</span>{" "}
                      {companyData?.cin_number || "N/A"}
                    </div>
                  </div>
                ) : (
                  <span
                    className="cursor-pointer text-base font-bold text-blue-600"
                    onClick={() => openModalRH("cin")}
                  >
                    Add CIN info
                  </span>
                )}
              </div>
            </div>

            {/* GSTIN */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <strong>Company GSTIN</strong>

                {companyData?.gstin_number && (
                  <>
                    {companyData?.gstin_verified ? (
                      <CheckCircle className="text-green-600" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <CircleX className="text-red-600" />

                        <RazorpayPayment
                          onSuccess={handelpaymentsuccess}
                          documentType="gstin"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-2">
                {companyData?.gstin_number ? (
                  <div className="text-gray-600" style={{ lineHeight: 1.7 }}>
                    <div>
                      <span className="font-semibold">Name :</span>{" "}
                      {companyData?.gstin_name || "N/A"}
                    </div>

                    <div>
                      <span className="font-semibold">GSTIN Number:</span>{" "}
                      {companyData?.gstin_number || "N/A"}
                    </div>
                  </div>
                ) : (
                  <span
                    className="cursor-pointer text-base font-bold text-blue-600"
                    onClick={() => openModalRH("gstin")}
                  >
                    Add GSTIN info
                  </span>
                )}
              </div>
            </div>

            {/* PAN */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <strong>Company PAN</strong>

                {companyData?.pan_number && (
                  <>
                    {companyData?.pan_verified ? (
                      <CheckCircle className="text-green-600" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <CircleX className="text-red-600" />

                        <RazorpayPayment
                          onSuccess={handelpaymentsuccess}
                          documentType="pan"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-2">
                {companyData?.pan_number ? (
                  <div className="text-gray-600" style={{ lineHeight: 1.7 }}>
                    <div>
                      <span className="font-semibold">Name :</span>{" "}
                      {companyData?.pan_name || "N/A"}
                    </div>

                    <div>
                      <span className="font-semibold">PAN Number:</span>{" "}
                      {companyData?.pan_number || "N/A"}
                    </div>
                  </div>
                ) : (
                  <span
                    className="cursor-pointer text-base font-bold text-blue-600"
                    onClick={() => openModalRH("pan")}
                  >
                    Add PAN info
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

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
          data={companyData}
        />
      )}
    </>
  );
};

export default Kyc;
