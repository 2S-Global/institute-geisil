import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface Props {
  user: any;
}

const PanDetails = ({ user }: Props) => {
  return (
    <Card id="pan_response">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          PAN
          <img
            src={
              !user?.pan_response
                ? "/images/resource/na.png"
                : user?.pan_response?.response_code == 100
                  ? "/images/resource/verified.png"
                  : "/images/resource/unverified.png"
            }
            alt={
              !user?.pan_response
                ? "Not Applied"
                : user?.pan_response?.response_code == 100
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
          {user?.pan_response?.result?.user_full_name || "N/A"}
        </div>

        <div>
          <span className="font-semibold">PAN Number:</span>{" "}
          {user?.pan_response?.result?.pan_number || "N/A"}
        </div>

        <div>
          <span className="font-semibold">Type:</span>{" "}
          {user?.pan_response?.result?.pan_type || "N/A"}
        </div>

        {user?.pan_image && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(user.pan_image, "_blank")}
          >
            View Document
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PanDetails;
