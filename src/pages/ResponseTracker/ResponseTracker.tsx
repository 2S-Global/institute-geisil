import { AdminLayout } from "@/components/AdminLayout"
import { PageHeader } from "@/components/dashboard/PageHeader"
import Button from "@mui/material/Button"
import ButtonBase from "@mui/material/ButtonBase"
import { Download, Plus } from "lucide-react"
import ApiLogsPage from "./components/ApiLogsPage"

const ResponseTracker = () => {



    return <div>
        <AdminLayout>


            <ApiLogsPage />



        </AdminLayout>
    </div>
}
export default ResponseTracker