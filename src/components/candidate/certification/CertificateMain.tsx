
import React, { useState } from "react";
import {
  Pencil,
  Award,
  Plus,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CertificateModal from "./CertificateModal";

const CertificateMain = ({ setReload, list = [], setError, setSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState({});

  const openModal = (Edit_item) => {
    if (Edit_item) {
      setItem(Edit_item);
      console.log("Selected Item:", Edit_item);
    } else {
      setItem({});
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
      <Card className="p-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b">
          <div>
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
              Certifications
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add details of certifications you have completed
            </p>
          </div>
          <Button size="sm" onClick={() => openModal(null)}>
            <Plus className="h-4 w-4 mr-1" /> Add Certifications
          </Button>
        </div>

        {/* Certifications List */}
        <div className="grid grid-cols-1 gap-4">
          {Array.isArray(list) &&
            list.length > 0 &&
            list.map((cert) => (
              <Card
                key={cert._id}
                className="border rounded-lg hover:border-amber-500/40 transition-colors"
              >
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Icon & Main Details */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="font-medium text-base text-foreground truncate"
                          title={cert.title}
                        >
                          {cert.title}
                        </h3>

                        {/* Status Badge */}
                        {cert.doesNotExpire ? (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[11px] font-normal"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Does not
                            expire
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[11px] font-normal"
                          >
                            <Clock className="h-3 w-3 mr-1" /> Expirable
                          </Badge>
                        )}
                      </div>

                      {/* Credential ID */}
                      {cert.certificationId && (
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                          Credential ID:{" "}
                          <span className="text-foreground">
                            {cert.certificationId}
                          </span>
                        </p>
                      )}

                      {/* Validity Dates */}
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          Valid from{" "}
                          <strong className="text-foreground">
                            {monthNames[cert.validityFrommonth - 1]}{" "}
                            {cert.validityFromyear}
                          </strong>
                        </span>

                        {!cert.doesNotExpire && (
                          <span>
                            {" "}
                            to{" "}
                            <strong className="text-foreground">
                              {monthNames[cert.validityToMonth - 1]}{" "}
                              {cert.validityToyear}
                            </strong>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions (URL & Edit Button) */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 w-full sm:w-auto justify-end">
                    {/* {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium hover:underline mr-2"
                      >
                        Show credential <ExternalLink className="h-3 w-3" />
                      </a>
                    )} */}

                    <button
                      onClick={() => openModal(cert)}
                      className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Edit Certificate"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Modal */}
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
      </Card>
    </>
  );
};

export default CertificateMain;
