import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, CircleX, CircleCheck, Plus } from "lucide-react";
import API from "../../../lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormModal from "./PersonalModal";
import { Skeleton } from "@/components/ui/skeleton";

const PersonalSection = ({ setRefresh }) => {
  const [modalType, setModalType] = useState(null);
  const [focusSection, setFocusSection] = useState(null);
  const [targetLanguageId, setTargetLanguageId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [personalDetails, setPersonalDetails] = useState({
    gender: "",
    maritalStatus: "",
    moreinfo: "",
    dob: "",
    category: "",
    differentlyAbled: "",
    disabilityType: "",
    disabilityDescription: "",
    workplaceAssistance: "",
    partner_name: "",
    careerBreak: "",
    careerBreakReason: "",
    careerBreakStartYear: "",
    careerBreakStartMonth: "",
    currentlyOnCareerBreak: false,
    careerBreakEndYear: "",
    careerBreakEndMonth: "",
    workPermit: "",
    address: "",
    languages: [],
    languagesDetails: [],
    usa_visa_type: "",
  });

  const [reload, setReload] = useState(false);
  const [sectionloading, setSectionloading] = useState(true);

  useEffect(() => {
    const fetchuserdata = async () => {
      try {
        setSectionloading(true);
        const response = await API.get(
          `/api/candidate/personal/get_personal_details_with_name`
        );
        if (response.status === 200) {
          const maindata = response.data.data;
          setPersonalDetails(maindata);
        }
      } catch (error) {
        console.error("Error fetching personal data:", error);
      } finally {
        setSectionloading(false);
      }
    };
    fetchuserdata();
  }, [reload]);

  const openModalRH = (type, langId = null) => {
    setModalType(type);
    setFocusSection(type);
    setTargetLanguageId(langId);
    document.body.style.overflow = "hidden";
  };

  const closeModalRH = () => {
    setModalType(null);
    setFocusSection(null);
    setTargetLanguageId(null);
    document.body.style.overflow = "auto";
  };

  const getFormattedDOB = (dob) => {
    if (!dob) return "";
    const date = new Date(dob);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  const hasPersonalData = !!(
    personalDetails.gender ||
    personalDetails.maritalStatus ||
    personalDetails.dob ||
    personalDetails.address ||
    personalDetails.category
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6">
          <div>
            <CardTitle className="text-base sm:text-lg">Personal Details</CardTitle>
            <CardDescription></CardDescription>
          </div>

          {hasPersonalData ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openModalRH("editPersonal")}
              title="Edit Personal Details"
              className="self-end sm:self-auto"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => openModalRH("editPersonal")}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Personal Details
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          {sectionloading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-muted" />
                <Skeleton className="h-4 w-40 bg-muted" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-muted" />
                <Skeleton className="h-4 w-40 bg-muted" />
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Personal */}
                  <div>
                    <strong className="text-sm font-semibold text-gray-900">Personal</strong>
                    <div className="mt-1 text-xs sm:text-sm">
                      <div>
                        {[
                          personalDetails.gender,
                          personalDetails.maritalStatus,
                          personalDetails.moreinfo,
                        ]
                          .filter(Boolean)
                          .join(", ") || (
                          <span className="text-gray-400 text-xs italic"></span>
                        )}

                        {![
                          personalDetails.gender,
                          personalDetails.maritalStatus,
                          personalDetails.moreinfo,
                        ].every(Boolean) && (
                          <span
                            className="ml-2 inline-block cursor-pointer font-semibold text-blue-600 hover:underline"
                            onClick={() => openModalRH("personalInfo")}
                          >
                            Add more info
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Partner Name */}
                  {personalDetails.partner_name && (
                    <div>
                      <strong className="text-sm font-semibold text-gray-900">Partner Name</strong>
                      <div
                        className="mt-1 text-xs sm:text-sm truncate"
                        title={personalDetails.partner_name || ""}
                      >
                        {personalDetails.partner_name || "N/A"}
                      </div>
                    </div>
                  )}

                  {/* Career Break */}
                  <div>
                    <strong className="text-sm font-semibold text-gray-900">Career Break</strong>
                    <div className="mt-1 text-xs sm:text-sm">
                      {personalDetails.careerBreak ? (
                        personalDetails.careerBreak.toLowerCase() === "yes" ? (
                          <div>
                            <div>
                              Yes
                              {personalDetails.careerBreakReason && (
                                <> – {personalDetails.careerBreakReason}</>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 text-xs">
                              <div>
                                <strong>From:</strong>{" "}
                                {personalDetails.careerBreakStartMonth}{" "}
                                {personalDetails.careerBreakStartYear}
                              </div>
                              <div>
                                <strong>To:</strong>{" "}
                                {personalDetails.currentlyOnCareerBreak
                                  ? "Present"
                                  : `${personalDetails.careerBreakEndMonth} ${personalDetails.careerBreakEndYear}`}
                              </div>
                            </div>
                          </div>
                        ) : (
                          personalDetails.careerBreak
                        )
                      ) : (
                        <span
                          className="cursor-pointer font-semibold text-blue-600 hover:underline"
                          onClick={() => openModalRH("careerBreak")}
                        >
                          Add Career Break
                        </span>
                      )}
                    </div>
                  </div>

                  {/* DOB */}
                  <div>
                    <strong className="text-sm font-semibold text-gray-900">Date of Birth</strong>
                    <div className="mt-1 text-xs sm:text-sm">
                      {getFormattedDOB(personalDetails.dob) || (
                        <span
                          className="cursor-pointer font-semibold text-blue-600 hover:underline"
                          onClick={() => openModalRH("dob")}
                        >
                          Add Date of Birth
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <strong className="text-sm font-semibold text-gray-900">Category</strong>
                    <div className="mt-1 text-xs sm:text-sm">
                      {personalDetails.category || (
                        <span
                          className="cursor-pointer font-semibold text-blue-600 hover:underline"
                          onClick={() => openModalRH("category")}
                        >
                          Add Category
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Work Permit */}
                  <div>
                    <strong className="text-sm font-semibold text-gray-900">Work Permit</strong>
                    <div className="mt-1 text-xs sm:text-sm space-y-1">
                      {personalDetails.usa_visa_type && (
                        <div>{personalDetails.usa_visa_type}</div>
                      )}
                      {personalDetails.workPermit && (
                        <div>{personalDetails.workPermit}</div>
                      )}
                      {!personalDetails.usa_visa_type &&
                        !personalDetails.workPermit && (
                          <div
                            className="cursor-pointer font-semibold text-blue-600 hover:underline"
                            onClick={() => openModalRH("workPermit")}
                          >
                            Add Work Permit
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <strong className="text-sm font-semibold text-gray-900">
                      Hometown & Permanent address
                    </strong>
                    <div className="mt-1 text-xs sm:text-sm break-words">
                      {personalDetails.address || (
                        <span
                          className="cursor-pointer font-semibold text-blue-600 hover:underline"
                          onClick={() => openModalRH("address")}
                        >
                          Add Address
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Differently Abled */}
                  <div>
                    <strong className="text-sm font-semibold text-gray-900">Differently Abled</strong>
                    <div className="mt-1 text-xs sm:text-sm">
                      {personalDetails.differentlyAbled ? (
                        personalDetails.differentlyAbled.toLowerCase() ===
                        "yes" ? (
                          <>
                            {[
                              personalDetails.differentlyAbled,
                              personalDetails.disabilityType,
                              personalDetails.disabilityDescription,
                              personalDetails.workplaceAssistance,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </>
                        ) : (
                          personalDetails.differentlyAbled
                        )
                      ) : (
                        <span
                          className="cursor-pointer font-semibold text-blue-600 hover:underline"
                          onClick={() => openModalRH("differentlyAbled")}
                        >
                          Add Differently Abled Status
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <hr className="my-6 sm:my-8" />

                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h5 className="text-base sm:text-lg font-bold">Languages</h5>
                  <Button
                    size="sm"
                    onClick={() => openModalRH("languages", null)}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Languages
                  </Button>
                </div>

                {personalDetails.languages &&
                personalDetails.languages.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-[600px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700 w-1/3">
                            Language
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700 w-1/4">
                            Proficiency
                          </th>
                          <th className="px-3 sm:px-4 py-3 text-center font-semibold text-gray-700 w-12">
                            Read
                          </th>
                          <th className="px-3 sm:px-4 py-3 text-center font-semibold text-gray-700 w-12">
                            Write
                          </th>
                          <th className="px-3 sm:px-4 py-3 text-center font-semibold text-gray-700 w-12">
                            Speak
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-right font-semibold text-gray-700 w-16">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {personalDetails.languages.map((lang, index) => {
                          const matchingDetailsObj =
                            personalDetails.languagesDetails?.[index];
                          const correctHexId = matchingDetailsObj
                            ? matchingDetailsObj._id
                            : null;

                          return (
                            <tr
                              key={index}
                              className="hover:bg-gray-50/70 transition-colors"
                            >
                              <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                                {lang.language_name || lang.language}
                              </td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 whitespace-nowrap">
                                {lang.proficiency_name || lang.proficiency}
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                                <div className="flex justify-center">
                                  {lang.read ? (
                                    <CircleCheck color="#00A85A" size={18} />
                                  ) : (
                                    <CircleX color="#FF0000" size={18} />
                                  )}
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                                <div className="flex justify-center">
                                  {lang.write ? (
                                    <CircleCheck color="#00A85A" size={18} />
                                  ) : (
                                    <CircleX color="#FF0000" size={18} />
                                  )}
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                                <div className="flex justify-center">
                                  {lang.speak ? (
                                    <CircleCheck color="#00A85A" size={18} />
                                  ) : (
                                    <CircleX color="#FF0000" size={18} />
                                  )}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    openModalRH("languages", correctHexId)
                                  }
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                    No languages added yet. Use the button above to add your
                    language proficiency.
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {modalType && (
        <FormModal
          show={!!modalType}
          onClose={closeModalRH}
          focusSection={focusSection}
          targetLanguageId={targetLanguageId}
          reload={reload}
          setReload={setReload}
          setError={setError}
          setSuccess={setSuccess}
          setRefresh={setRefresh}
          error={error}
        />
      )}
    </>
  );
};

export default PersonalSection;