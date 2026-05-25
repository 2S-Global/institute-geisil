import React from "react";
import { BadgeCheck ,ShieldCheck } from "lucide-react";
const EmployeeInfoCard = ({ user }) => {
  return (
    <div
      className="card border shadow-sm mb-4"
      style={{ width: "100%", margin: "0 auto", height: "auto" }}
    >
      <div className="card-body p-3">
        <h5 className="card-title mb-3">Academic Information</h5>
        <div className="row g-2">
          <div className="col-sm-6">
            <div className="flex gap-2"><strong>Level of Education:</strong> {user.levelname} {user?.level_verified?<BadgeCheck className="text-green-500" size={20} />:<BadgeCheck className="text-red-500" size={20} />}</div>
          </div>
          <div className="col-sm-6">
               <div className="flex gap-2"><strong>Course Type:</strong>  {user.courseTypename
              ? user.courseTypename.charAt(0).toUpperCase() +
                user.courseTypename.slice(1)
              : ""} {user?.courseType_verified?<BadgeCheck className="text-green-500" size={20} />:<BadgeCheck className="text-red-500" size={20} />}</div>
          </div>
          <div className="col-sm-6">
            <div className="flex gap-2"><strong>Course Name:</strong> {user.courseName} {user?.courseName_verified?<BadgeCheck className="text-green-500" size={20} />:<BadgeCheck className="text-red-500" size={20} />}</div>
          </div>
          <div className="col-sm-6">
            <div className="flex gap-2"><strong>Course Duration:</strong> {user.durationstring} {user?.duration_verified?<BadgeCheck className="text-green-500" size={20} />:<BadgeCheck className="text-red-500" size={20} />}</div>
          </div>
          <div className="col-sm-6">
               <div className="flex gap-2"><strong>Grading System:</strong>  {user.gradingSystem
              ? user.gradingSystem.charAt(0).toUpperCase() +
                user.gradingSystem.slice(1)
              : ""} {user?.gradingSystem_verified?<BadgeCheck className="text-green-500" size={20} />:<BadgeCheck className="text-red-500" size={20} />}</div>
          </div>
          <div className="col-sm-6">
            <div className="flex gap-2"><strong>Marks:</strong> {user.marks} {user?.marks_verified?<BadgeCheck className="text-green-500" size={20} />:<BadgeCheck className="text-red-500" size={20} />}</div>
          </div>
            <div className="col-sm-6">
            <strong>Remarks:</strong> {user.remarks||""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;
