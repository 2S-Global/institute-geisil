import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleX,Pencil,CircleCheck } from "lucide-react";
import API from "../../../lib/axios"
import ProfileMain from "./ProfileMain"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import PersonalModal from "../personal/PersonalModal";
const OnlineProfileSection = () => {
const apiurl =  import.meta.env.VITE_API_URL;
  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [onlineProfilelist, setOnlineProfilelist] = useState([]);
  const [reloadonlineProfilelist, setReloadonlineProfilelist] = useState(false);
  //const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchonlineProfilelist();
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  }, [apiurl]);

  useEffect(() => {
    if (reloadonlineProfilelist) {
      fetchonlineProfilelist();
      setReloadonlineProfilelist(false);
    }
  }, [reloadonlineProfilelist]);

  //functions
  const fetchonlineProfilelist = async () => {
    try {
      const token = localStorage.getItem("token");
      /*  const response = await axios.get(
        `${apiurl}/api/candidate/accomplishments/get_online_profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await API.get(
          `/api/candidate/accomplishments/get_online_profile`,
        )
    
      if (response.status == 200) {
        setOnlineProfilelist(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };
  return (
<>

  <Card>
    <CardContent>
      {sectionloading ? (
        "loading............."
        // or <CustomizedProgressBars />
      ) : (
        <>
          
            <ProfileMain
              list={onlineProfilelist}
              setError={setError}
              setSuccess={setSuccess}
              reload={reloadonlineProfilelist}
              setReload={setReloadonlineProfilelist}
            />
          
        </>
      )}
    </CardContent>
  </Card>
 
</>

  );
};

export default OnlineProfileSection;
