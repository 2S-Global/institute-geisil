

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { DynamicIcon } from "./DynamicIcon";

export interface VerificationItem {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  backgroundColor?: string;
  iconColor?: string;
  isActive?: boolean;
}

interface VerificationCardProps {
  item: VerificationItem;
  onEdit: (item: VerificationItem) => void;
  onDelete: (id: string) => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => (
  <Card className="relative group rounded-3xl border border-slate-100 shadow-sm bg-white p-6 overflow-hidden transition-all duration-200 hover:shadow-md">
    <div className="absolute top-5 right-5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity z-10">
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-lg border-slate-200 text-slate-500 hover:text-slate-900 bg-white"
        onClick={() => onEdit(item)}
        aria-label="Edit item"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-lg border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 bg-white"
        onClick={() => onDelete(item._id)}
        aria-label="Delete item"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>

    <CardHeader className="p-0 pb-4">
      {/* Pure Dynamic Background Color */}
      <div
        className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-colors"
        style={{ backgroundColor: item.backgroundColor || "transparent" }}
      >
        {/* Pure Dynamic Icon Color */}
        <DynamicIcon
          icon={item.icon}
          color={item.iconColor}
          className="h-7 w-7"
        />
      </div>

      <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
        {item.title}
      </CardTitle>
    </CardHeader>

    <CardContent className="p-0">
      <CardDescription className="text-slate-500 text-sm leading-relaxed break-words whitespace-pre-wrap">
        {item.description}
      </CardDescription>
    </CardContent>
  </Card>
);
