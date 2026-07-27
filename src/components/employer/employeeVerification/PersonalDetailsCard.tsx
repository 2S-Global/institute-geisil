import React from "react";

const PersonalInfoCard = ({ user }) => {
  return (
   <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-white mb-4">
  <div className="p-5">

    {/* TITLE */}
    <h5 className="text-xl font-bold text-gray-800 mb-5 border-b pb-2">
      Personal Information
    </h5>

    {/* GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">

      {/* Name */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Name
        </span>
        <span className="text-sm fon-s text-gray-900">
          {user.name || "N/A"}
        </span>
      </div>

      {/* Father Name */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Father Name
        </span>
        <span className="text-sm fon-s text-gray-900">
          {user.father_name || "N/A"}
        </span>
      </div>

      {/* Email */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Email
        </span>
        <span className="text-sm fon-s text-gray-900">
          {user.email || "N/A"}
        </span>
      </div>

      {/* Mobile Number */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Mobile Number
        </span>
        <span className="text-sm fon-s text-gray-900">
          {user.mobile || "N/A"}
        </span>
      </div>

      {/* Date of Birth */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Date of Birth
        </span>
        <span className="text-sm fon-s text-gray-900">
          {user?.dob?.split("-").reverse().join("-") 
           
        || "N/A"}
        </span>
      </div>

      {/* Gender */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Gender
        </span>
        <span className="text-sm fon-s text-gray-900">
          {user.gender || "N/A"}
        </span>
      </div>

      {/* Address */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Address
        </span>
        <span className="text-sm fon-s text-gray-900 break-words text-right">
          {user.address || "N/A"}
        </span>
      </div>

      {/* PAN */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Pan Number
        </span>
        <span className="text-sm fon-s text-gray-900">
          {user.pan || "N/A"}
        </span>
      </div>

    </div>
  </div>
</div>
  );
};

export default PersonalInfoCard;
