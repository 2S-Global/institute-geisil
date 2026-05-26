import React from "react";

const PersonalInfoCard = ({ user }) => {
  return (
    <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-white mb-4">
      <div className="p-5">
        <h5 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-2">
          Personal Information
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-800">{user.name || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Father Name</p>
            <p className="font-medium text-gray-800">
              {user.father_name || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{user.email || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Mobile Number</p>
            <p className="font-medium text-gray-800">{user.mobile || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium text-gray-800">
              {user.dob
                ? new Date(user.dob).toLocaleDateString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })
                : "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium text-gray-800">{user.gender || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium text-gray-800 break-words">
              {user.address || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Pan Number</p>
            <p className="font-medium text-gray-800">{user.pan || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
