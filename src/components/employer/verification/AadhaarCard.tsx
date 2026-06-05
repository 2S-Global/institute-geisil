import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface Props {
  user: any;
}

const AadhaarCard = ({ user }: Props) => {
  const resp = user?.aadhaar_response;

  const isNotApplied = !resp;

  const isVerified = !!resp && (
    resp?.response_code === "100" ||
    resp?.response_code === 100 ||
    resp?.status_code === 200
  );

  return (
    <Card id="aadhaar_response">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          Aadhaar

          <img
            src={
              isNotApplied
                ? "/images/resource/na.png"
                : isVerified
                  ? "/images/resource/verified.png"
                  : "/images/resource/unverified.png"
            }
            alt={isNotApplied ? "Not Applied" : isVerified ? "Verified" : "Unverified"}
            className="h-5 w-auto object-contain"
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <span className="font-semibold">
            Aadhaar Number:
          </span>{" "}
          {user?.aadhaar_response?.result
            ?.user_aadhaar_number || "N/A"}
        </div>

        <div>
          <span className="font-semibold">State:</span>{" "}
          {user?.aadhaar_response?.result?.state ||
            "N/A"}
        </div>

        <div>
          <span className="font-semibold">Gender:</span>{" "}
          {user?.aadhaar_response?.result?.user_gender ||
            "N/A"}
        </div>

        {user?.aadhar_image && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(user.aadhar_image, "_blank")
            }
          >
            View Document
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AadhaarCard;