import { Save, Upload,ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Profile from "@/components/institute/insituteProfile/profile";
import Account from "@/components/institute/insituteProfile/account";
import ContactInfoBox from "@/components/institute/insituteProfile/contactInfoBox";
import SocialNetworkBox from "@/components/institute/insituteProfile/socialNetworkBox";
import { Link } from "react-router-dom";

const InstituteProfile = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been applied successfully.",
    });
  };

  return (
    <DashboardLayout>
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
        <Link to="/institute/institute-profile-details"><ArrowLeft className="h-4 w-4" /> Back </Link>
      </Button>
      <PageHeader
        eyebrow=""
        title="Institute Profile Edit"
        description=""
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex flex-wrap lg:flex-nowrap gap-2 h-auto justify-start ">
          <TabsTrigger value="profile">Institute Profile</TabsTrigger>
          <TabsTrigger value="account">Account Details</TabsTrigger>
          <TabsTrigger value="contact">Contact Person Details</TabsTrigger>
          <TabsTrigger value="social">Social Network</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Institute Profile</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Profile/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Account Details</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
             <Account/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Contact Person Information</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
             <ContactInfoBox/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Social Network</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
             <SocialNetworkBox/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default InstituteProfile;
