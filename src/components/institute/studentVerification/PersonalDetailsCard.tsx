import React from "react";

const PersonalInfoCard = ({ user }) => {
  return (
    <div
      className="card border shadow-sm mb-4"
      style={{ width: "100%", margin: "0 auto", height: "auto" }}
    >
      <div className="card-body p-3">
        <h5 className="card-title mb-3">Personal Information</h5>
        <div className="row g-2">
          <div className="col-sm-6">
            <strong>Name:</strong> {user.name || "N/A"}
          </div>
          <div className="col-sm-6">
            <strong>Father Name:</strong> {user.father_name || "N/A"}
          </div>
          <div className="col-sm-6">
            <strong>Email:</strong> {user.email || "N/A"}
          </div>
          <div className="col-sm-6">
            <strong>Mobile Number:</strong> {user.mobile || "N/A"}
          </div>
          <div className="col-sm-6">
            <strong>Date of Birth:</strong>{" "}
            {new Date(user.dob).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
            })}
          </div>
          <div className="col-sm-6">
            <strong>Gender:</strong> {user.gender || "N/A"}
          </div>
          <div className="col-sm-6">
            <strong>Address:</strong> {user.address || "N/A"}
          </div>
          <div className="col-sm-6">
            <strong>Pan Number:</strong> {user.pan || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
