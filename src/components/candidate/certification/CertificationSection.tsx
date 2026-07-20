import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleX,Pencil,CircleCheck } from "lucide-react";
import API from "../../../lib/axios"
import CertificateMain from "./CertificateMain"
import { Skeleton } from "@/components/ui/skeleton";
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
const CertificationSection = () => {
const apiurl =  import.meta.env.VITE_API_URL;
  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [certificatelist, setCertificatelist] = useState([]);
  const [reloadcertificatelist, setReloadcertificatelist] = useState(false);
  //const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchCertificatelist();
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  }, [apiurl]);

  useEffect(() => {
    if (reloadcertificatelist) {
      fetchCertificatelist();
      setReloadcertificatelist(false);
    }
  }, [reloadcertificatelist]);

  //functions
 
  const fetchCertificatelist = async () => {
    try {
      const token = localStorage.getItem("token");
      /* const response = await axios.get(
        `${apiurl}/api/candidate/accomplishments/list_certificate`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await API.get(`/api/candidate/accomplishments/list_certificate`)
      
      if (response.status == 200) {
        setCertificatelist(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };
  return (
<>


      {sectionloading ? (
        <div className="space-y-3 animate-pulse p-6 border rounded-xl">
          <Skeleton className="h-4 w-1/3 bg-muted" />
          <Skeleton className="h-4 w-2/3 bg-muted" />
        </div>
      ) : (
        <>
          
             <CertificateMain
                    list={certificatelist}
                    setError={setError}
                    setSuccess={setSuccess}
                    reload={reloadcertificatelist}
                    setReload={setReloadcertificatelist}
                  />
          
        </>
      )}
   
 
</>

  );
};

export default CertificationSection;
