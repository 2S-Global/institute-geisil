import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <EmployerLayout>
      <PageHeader title="Settings" description="Manage your account, team, and preferences." />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader><CardTitle className="font-display">Profile information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div><Label>Full name</Label><Input defaultValue="Anita Sharma" className="mt-1.5" /></div>
              <div><Label>Email</Label><Input defaultValue="anita@acme.com" className="mt-1.5" /></div>
              <div><Label>Designation</Label><Input defaultValue="Talent Acquisition Lead" className="mt-1.5" /></div>
              <div><Label>Phone</Label><Input defaultValue="+91 98765 43210" className="mt-1.5" /></div>
              <div className="md:col-span-2"><Button className="shadow-brand">Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader><CardTitle className="font-display">Team members</CardTitle></CardHeader>
            <CardContent className="divide-y divide-border/60">
              {[["Anita Sharma", "Admin"], ["Vikram Singh", "Recruiter"], ["Meera Joshi", "Interviewer"]].map(([n, r]) => (
                <div key={n} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold text-foreground">{n}</p>
                    <p className="text-xs text-muted-foreground">{r}</p>
                  </div>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              ))}
              <div className="pt-4"><Button>Invite member</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader><CardTitle className="font-display">Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {["New applications", "Interview reminders", "Offer responses", "Weekly summary"].map(l => (
                <div key={l} className="flex items-center justify-between">
                  <Label>{l}</Label><Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader><CardTitle className="font-display">Security</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div><Label>Current password</Label><Input type="password" className="mt-1.5" /></div>
              <div><Label>New password</Label><Input type="password" className="mt-1.5" /></div>
              <div className="flex items-center justify-between pt-2"><Label>Two-factor authentication</Label><Switch /></div>
              <Button className="shadow-brand">Update password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EmployerLayout>
  );
}
