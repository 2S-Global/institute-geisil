import React from 'react'
import API from "../../../lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleX, Code2, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from '@/components/AdminLayout'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const WhyGEISIL = () => {
  return (
    <AdminLayout>
        <h1>hello</h1>
    </AdminLayout>
  )
}

export default WhyGEISIL