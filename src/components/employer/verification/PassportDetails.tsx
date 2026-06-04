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

const PassportDetails = ({ user }: Props) => {
  return (
    <Card id="passport_response">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          Passport

            <img
              src={
                !user?.passport_response
                  ? "/images/resource/na.png"
                  : user?.passport_response?.response_code == 100
                    ? "/images/resource/verified.png"
                    : "/images/resource/unverified.png"
              }
              alt={
                !user?.passport_response
                  ? "Not Applied"
                  : user?.passport_response?.response_code == 100
                    ? "Verified"
                    : "Unverified"
              }
              className="h-5 w-auto object-contain"
            />
          </CardTitle>
        </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <span className="font-semibold">Full Name:</span>{" "}
          {user?.passport_response?.result?.name_on_passport ||
            "N/A"}
        </div>

        <div>
          <span className="font-semibold">
            Passport Number:
          </span>{" "}
          {user?.passport_response?.result?.passport_number ||
            "N/A"}
        </div>

        <div>
          <span className="font-semibold">
            Applied Date:
          </span>{" "}
          {user?.passport_response?.result
            ?.passport_applied_date || "N/A"}
        </div>

        {user?.passport_image && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(user.passport_image, "_blank")
            }
          >
            View Document
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PassportDetails;