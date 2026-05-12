import { Save, Upload } from "lucide-react";
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

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been applied successfully.",
    });
  };

  return (
    <DashboardLayout>
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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="institute">Institute</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Personal information</CardTitle>
              <CardDescription>Update your account profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xl">AS</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4" /> Upload photo</Button>
                  <p className="text-xs text-muted-foreground mt-2">PNG or JPG, max 2MB.</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fname">First name</Label>
                  <Input id="fname" defaultValue="Anita" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lname">Last name</Label>
                  <Input id="lname" defaultValue="Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="a.sharma@geisil.in" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Institute Admin" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institute">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Institute details</CardTitle>
              <CardDescription>Information used across reports and student-facing pages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Institute name</Label>
                  <Input defaultValue="GEISIL Institute" />
                </div>
                <div className="space-y-2">
                  <Label>Registration ID</Label>
                  <Input defaultValue="GEISIL-2008-IND" />
                </div>
                <div className="space-y-2">
                  <Label>Primary contact</Label>
                  <Input defaultValue="+91 80 4500 1200" />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input defaultValue="https://geisil.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input defaultValue="2nd Floor, Knowledge Park, Bengaluru, Karnataka 560001" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Notifications</CardTitle>
              <CardDescription>Choose what updates you receive and how.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {[
                { title: "New evaluation submissions", desc: "Notify when a student completes an evaluation.", on: true },
                { title: "Recruiter activity", desc: "Updates when recruiters post new openings or shortlist students.", on: true },
                { title: "Placement offers", desc: "Notify on every offer extended or accepted.", on: true },
                { title: "Weekly digest", desc: "Summary of activity every Monday at 9:00 AM.", on: false },
                { title: "Product updates", desc: "Occasional emails about new features and improvements.", on: false },
              ].map((n) => (
                <div key={n.title} className="flex items-center justify-between py-4">
                  <div className="min-w-0 pr-4">
                    <p className="font-semibold text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={n.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Security</CardTitle>
              <CardDescription>Manage password, sessions and two-factor authentication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Current password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>New password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Two-factor authentication</p>
                  <p className="text-sm text-muted-foreground">Require a verification code in addition to your password.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Sign out other sessions</p>
                  <p className="text-sm text-muted-foreground">End all active sessions on other devices.</p>
                </div>
                <Button variant="outline">Sign out all</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
