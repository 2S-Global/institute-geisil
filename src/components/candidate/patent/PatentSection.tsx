import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleX,Pencil,CircleCheck } from "lucide-react";
import API from "../../../lib/axios"
import PatentMain from "./PatentMain"
import Loading from "@/components/common/Loading";
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
const PatentSection = () => {
const apiurl =  import.meta.env.VITE_API_URL;
   const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [patentlist, setPatentlist] = useState([]);
  const [reloadpatentlist, setReloadpatentlist] = useState(false);
  //const apiurl = process.env.NEXT_PUBLIC_API_URL;

  //main use effect
  useEffect(() => {
    try {
      setSectionloading(true);
      fetchPatentlist();
    } catch (error) {
      console.error(error);
    } finally {
      setSectionloading(false);
    }
  }, [apiurl]);
  
  useEffect(() => {
    if (reloadpatentlist) {
      fetchPatentlist();
      setReloadpatentlist(false);
    }
  }, [reloadpatentlist]);

  //functions
  const fetchPatentlist = async () => {
    try {
      const token = localStorage.getItem("token");
      /* const response = await axios.get(
        `${apiurl}/api/candidate/accomplishments/list_patent`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await API.get(`/api/candidate/accomplishments/list_patent`)
      
      if (response.status == 200) {
        setPatentlist(response.data.data);
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
        <Loading />
      ) : (
        <>
          <PatentMain
            list={patentlist}
            setError={setError}
            setSuccess={setSuccess}
            reload={reloadpatentlist}
            setReload={setReloadpatentlist}
          />
        </>
      )}
    </CardContent>
  </Card>
</>

  );
};

export default PatentSection;
