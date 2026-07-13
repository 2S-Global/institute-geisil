import { useState, useEffect } from "react";
import API from "../../../lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const socialPlatforms = [
  {
    label: "Facebook",
    name: "facebook",
    placeholder: "https://www.facebook.com/Invision",
  },
  {
    label: "Twitter",
    name: "twitter",
    placeholder: "https://twitter.com/yourhandle",
  },
  {
    label: "LinkedIn",
    name: "linkedin",
    placeholder: "https://linkedin.com/company/yourcompany",
  },
  {
    label: "Instagram",
    name: "instagram",
    placeholder: "https://www.instagram.com/yourhandle",
  },
  {
    label: "YouTube",
    name: "youtube",
    placeholder: "https://www.youtube.com/yourchannel",
  },
  {
    label: "Telegram",
    name: "telegram",
    placeholder: "https://t.me/yourchannel",
  },
  {
    label: "Discord",
    name: "discord",
    placeholder: "https://discord.gg/yourserver",
  },
  {
    label: "GitHub",
    name: "github",
    placeholder: "https://github.com/yourorg",
  },
];

const SocialNetworkBox = () => {
  const [formData, setFormData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    telegram: "",
    discord: "",
    github: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const apiurl = import.meta.env.VITE_API_URL;
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    FetchSocialDetails();
  }, [apiurl]);

  const FetchSocialDetails = async () => {
    setLoading(true);

    try {
      const response = await API.get(
        `${apiurl}/api/instituteprofile/get_social`,
      );

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          facebook: response.data.data.facebook || "",
          twitter: response.data.data.twitter || "",
          linkedin: response.data.data.linkedin || "",
          instagram: response.data.data.instagram || "",
          youtube: response.data.data.youtube || "",
          telegram: response.data.data.telegram || "",
          discord: response.data.data.discord || "",
          github: response.data.data.github || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching social details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasAtLeastOneValue = Object.values(formData).some(
    (value) => value.trim() !== "",
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasAtLeastOneValue) {
      toast({
        title: "Validation Error",
        description: "Please enter at least one social network link.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    try {
      const response = await API.post(
        `${apiurl}/api/instituteprofile/add_or_update_social`,
        formData,
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        setMessageId(Date.now());

        toast({
          title: "Success",
          description: "Social network updated successfully.",
        });
      } else {
        setError(response.data.message);

        toast({
          title: "Error",
          variant: "destructive",
          description: "Something went wrong.",
        });

        setErrorId(Date.now());
      }
    } catch (error) {
      setError("Please try again");
      setErrorId(Date.now());

      toast({
        title: "Error",
        variant: "destructive",
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 1050 }}
        ></div>
      )}

      <form
        className="default-form"
        onSubmit={handleSubmit}
        type="multipart/form-data"
        method="post"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {socialPlatforms.map((platform) => (
            <div key={platform.name} className="space-y-2">
              <Label htmlFor={platform.name}>{platform.label}</Label>

              <Input
                type="url"
                name={platform.name}
                placeholder={platform.placeholder}
                value={formData[platform.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={loading || submitting || !hasAtLeastOneValue}
              className="gap-2 mt-3 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
              style={{
                cursor:
                  loading || submitting || !hasAtLeastOneValue
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SocialNetworkBox;
