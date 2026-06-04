import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import API from "../../../lib/axios";
import { YMD } from "../../../lib/utils";
import LogoCoverUploader from "./LogoCoverUploader";
const Profile = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been applied successfully.",
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const apiurl = import.meta.env.VITE_API_URL;
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  

  useEffect(() => {
    FetchCompanyDetails();
  }, [apiurl]);

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    established: "",
    allowinsearch: true,
    about: "",
    logo: null,
    cover: null,
    logo_preview: null,
    cover_preview: null,
  });

  const FetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `${apiurl}/api/instituteprofile/get_company_details`
      );

      if (response.data.success) {
        const data = response.data.data;

        const updatedFormData = {
          ...formdata,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          website: data.website || "",
          established: data.established || "",
          allowinsearch: data.allowinsearch || true,
          about: data.about || "",
          logo_preview: data.logo || "",
          cover_preview: data.cover || "",
        };

        setFormdata(updatedFormData);

        //setDisableform(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formdata.logo_preview) {
      console.log("Updated formdata.logo_preview:", formdata.logo_preview); // ✅ Correct place
    }
  }, [formdata.logo_preview]);

  const handelsubmit = async (e) => {
    e.preventDefault();
    console.log("FormData before submit:", formdata);

    setLoading(true);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    try {
      const payload = new FormData();

      for (const key in formdata) {
        const value = formdata[key];

        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            // Arrays (like courses) → stringify
            payload.append(key, JSON.stringify(value));
          } else if (value instanceof Date) {
            // Date objects → ISO string
            payload.append(key, value.toISOString());
          } else if (value instanceof File || value instanceof Blob) {
            // Files → append directly
            payload.append(key, value);
          } else if (typeof value === "object") {
            // Any other plain object → stringify
            payload.append(key, JSON.stringify(value));
          } else {
            // Primitives (string, number, boolean) → append directly
            payload.append(key, value);
          }
        }
      }

      const response = await API.post(
        `${apiurl}/api/instituteprofile/add_or_update_company`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setError(null);
        setErrorId(null);
        setSuccess(response.data.message);
        setMessageId(Date.now());
         toast({
          title: "Success",
          description: 'Institute profile updated successfully.',
        });

        // wait for 2 seconds then setActiveTab= "account"
        setTimeout(() => {
          //setActiveTab("account");
        }, 2000);
      }
    } catch (error) {
      setError("Error Saving Details Please Try Again");
       toast({
          title: "Error",
          description: 'Error saving details please try again.',
        });
      setErrorId(Date.now());
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const Deletecover = async () => {
    // Reset previous states
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);
    setLoading(true);

    try {
      const response = await API.delete(
        `${apiurl}/api/instituteprofile/delete_cover_photo`,
      );

      if (response.data.success) {
        // Update the form state
        setFormdata((prev) => ({
          ...prev,
          cover_preview: null,
        }));

        // Show success
        setSuccess("Cover photo deleted");
        setMessageId(Date.now());
      } else {
        setError("Failed to delete cover photo");
        setErrorId(Date.now());
      }
    } catch (error) {
      setError("Failed to delete cover photo Please Try Again");
      setMessageId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || submitting || (!formdata.logo && !formdata.logo_preview);

  return (
    <>
      <form
        className="default-form"
        onSubmit={handelsubmit}
        type="multipart/form-data"
        method="post"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fname">
              Institute Name{" "}
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter institute name"
              value={formdata.name}
              onChange={(e) =>
                setFormdata({ ...formdata, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lname">
              Email Address{" "}
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formdata.email}
              onChange={(e) =>
                setFormdata({ ...formdata, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              Phone{" "}
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>
            <Input
              type="text"
              name="mobile"
              placeholder="0 123 456 7890"
              value={formdata.phone}
              onChange={(e) =>
                setFormdata({ ...formdata, phone: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">
              Website{" "}
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <Input
              type="url"
              name="website"
              placeholder="https://www.example.com"
              value={formdata.website}
              onChange={(e) =>
                setFormdata({ ...formdata, website: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Est. Since
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <Input
              style={{ position: "relative" }}
              type="date"
              name="website"
              placeholder="Est. Since"
              value={YMD(formdata.established)}
              onChange={(e) =>
                setFormdata({ ...formdata, established: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Allow In Search & Listing</Label>

            <label></label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={formdata.allowinsearch}
              onChange={(e) =>
                setFormdata({ ...formdata, allowinsearch: e.target.value })
              }
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">
              About Institute
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <textarea
              className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              name="about"
              required
              value={formdata.about}
              onChange={(e) =>
                setFormdata({ ...formdata, about: e.target.value })
              }
              placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working it banjos in the aftermarket. Spent a weekend importing banjos in West Palm Beach, FL.In this position, the Software Engineer collaborates with Evention's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present"
            ></textarea>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">
              Institute Address
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <textarea
              className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
              name="address"
              value={formdata.address}
              onChange={(e) =>
                setFormdata({ ...formdata, address: e.target.value })
              }
              placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working it banjos in the aftermarket. Spent a weekend importing banjos in West Palm Beach, FL.In this position, the Software Engineer collaborates with Evention's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present"
            ></textarea>
          </div>
          <LogoCoverUploader
            formdata={formdata}
            setFormdata={setFormdata}
            Deletecover={Deletecover}
          />
        </div>

        <Button
          className="gap-2 mt-3 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
          type="submit"
          disabled={isDisabled}
          style={{
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
        >
          {loading || submitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </>
  );
};

export default Profile;
