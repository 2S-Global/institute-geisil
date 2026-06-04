import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import All from "@/components/institute/studentVerification/All";
import Pending from "@/components/institute/studentVerification/Pending";
import Accepted from "@/components/institute/studentVerification/Accepted";
import Rejected from "@/components/institute/studentVerification/Rejected";

const EmployeeVerification = () => {


  const { toast } = useToast();

  return (
    <EmployerLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Employee Verification"
        description=""
        /*  actions={
          <Button
            onClick={handleSave}
            className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
          >
            <Save className="h-4 w-4" /> Save changes
          </Button>
        } */
      />

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
            <All/>
        </TabsContent>

        <TabsContent value="pending">
        <Pending/>
        </TabsContent>

        <TabsContent value="accepted">
          <Accepted/>
        </TabsContent>

        <TabsContent value="rejected">
            <Rejected/>
        </TabsContent>
      </Tabs>
    </EmployerLayout>
  );
};

export default EmployeeVerification;
