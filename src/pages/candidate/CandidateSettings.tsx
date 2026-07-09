import { useState } from "react";
import { Save, Upload, Trash2, Globe, Bell, Lock, User as UserIcon, Eye,EyeOff } from "lucide-react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
const CandidateSettings = () => {
 const { toast } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleSave = async () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?])[^\s]{8,}$/;

      if (!passwordRegex.test(newPassword.trim())) {
        newErrors.newPassword =
          "Password must contain uppercase, lowercase, number, special character and 8 characters.";
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (newPassword.trim() !== confirmPassword.trim()) {
      newErrors.confirmPassword =
        "New password and confirm password must be same";
    }

    setErrors(newErrors);

    if (
      newErrors.currentPassword ||
      newErrors.newPassword ||
      newErrors.confirmPassword
    ) {
      return;
    }

    try {
      const payload = {
        currentPassword,
        newPassword,
      };

      const res = await api.post("/api/auth/changepassword", payload);

      toast({
        title: "Success",
        description: res?.data?.message || "Password changed successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Error",
         variant: "destructive",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <CandidateLayout>
      <PageHeader
        eyebrow="Manage"
        title="Settings"
        description="Configure your institute profile, preferences, security and notifications."
        actions={
          <Button
            onClick={handleSave}
            className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
          >
            <Save className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      <Tabs defaultValue="security" className="space-y-6">
        <TabsContent value="security">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Security</CardTitle>
              <CardDescription>Manage password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3 ">
                <div className="space-y-2">
                  <Label>Current password</Label>

                  <div className="relative">
                    <Input
                      type={showCurrent ? "text" : "password"}
                      className="pr-10"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setErrors({ ...errors, currentPassword: "" });
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showCurrent ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>New password</Label>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      className="pr-10"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrors({ ...errors, newPassword: "" });
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Confirm password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      className="pr-10"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors({ ...errors, confirmPassword: "" });
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
              <Separator />
              {/* <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    Two-factor authentication
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code in addition to your password.
                  </p>
                </div>
                <Switch defaultChecked />
              </div> */}
              {/* <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    Sign out other sessions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    End all active sessions on other devices.
                  </p>
                </div>
                <Button variant="outline">Sign out all</Button>
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </CandidateLayout>
  );
};

export default CandidateSettings;
