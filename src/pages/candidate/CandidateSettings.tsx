import { useState } from "react";
import { Save, Upload, Trash2, Globe, Bell, Lock, User as UserIcon, Eye } from "lucide-react";
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

const CandidateSettings = () => {
  const { toast } = useToast();
  const [visibility, setVisibility] = useState("public");

  const handleSave = (section: string) => {
    toast({
      title: `${section} updated`,
      description: "Your changes have been saved successfully.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Account deletion requested",
      description: "We've emailed you a confirmation link. This action is irreversible.",
      variant: "destructive",
    });
  };

  return (
    <CandidateLayout>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your account, privacy, notifications and job preferences."
        actions={
          <Button
            onClick={() => handleSave("All settings")}
            className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
          >
            <Save className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="flex-wrap">
          {/* <TabsTrigger value="account" className="gap-2"><UserIcon className="h-4 w-4" /> Account</TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2"><Globe className="h-4 w-4" /> Job preferences</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2"><Eye className="h-4 w-4" /> Privacy</TabsTrigger> */}
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* ACCOUNT */}
        <TabsContent value="account" className="space-y-6">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">
                Personal information
              </CardTitle>
              <CardDescription>
                This information appears on your candidate profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xl">
                    RM
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" /> Upload photo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fname">First name</Label>
                  <Input id="fname" defaultValue="Rohan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lname">Last name</Label>
                  <Input id="lname" defaultValue="Mehta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="rohan.mehta@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input id="dob" type="date" defaultValue="2001-04-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select defaultValue="male">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Current location</Label>
                  <Input
                    id="address"
                    defaultValue="Bengaluru, Karnataka, India"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave("Profile")} className="gap-2">
                  <Save className="h-4 w-4" /> Save profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JOB PREFERENCES */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">
                Job preferences
              </CardTitle>
              <CardDescription>
                Help us recommend the most relevant opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Preferred role</Label>
                  <Input defaultValue="Frontend Developer" />
                </div>
                <div className="space-y-2">
                  <Label>Job type</Label>
                  <Select defaultValue="full-time">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Work mode</Label>
                  <Select defaultValue="hybrid">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expected salary (LPA)</Label>
                  <Input defaultValue="8 - 12" />
                </div>
                <div className="space-y-2">
                  <Label>Preferred locations</Label>
                  <Input defaultValue="Bengaluru, Hyderabad, Remote" />
                </div>
                <div className="space-y-2">
                  <Label>Notice period</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="15">15 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Skills & interests</Label>
                  <Textarea
                    defaultValue="React, TypeScript, Node.js, UI/UX, Cloud"
                    rows={3}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                {[
                  {
                    title: "Open to opportunities",
                    desc: "Let recruiters know you're actively looking.",
                    on: true,
                  },
                  {
                    title: "Willing to relocate",
                    desc: "Show up for jobs outside your preferred cities.",
                    on: false,
                  },
                ].map((p) => (
                  <div
                    key={p.title}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{p.title}</p>
                      <p className="text-sm text-muted-foreground">{p.desc}</p>
                    </div>
                    <Switch defaultChecked={p.on} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Job preferences")}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" /> Save preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">
                Notifications
              </CardTitle>
              <CardDescription>
                Choose which updates you receive and how.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {[
                {
                  title: "New job matches",
                  desc: "Get notified when a new job matches your profile.",
                  on: true,
                },
                {
                  title: "Application updates",
                  desc: "Updates on your application status from recruiters.",
                  on: true,
                },
                {
                  title: "Interview invitations",
                  desc: "Notify the moment an interview is scheduled.",
                  on: true,
                },
                {
                  title: "Assessment reminders",
                  desc: "Reminders for upcoming or pending assessments.",
                  on: true,
                },
                {
                  title: "Messages from recruiters",
                  desc: "Receive direct messages and InMail.",
                  on: true,
                },
                {
                  title: "Weekly job digest",
                  desc: "Curated jobs delivered every Monday morning.",
                  on: false,
                },
                {
                  title: "Career tips & newsletters",
                  desc: "Occasional advice, blogs and webinars.",
                  on: false,
                },
              ].map((n) => (
                <div
                  key={n.title}
                  className="flex items-center justify-between py-4"
                >
                  <div className="min-w-0 pr-4">
                    <p className="font-semibold text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={n.on} />
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleSave("Notifications")}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRIVACY */}
        <TabsContent value="privacy">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Privacy</CardTitle>
              <CardDescription>
                Control who can see your profile and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Profile visibility</Label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger className="md:w-[320px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      Public — visible to all recruiters
                    </SelectItem>
                    <SelectItem value="limited">
                      Limited — only verified employers
                    </SelectItem>
                    <SelectItem value="private">Private — only you</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              {[
                {
                  title: "Show contact information",
                  desc: "Recruiters can see your email and phone.",
                  on: true,
                },
                {
                  title: "Allow profile in search results",
                  desc: "Appear in public recruiter searches.",
                  on: true,
                },
                {
                  title: "Share applied jobs with institute",
                  desc: "Allow GEISIL placement cell to track your activity.",
                  on: true,
                },
                {
                  title: "Anonymous browsing",
                  desc: "Hide your identity when viewing company profiles.",
                  on: false,
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                  <Switch defaultChecked={p.on} />
                </div>
              ))}
              <div className="flex justify-end">
                <Button onClick={() => handleSave("Privacy")} className="gap-2">
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-display">Password</CardTitle>
              <CardDescription>
                Use a strong, unique password to keep your account safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Current password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>New password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("Password")}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" /> Update password
                </Button>
              </div>
            </CardContent>
          </Card>

   
        </TabsContent>
      </Tabs>
    </CandidateLayout>
  );
};

export default CandidateSettings;
