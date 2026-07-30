import { AdminLayout } from "@/components/AdminLayout";

 

import VerificationSimplified from "@/components/admin/VerificationSimplified/VerificationSimplified";






export default function VerificationCms() {
  return (
    <AdminLayout>
      {/* <PageHeader
        eyebrow="Admin"
        title="Platform overview"
        description="Monitor users, jobs, applications and platform health across GEISIL."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export report
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add admin
            </Button>
          </>
        }
      /> */}

     
      {/* <Card className="p-5 mt-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">Recently registered users</h3>
            <p className="text-sm text-muted-foreground">Latest sign-ups across roles</p>
          </div>
          <Button variant="outline" size="sm">View all</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-3 pr-4 font-semibold">User</th>
                <th className="py-3 pr-4 font-semibold">Role</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Joined</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.email} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant="secondary">{u.role}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{u.when}</td>
                  <td className="py-3 pr-4">
                    <Badge
                      className={
                        u.status === "Active"
                          ? "bg-success/10 text-success hover:bg-success/10"
                          : "bg-warning/10 text-warning hover:bg-warning/10"
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card> */}
      <VerificationSimplified/>

    </AdminLayout>
  );
}
