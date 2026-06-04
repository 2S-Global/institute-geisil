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

const EpicDetails = ({ user }: Props) => {
  const epic =
    user?.epic_response?.result || {};

  return (
    <Card id="epic_response">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          EPIC

          <img
            src={
              !user?.epic_response
                ? "/images/resource/na.png"
                : user?.epic_response?.response_code == 100
                  ? "/images/resource/verified.png"
                  : "/images/resource/unverified.png"
            }
            alt={
              !user?.epic_response
                ? "Not Applied"
                : user?.epic_response?.response_code == 100
                  ? "Verified"
                  : "Unverified"
            }
            className="h-5 w-auto object-contain"
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p>
          <strong>EPIC ID:</strong>{" "}
          {epic?.epic_number || "N/A"}
        </p>

        <p>
          <strong>Name:</strong>{" "}
          {epic?.user_name_english || "N/A"}
        </p>

        <p>
          <strong>Gender:</strong>{" "}
          {epic?.user_gender || "N/A"}
        </p>

        <p>
          <strong>Age:</strong>{" "}
          {epic?.user_age || "N/A"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {epic?.status || "N/A"}
        </p>

        <p>
          <strong>
            {epic?.relative_relation ||
              "Relative"}{" "}
            Name:
          </strong>{" "}
          {epic?.relative_name_english || "N/A"}
        </p>

        <hr />

        <h4 className="font-semibold">
          Location Details
        </h4>

        <p>
          <strong>District:</strong>{" "}
          {epic?.address?.district_name ||
            "N/A"}
        </p>

        <p>
          <strong>State:</strong>{" "}
          {epic?.address?.state || "N/A"}
        </p>

        <p>
          <strong>
            Assembly Constituency:
          </strong>{" "}
          {epic?.assembly_constituency_name ||
            "N/A"}
        </p>

        <p>
          <strong>
            Parliamentary Constituency:
          </strong>{" "}
          {epic?.parliamentary_constituency_name ||
            "N/A"}
        </p>

        {user?.epic_image && (
          <Button
            variant="outline"
            onClick={() =>
              window.open(user.epic_image, "_blank")
            }
          >
            View Document
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EpicDetails;