import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  user: any;
}

const AadhaarDetails = ({ user }: Props) => {
  const resp = user?.aadhaar_response;

  const isNotApplied = !resp;

  const isVerified =
    !!resp &&
    (resp?.response_code === "100" ||
      resp?.response_code === 100 ||
      resp?.status_code === 200);

  const profileImage =
    resp?.data?.profile_image || resp?.result?.user_profile_image;

  const fullName =
    resp?.data?.full_name || resp?.result?.user_full_name || "N/A";

  const aadhaarNumber =
    resp?.data?.aadhaar_number || resp?.result?.user_aadhaar_number || "N/A";

  // const dob = resp?.data?.dob || resp?.result?.user_dob || "N/A";
  const rawDob = resp?.data?.dob || resp?.result?.user_dob;
  const dob = rawDob
    ? new Date(rawDob).toLocaleDateString("en-GB").replace(/\//g, "-")
    : "N/A";

  const gender = resp?.data?.gender || resp?.result?.user_gender || "N/A";

  const address = [
    resp?.data?.address?.house || resp?.result?.user_address?.house,

    resp?.data?.address?.street || resp?.result?.user_address?.street,

    resp?.data?.address?.landmark || resp?.result?.user_address?.landmark,

    resp?.data?.address?.loc || resp?.result?.user_address?.loc,

    resp?.data?.address?.po || resp?.result?.user_address?.po,

    resp?.data?.address?.vtc || resp?.result?.user_address?.vtc,

    resp?.data?.address?.subdist || resp?.result?.user_address?.subdist,

    resp?.data?.address?.dist || resp?.result?.user_address?.dist,

    resp?.data?.address?.state || resp?.result?.user_address?.state,

    resp?.data?.address?.country || resp?.result?.user_address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const zipcode = resp?.data?.zip || resp?.result?.address_zip || "N/A";

  return (
    <Card id="aadhaar_response">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          Aadhaar Verification With OTP
          <img
            src={
              isNotApplied
                ? "/images/resource/na.png"
                : isVerified
                  ? "/images/resource/verified.png"
                  : "/images/resource/unverified.png"
            }
            alt="status"
            className="h-5 w-auto"
          />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={
                  profileImage
                    ? `data:image/jpeg;base64,${profileImage}`
                    : "/images/resource/no_user.png"
                }
                alt="Profile"
                className="w-52 h-60 object-cover rounded-xl border shadow-sm"
              />
            </div>

            <div className="mt-5 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                {fullName}
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                Aadhaar Holder
              </p>

              <div className="mt-4 inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-green-100 text-green-700">
                ✓ Verified Successfully
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-slate-50">
                <p className="text-xs uppercase text-muted-foreground">
                  Aadhaar Number
                </p>
                <p className="text-lg font-semibold mt-1">{aadhaarNumber}</p>
              </div>

              <div className="border rounded-lg p-4 bg-slate-50">
                <p className="text-xs uppercase text-muted-foreground">
                  Date of Birth
                </p>
                <p className="text-lg font-semibold mt-1">{dob}</p>
              </div>

              <div className="border rounded-lg p-4 bg-slate-50">
                <p className="text-xs uppercase text-muted-foreground">
                  Gender
                </p>
                <p className="text-lg font-semibold mt-1">{gender}</p>
              </div>

              <div className="border rounded-lg p-4 bg-slate-50">
                <p className="text-xs uppercase text-muted-foreground">
                  Verification Status
                </p>

                <p
                  className={`text-lg font-semibold mt-1 ${
                    isVerified ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isVerified ? "Verified" : "Unverified"}
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-slate-50 mt-4">
              <p className="text-xs uppercase text-muted-foreground mb-2">
                Residential Address
              </p>

              <p className="text-base leading-7">{address || "N/A"}</p>
            </div>

            <div className="border rounded-lg p-4 bg-slate-50 mt-4">
              <p className="text-xs uppercase text-muted-foreground mb-2">
                Postal Code
              </p>

              <p className="text-lg font-semibold">{zipcode}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AadhaarDetails;
