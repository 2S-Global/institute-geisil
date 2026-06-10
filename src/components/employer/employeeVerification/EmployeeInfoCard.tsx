import React from "react";

const EmployeeInfoCard = ({ user }) => {

    const VerifyIcon = ({ status }) => {
      // 🔴 Case 1: Not worked → always red cross
      if (user.workedHere === false || user.workedInCompany === false) {
        return <span style={styles.red}>✖</span>;
      }

      // 🟢 Verified
      if (status === true) {
        return <span style={styles.green}>✔</span>;
      }

      // 🟠 Pending
      return <span style={styles.orange}>⏳</span>;
    };
  return (
 <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-white mb-4">
  <div className="p-5">

    {/* TITLE */}
    <h5 className="text-xl font-bold text-gray-800 mb-5 border-b pb-2">
      Employment Information
    </h5>

    {/* GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">

      {/* Designation */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Designation
        </span>
        <span className="text-sm fon-s text-gray-900 flex items-center gap-2">
          {user.designation || "N/A"}
          <VerifyIcon status={user.designation_verified} />
        </span>
      </div>

      {/* Employment Type */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Employment Type
        </span>
        <span className="text-sm fon-s text-gray-900 flex items-center gap-2">
          {user.employmenttype
            ? user.employmenttype.charAt(0).toUpperCase() +
              user.employmenttype.slice(1)
            : "N/A"}
          <VerifyIcon status={user.employmenttype_verified} />
        </span>
      </div>

      {/* Joining Date */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Joining Date
        </span>
        <span className="text-sm fon-s text-gray-900 flex items-center gap-2">
          {user.joiningdate || "N/A"}
          <VerifyIcon status={user.duration_verified} />
        </span>
      </div>

      {/* Leave Date */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Leave Date
        </span>
        <span className="text-sm fon-s text-gray-900 flex items-center gap-2">
          {user.leavedate || "N/A"}
          <VerifyIcon status={user.duration_verified} />
        </span>
      </div>

      {/* Currently Employed */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-600">
          Currently Employed
        </span>

        <span>
          {user.currentlyemployed ? (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md bg-green-100 text-green-700">
              Yes
            </span>
          ) : (
            <><span className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md bg-gray-500 text-gray-700 text-white">
              No
            </span>
</>
          )}
        </span>
      </div>

    </div>

    {/* remarks */}
      <div className="flex mt-4">
        <span className="text-sm font-bold text-gray-600 pr-5">
          Remarks
        </span>
        <span className="text-sm fon-s text-gray-900 flex items-center gap-2 text-justify">
          {user.remarks || "N/A"}
        </span>
      </div>
  </div>
 </div>
  );
};

const styles = {
  green: {
    color: "white",
    backgroundColor: "green",
    borderRadius: "50%",
    padding: "2px 6px",
    marginLeft: "8px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  orange: {
    color: "white",
    backgroundColor: "orange",
    borderRadius: "50%",
    padding: "2px 6px",
    marginLeft: "8px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  red: {
    color: "white",
    backgroundColor: "red",
    borderRadius: "50%",
    padding: "2px 6px",
    marginLeft: "8px",
    fontSize: "12px",
    fontWeight: "bold",
  },
};
export default EmployeeInfoCard;
