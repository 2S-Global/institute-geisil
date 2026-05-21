import React from "react";

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
            <strong>Level of Education:</strong> {user.levelname}
          </div>
          <div className="col-sm-6">
            <strong>Course Type:</strong>{" "}
            {user.courseTypename
              ? user.courseTypename.charAt(0).toUpperCase() +
                user.courseTypename.slice(1)
              : ""}
          </div>
          <div className="col-sm-6">
            <strong>Course Name :</strong> {user.courseName}
          </div>
          <div className="col-sm-6">
            <strong>Course Duration :</strong> {user.durationstring}
          </div>
          <div className="col-sm-6">
            <strong>Grading System : </strong>
            {user.gradingSystem
              ? user.gradingSystem.charAt(0).toUpperCase() +
                user.gradingSystem.slice(1)
              : ""}
          </div>
          <div className="col-sm-6">
            <strong>Marks:</strong> {user.marks}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;
