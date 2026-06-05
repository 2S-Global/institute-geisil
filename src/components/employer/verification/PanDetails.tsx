import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface Props {
  user: any;
}

const PanDetails = ({ user }: Props) => {
  const pan = user?.pan_response;
  const data = pan?.data || {};
  const result = pan?.result || data || {};
  const fullName = data?.full_name || result?.user_full_name || result?.name || "N/A";
  const panNumber = result?.pan_number || result?.pan || "N/A";
  const panType = result?.pan_type || result?.type || "N/A";

  const isNotApplied = !pan;
  const isVerified = !!pan && (pan?.response_code === "100" || pan?.response_code === 100 || pan?.status_code === 200);

  return (
    <Card id="pan_response">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          PAN
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
          <span className="font-semibold">Full Name:</span>{" "}
          {fullName}
        </div>

        <div>
          <span className="font-semibold">PAN Number:</span>{" "}
          {panNumber}
        </div>

        <div>
          <span className="font-semibold">Type:</span>{" "}
          {panType}
        </div>

        {user?.pan_image && (
          <Button variant="outline" size="sm" onClick={() => window.open(user.pan_image, "_blank")}>View Document</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PanDetails;
