import React from "react";
import { BadgeCheck } from "lucide-react";

const EmployeeInfoCard = ({ user }) => {
  const VerifyIcon = ({ verified }) => (
    <BadgeCheck
      className={verified ? "text-green-500" : "text-red-500"}
      size={18}
    />
  );

  return (
    <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-white mb-4">
      <div className="p-5">
        <h5 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-2">
          Academic Information
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Level of Education */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Level of Education</p>

            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">
                {user.levelname || "N/A"}
              </p>

              <VerifyIcon verified={user?.level_verified} />
            </div>
          </div>

          {/* Course Type */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Course Type</p>

            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">
                {user.courseTypename
                  ? user.courseTypename.charAt(0).toUpperCase() +
                    user.courseTypename.slice(1)
                  : "N/A"}
              </p>

              <VerifyIcon verified={user?.courseType_verified} />
            </div>
          </div>

          {/* Course Name */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Course Name</p>

            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">
                {user.courseName || "N/A"}
              </p>

              <VerifyIcon verified={user?.courseName_verified} />
            </div>
          </div>

          {/* Course Duration */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Course Duration</p>

            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">
                {user.durationstring || "N/A"}
              </p>

              <VerifyIcon verified={user?.duration_verified} />
            </div>
          </div>

          {/* Grading System */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Grading System</p>

            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">
                {user.gradingSystem
                  ? user.gradingSystem.charAt(0).toUpperCase() +
                    user.gradingSystem.slice(1)
                  : "N/A"}
              </p>

              <VerifyIcon verified={user?.gradingSystem_verified} />
            </div>
          </div>

          {/* Marks */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Marks</p>

            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">{user.marks || "N/A"}</p>

              <VerifyIcon verified={user?.marks_verified} />
            </div>
          </div>

          {/* Remarks */}
          {user.remarks && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Remarks</p>

              <p className="font-medium text-gray-800">
                {user.remarks || "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;
