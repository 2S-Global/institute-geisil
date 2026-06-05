import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import API from "../../../lib/axios";
import { YMD } from "../../../lib/utils";
import { Search } from "lucide-react";
import Select from "react-select";
import LogoCoverUploader from "./LogoCoverUploader";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  const { toast } = useToast();
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
  const apiurl = "";
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  //const token = localStorage.getItem("token");

  useEffect(() => {
    FetchSocialDetails();
  }, []);

  const FetchSocialDetails = async () => {
    setLoading(true);
    /* /api/companyprofile/get_social */
    try {
      const response = await API.get(
        `/api/companyprofile/get_social`
      );
      if (response.data.success) {
        setFormData({
          ...formData,
          facebook: response.data.data.facebook,
          twitter: response.data.data.twitter,
          linkedin: response.data.data.linkedin,
          instagram: response.data.data.instagram,
          youtube: response.data.data.youtube,
          telegram: response.data.data.telegram,
          discord: response.data.data.discord,
          github: response.data.data.github,
        });
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);
    try {
      /* /api/companyprofile/add_or_update_social */
      const response = await API.post(
        `/api/companyprofile/add_or_update_social`,
        formData
      );
      if (response.data.success) {
        setSuccess(response.data.message);
        setMessageId(Date.now());
  toast({
                    title: "Success",
                    description: response.data.message,
                  });
        setTimeout(() => {
         /*  setActiveTab("brance"); */
        }, 2000);
      } else {
        setError(response.data.message);
          toast({
                    title: "Error",
                     variant: "destructive",
                    description: response.data.message,
                  });
        setErrorId(Date.now());
      }
    } catch (error) {
      setError("please try again");
      toast({
                    title: "Error",
                     variant: "destructive",
                    description: "Please try again",
                  });
      setErrorId(Date.now());
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  
  return (
<>
{/*   <MessageComponent
    error={error}
    success={success}
    errorId={errorId}
    message_id={message_id}
  /> */}

{/*   {loading && (
    <div
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
      style={{ zIndex: 1050 }}
    >
  
    </div>
  )} */}

  <form
    className="default-form"
    onSubmit={handleSubmit}
    method="post"
  >
    <div className="grid gap-4 md:grid-cols-2">
      {socialPlatforms.map((platform) => (
        <div key={platform.name} className="space-y-2">
          <label className="block text-sm font-medium">
            {platform.label}
          </label>

          <input
            type="url"
            name={platform.name}
            placeholder={platform.placeholder}
            value={formData[platform.name]}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      ))}
    </div>

    <button
      type="submit"
      className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-brand hover:bg-[hsl(var(--primary-hover))]"
    >
      Save
    </button>
  </form>
</>
  );
};

export default SocialNetworkBox;
