import React, { useState, useEffect } from "react";
import { BadgeCheck, BadgeAlert,Pencil,GraduationCap ,Calendar,Info} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const ClgDisplay = ({ data, openModalRH }) => {
  return (
    <>
   {/* <div className="rounded-lg border bg-white p-4 shadow-sm">
 
  <div className="flex items-start justify-between">
    <div>
      <div className="flex items-center gap-2">
        <h3
          className="text-base font-semibold text-gray-900 cursor-pointer"
          onClick={() => console.log("test: ", data)}
        >
          {data?.level}
        </h3>

        {data.level_verified ? (
          <BadgeCheck size={18} className="text-green-600" />
        ) : (
          <BadgeAlert size={18} className="text-red-600" />
        )}
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {data?.courseName}
        </span>

        {data.courseName_verified ? (
          <BadgeCheck size={18} className="text-green-600" />
        ) : (
          <BadgeAlert size={18} className="text-red-600" />
        )}
      </div>
    </div>

  
    {data.is_studied_here === undefined ? (
      <button
        onClick={() => openModalRH(data.level_id, data._id)}
        className="rounded-md p-2 hover:bg-gray-100"
        title="Edit details"
      >
        <Pencil className="h-4 w-4 text-gray-600" />
      </button>
    ) : (
      <span
        title={data.remarks || "No remarks"}
        className="cursor-pointer"
      >
        
      </span>
    )}
  </div>

  
  <div className="mt-4 space-y-2 text-sm text-gray-600">
    <div className="flex items-center gap-2">
      <span>{data.instituteName}</span>

      {data.is_studied_here ? (
        <BadgeCheck size={18} className="text-green-600" />
      ) : (
        <BadgeAlert size={18} className="text-red-600" />
      )}
    </div>

    <div>{data.universityName}</div>

    <div className="flex flex-wrap items-center gap-2">
      <span>
        {data.duration.from} - {data.duration.to}
      </span>

      {data.duration_verified ? (
        <BadgeCheck size={18} className="text-green-600" />
      ) : (
        <BadgeAlert size={18} className="text-red-600" />
      )}

      <span className="text-gray-400">|</span>

      <span>{data.courseType}</span>

      {data.courseType_verified ? (
        <BadgeCheck size={18} className="text-green-600" />
      ) : (
        <BadgeAlert size={18} className="text-red-600" />
      )}
    </div>
  </div>
   </div> */}
   <Card key={data._id}>
    <CardContent className="p-5 flex items-start gap-4">
      <div className="h-11 w-11 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="font-semibold text-gray-900">{data?.level}</span>
            {data?.level_verified ? (
              <BadgeCheck size={18} className="text-green-600 shrink-0" />
            ) : (
              <BadgeAlert size={18} className="text-red-600 shrink-0" />
            )}
      </div>

       <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{data?.courseName}</span>
            {data?.courseName_verified ? (
              <BadgeCheck size={18} className="text-green-600 shrink-0" />
            ) : (
              <BadgeAlert size={18} className="text-red-600 shrink-0" />
            )}
      </div>


       


{data.is_studied_here !== undefined && (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
  <span
    title={data.remarks || "No remarks"}
    className="inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100 cursor-pointer"
  >
  </span>
  </div>
)}


      <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{data?.instituteName}</span>
            {data?.is_studied_here ? (
              <BadgeCheck size={18} className="text-green-600 shrink-0" />
            ) : (
              <BadgeAlert size={18} className="text-red-600 shrink-0" />
            )}
      </div>
         <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {data.universityName}
      </div>

        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
  <span className="inline-flex items-center gap-1">
    <Calendar className="h-3 w-3" />
    {data?.duration.from} - {data?.duration.to}
    {data?.duration_verified ? (
      <BadgeCheck size={16} className="text-green-600" />
    ) : (
      <BadgeAlert size={16} className="text-red-600" />
    )}
  </span>

  <span className="inline-flex items-center gap-1">
    {data?.courseType}
    {data?.courseType_verified ? (
      <BadgeCheck size={16} className="text-green-600" />
    ) : (
      <BadgeAlert size={16} className="text-red-600" />
    )}
  </span>
</div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModalRH(data.level_id, data._id)}><Pencil className="h-3.5 w-3.5"  /></Button>
    </CardContent>
  </Card>
  </>
  );
};

export default ClgDisplay;
