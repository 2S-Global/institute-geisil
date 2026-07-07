import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ContactCandidateModalProps {
  open: boolean;
  onClose: () => void;
  candidateName: string;
  profilePicture?: string;
  email?: string;
  phone_number?: string;
}

export const ContactCandidateModal = ({
  open,
  onClose,
  candidateName,
  profilePicture,
  email,
  phone_number,
}: ContactCandidateModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field === "email" ? "Email" : "Phone number"} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden rounded-2xl border border-border/50 bg-background p-6 shadow-2xl transition-all">
        <DialogHeader className="flex flex-col items-center justify-center pb-4 text-center">
          <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-md">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={candidateName}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <AvatarFallback className="bg-primary-soft text-primary text-xl font-semibold">
                {candidateName.split(" ").map((w) => w[0]).join("")}
              </AvatarFallback>
            )}
          </Avatar>
          <DialogTitle className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            {candidateName}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Get in touch with the candidate directly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-2">
          {/* Email Item */}
          <div className="group relative flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 p-3.5 hover:bg-muted/50 hover:border-border/80 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft/40 text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">Email Address</span>
                <span className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-[240px]">
                  {email || "Not Disclosed"}
                </span>
              </div>
            </div>
            {email && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => copyToClipboard(email, "email")}
              >
                {copiedField === "email" ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Phone Item */}
          <div className="group relative flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 p-3.5 hover:bg-muted/50 hover:border-border/80 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft/40 text-primary transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">Phone Number</span>
                <span className="text-sm font-semibold text-foreground">
                  {phone_number || "Not Disclosed"}
                </span>
              </div>
            </div>
            {phone_number && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => copyToClipboard(phone_number, "phone")}
              >
                {copiedField === "phone" ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto px-6 rounded-xl">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
