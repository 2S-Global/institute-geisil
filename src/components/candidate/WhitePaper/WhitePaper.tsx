

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Pencil } from "lucide-react";
// import API from "@/lib/axios";
// import WhitePaperModal from "./WhitePeperModal";

// // Month dictionary array matching your modal array layout
// const monthNames = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];

// const toCamelCaseTitle = (title: string = "") => {
//   return title
//     .toLowerCase()
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// const WhitePaper = () => {
//   const [sectionLoading, setSectionLoading] = useState(true);
//   const [whitePapers, setWhitePapers] = useState<any[]>([]);

//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<any>(null);

//   const fetchWhitePaperData = async () => {
//     try {
//       setSectionLoading(true);

//       const response = await API.get(
//         "/api/candidate/accomplishments/get_research_publication",
//       );

//       // Your API structure passes payload inside response.data.data or direct response.data
//       // Double check your structure matches response.data.data
//       if (response.status === 200) {
//         setWhitePapers(response.data.data || []);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setSectionLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWhitePaperData();
//   }, []);

//   // Helper function to safely process and structure the display text for dates
//   const formatPublishedDate = (publishedOn: any) => {
//     if (!publishedOn) return "Not Specified";
    
//     const year = publishedOn.year;
//     // Handle both field alternatives: 'month_id' or raw string 'month'
//     const monthId = publishedOn.month_id || publishedOn.month; 

//     if (!year && !monthId) return "Not Specified";

//     const parsedMonthId = parseInt(monthId, 10);
//     const monthName = !isNaN(parsedMonthId) && parsedMonthId >= 1 && parsedMonthId <= 12
//       ? monthNames[parsedMonthId - 1]
//       : "";

//     return `${monthName} ${year || ""}`.trim();
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle className="text-lg">
//               White Paper / Research Publication / Journal Entry
//             </CardTitle>
//             <CardDescription />
//           </div>

//           <Button
//             onClick={() => {
//               setSelectedItem(null);
//               setOpen(true);
//             }}
//           >
//             + Add New
//           </Button>
//         </CardHeader>

//         <CardContent>
//           {sectionLoading ? (
//             <p className="text-sm text-gray-500">Loading...</p>
//           ) : whitePapers?.length > 0 ? (
//             <div className="space-y-4">

//               {whitePapers.map((item: any) => (
//                 <div
//                   key={item._id}
//                   className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
//                 >
//                   {/* HEADER ROW */}
//                   <div className="flex items-start justify-between gap-4">
//                     <h3 className="text-sm font-semibold text-gray-900">
//                       {toCamelCaseTitle(item.title)}
//                     </h3>

//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 shrink-0"
//                       onClick={() => {
//                         setSelectedItem(item);
//                         setOpen(true);
//                       }}
//                     >
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   {/* URL */}
//                   {item.url && (
//                     <a
//                       href={item.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm text-blue-600 break-all mt-1 inline-block hover:underline"
//                     >
//                       {item.url}
//                     </a>
//                   )}

//                   {/* DATE - FIXED RENDERING LOGIC */}
//                   <p className="text-xs text-gray-500 mt-2">
//                     <span className="font-medium text-gray-600">Published On:</span>{" "}
//                     {formatPublishedDate(item.publishedOn)}
//                   </p>

//                   {/* DESCRIPTION */}
//                   {item.description && (
//                     <p className="text-sm text-gray-700 mt-3 whitespace-pre-line">
//                       {item.description}
//                     </p>
//                   )}
//                 </div>
//               ))}

//             </div>
//           ) : (
//             <p className="text-sm text-gray-500">
//               No White Paper / Research Publication found.
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* MODAL */}
//       <WhitePaperModal
//         open={open}
//         onOpenChange={setOpen}
//         item={selectedItem}
//         fetchWhitePaperData={fetchWhitePaperData}
//       />
//     </>
//   );
// };

// export default WhitePaper;


import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import API from "@/lib/axios";
import WhitePaperModal from "./WhitePeperModal";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Title formatting (clean professional look)
const toCamelCaseTitle = (title: string = "") => {
  return title
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Professional date formatter (FIXED)
const formatPublishedDate = (publishedOn: any) => {
  if (!publishedOn) return "Not Specified";

  const { month, year } = publishedOn;

  if (!month && !year) return "Not Specified";

  const monthName =
    typeof month === "string"
      ? month
      : monthNames?.[month - 1] || "";

  if (monthName && year) return `${monthName} ${year}`;
  if (monthName) return monthName;
  if (year) return `${year}`;

  return "Not Specified";
};

const WhitePaper = () => {
  const [sectionLoading, setSectionLoading] = useState(true);
  const [whitePapers, setWhitePapers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchWhitePaperData = async () => {
    try {
      setSectionLoading(true);

      const response = await API.get(
        "/api/candidate/accomplishments/get_research_publication"
      );

      if (response.status === 200) {
        setWhitePapers(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSectionLoading(false);
    }
  };

  useEffect(() => {
    fetchWhitePaperData();
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              White Paper / Research Publication / Journal Entry
            </CardTitle>
            <CardDescription />
          </div>

          <Button
            onClick={() => {
              setSelectedItem(null);
              setOpen(true);
            }}
          >
            + Add New
          </Button>
        </CardHeader>

        <CardContent>
          {sectionLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : whitePapers?.length > 0 ? (
            <div className="space-y-4">

              {whitePapers.map((item: any) => (
                <div
                  key={item._id}
                  className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* TITLE + EDIT */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className=" font-semibold text-gray-900">
                      {toCamelCaseTitle(item.title)}
                    </h3>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => {
                        setSelectedItem(item);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* URL */}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" text-blue-600 break-all mt-1 inline-block hover:underline"
                    >
                      {item.url}
                    </a>
                  )}

                  {/* DATE (FIXED OUTPUT) */}
                  <p className=" text-gray-500 mt-2">
                    <span className="font-medium text-gray-600">
                      Published On:
                    </span>{" "}
                    {formatPublishedDate(item.publishedOn)}
                  </p>

                  {/* DESCRIPTION */}
                  {item.description && (
                    <p  className=" text-[#4B5563] mt-4 leading-relaxed text-left break-words prose max-w-none">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}

            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No White Paper / Research Publication found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* MODAL */}
      <WhitePaperModal
        open={open}
        onOpenChange={setOpen}
        item={selectedItem}
        fetchWhitePaperData={fetchWhitePaperData}
      />
    </>
  );
};

export default WhitePaper;