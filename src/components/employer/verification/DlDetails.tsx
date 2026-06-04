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

const DlDetails = ({ user }: Props) => {
  const dl = user?.dl_response?.result || {};

  const permanentAddress =
    dl?.user_address?.find(
      (item: any) => item.type === "Permanent"
    ) || null;

  const presentAddress =
    dl?.user_address?.find(
      (item: any) => item.type === "Present"
    ) || null;

  return (
    <Card
      id="dl_response"
      className="xl:col-span-2"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          Driving License

          <img
            src={
              !user?.dl_response
                ? "/images/resource/na.png"
                : user?.dl_response?.response_code == 100
                  ? "/images/resource/verified.png"
                  : "/images/resource/unverified.png"
            }
            alt={
              !user?.dl_response
                ? "Not Applied"
                : user?.dl_response?.response_code == 100
                  ? "Verified"
                  : "Unverified"
            }
            className="h-5 w-auto object-contain"
          />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex justify-center">
            {dl?.user_image ? (
              <img
                src={`data:image/jpeg;base64,${dl.user_image}`}
                alt="User"
                className="h-40 w-40 rounded-lg border object-cover"
              />
            ) : (
              <img
                src="/images/resource/no_user.png"
                alt="User"
                className="h-40 w-40 rounded-lg border object-cover"
              />
            )}
          </div>

          <div className="space-y-2">
            <p>
              <strong>Name:</strong>{" "}
              {dl?.user_full_name || "N/A"}
            </p>

            <p>
              <strong>DL Number:</strong>{" "}
              {dl?.dl_number || "N/A"}
            </p>

            <p>
              <strong>DOB:</strong>{" "}
              {dl?.user_dob || "N/A"}
            </p>

            <p>
              <strong>Father/Husband:</strong>{" "}
              {dl?.father_or_husband || "N/A"}
            </p>

            <p>
              <strong>State:</strong>{" "}
              {dl?.state || "N/A"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {dl?.status || "N/A"}
            </p>

            <p>
              <strong>Blood Group:</strong>{" "}
              {dl?.user_blood_group || "N/A"}
            </p>

            <p>
              <strong>Expiry:</strong>{" "}
              {dl?.expiry_date || "N/A"}
            </p>

            <p>
              <strong>Issued:</strong>{" "}
              {dl?.issued_date || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="font-semibold mb-2">
              Permanent Address
            </h4>

            <div className="text-sm text-muted-foreground">
              {permanentAddress ? (
                <>
                  <p>
                    {
                      permanentAddress.completeAddress
                    }
                  </p>
                  <p>
                    {permanentAddress.district}
                  </p>
                  <p>
                    {permanentAddress.state}
                  </p>
                  <p>{permanentAddress.pin}</p>
                </>
              ) : (
                "N/A"
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              Present Address
            </h4>

            <div className="text-sm text-muted-foreground">
              {presentAddress ? (
                <>
                  <p>
                    {presentAddress.completeAddress}
                  </p>
                  <p>
                    {presentAddress.district}
                  </p>
                  <p>
                    {presentAddress.state}
                  </p>
                  <p>{presentAddress.pin}</p>
                </>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>

        {user?.dl_image && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              window.open(user.dl_image, "_blank")
            }
          >
            View Document
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DlDetails;