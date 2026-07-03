import React, { useState, useEffect } from "react";
import { BadgeCheck, BadgeAlert,Pencil,Briefcase,Trash2,Calendar,MapPin,GraduationCap} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const SchoolDisplay = ({ data, openModalRH }) => {
  // console.log("inside display :", data);
  return (
    <>
     {/* <div className="rounded-lg border bg-white p-4 shadow-sm">
  
  <div className="flex items-start justify-between">
    <div>
      <h3 className="text-base font-semibold text-gray-900">
        {data?.level}
      </h3>
    </div>

    <button
      onClick={() => openModalRH(data.level_id, data._id)}
      className="rounded-md p-2 hover:bg-gray-100 transition-colors"
      title="Edit"
    >
      <Pencil className="h-4 w-4 text-gray-600" />
    </button>
  </div>

  
  <div className="mt-4 space-y-2 text-sm text-gray-600">
    <div>
      <span className="font-medium text-gray-800">Board:</span>{" "}
      {data.board}
    </div>

    <div>
      <span className="font-medium text-gray-800">Year of Passing:</span>{" "}
      {data.year_of_passing}
    </div>
  </div>
</div> */}
   <Card key={data._id}>
    <CardContent className="p-5 flex items-start gap-4">
      <div className="h-11 w-11 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{data?.level}</p>
        <p className="text-sm text-muted-foreground">{data?.board}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {data.year_of_passing}</span>
          <span></span>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModalRH(data.level_id, data._id)}><Pencil className="h-3.5 w-3.5"  /></Button>
    </CardContent>
  </Card>


                    </>
  );
};

export default SchoolDisplay;
