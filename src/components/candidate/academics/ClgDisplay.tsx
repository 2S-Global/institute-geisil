import React, { useState, useEffect } from "react";
import { BadgeCheck, BadgeAlert,Pencil } from "lucide-react";
const ClgDisplay = ({ data, openModalRH }) => {
  return (
   <div className="rounded-lg border bg-white p-4 shadow-sm">
  {/* Header */}
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

    {/* Edit / Remarks */}
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
        {/* <Info size={18} className="text-blue-500" /> */}
      </span>
    )}
  </div>

  {/* Details */}
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
</div>
  );
};

export default ClgDisplay;
