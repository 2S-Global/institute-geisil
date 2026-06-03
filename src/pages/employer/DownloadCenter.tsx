import { EmployerLayout } from "@/components/EmployerLayout";
import DownloadCenterTable from "@/components/employer/downloadCenter/DownloadCenterTable";

const DownloadCenter = () => {
  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Download Center</h1>
          <p className="text-muted-foreground mt-1">
            View verified employee verification records.
          </p>
        </div>

        <DownloadCenterTable />
      </div>
    </EmployerLayout>
  );
};

export default DownloadCenter;