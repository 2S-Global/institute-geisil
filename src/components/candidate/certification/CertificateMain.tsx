import React, { useState, useEffect } from "react";
import {
  Pencil,
  Upload,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Plus,
  CheckCircle2,
  Sparkles,
  Languages,
  Building2,
  Calendar,
  Trash2,
  Download,
  Eye,
  Share2,
  CircleX,
  Banknote,
  Camera,
} from "lucide-react";
import { CandidateLayout } from "@/components/CandidateLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import CertificateModal from "./CertificateModal";
const CertificateMain = ({ setReload, list = [], setError, setSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState([]);

  const openModal = (Edit_item) => {
    if (Edit_item) {
      setItem(Edit_item);
      console.log("Selected Item:", item);
    } else {
      setItem([]);
    }
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Certifications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add details of certifications you have completed
          </p>
        </div>
        <Button
          size="sm"
          
          
          onClick={openModal}
        >
          <Plus className="h-4 w-4" /> Add certifications
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.isArray(list) &&
          list.length > 0 &&
          list.map((item) => (
            <Card key={item._id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-sm truncate"
                    title={item.title}
                  >
                    {item?.title?.length > 30
                      ? `${item?.title.slice(0, 30)}...`
                      : item.title}
                    <button
                      onClick={() => openModal(item)}
                      className="rounded-md p-1 hover:bg-muted transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span>
                      <strong>Valid from:</strong>{" "}
                      {monthNames[item.validityFrommonth - 1]}{" "}
                      {item.validityFromyear}.
                    </span>

                    {item.doesNotExpire ? (
                      <span className="mx-2">Does not expire.</span>
                    ) : (
                      <span className="mx-2">
                        <strong>Valid till</strong>:{" "}
                        {monthNames[item.validityToMonth - 1]}{" "}
                        {item.validityToyear}.
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {isModalOpen && (
        <CertificateModal
          show={isModalOpen}
          onClose={closeModal}
          item={item}
          setReload={setReload}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default CertificateMain;
