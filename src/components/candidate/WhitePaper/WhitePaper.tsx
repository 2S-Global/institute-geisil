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
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const toCamelCaseTitle = (title: string = "") => {
  return title
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatPublishedDate = (item: any) => {
  if (!item) return "Not Specified";
  const year = item.publishYear || item.publishedOn?.year;
  const month = item.publishMonth || item.publishedOn?.month;

  if (!month && !year) return "Not Specified";

  const monthName =
    typeof month === "string" && isNaN(Number(month))
      ? month
      : monthNames?.[Number(month) - 1] || "";

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
        "/api/candidate/accomplishments/get_research_publication",
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
            <CardDescription>
              Showcase your published research papers, white papers, and
              articles.
            </CardDescription>
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
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-gray-900">
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

                  <div className="mt-2 flex flex-col gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 break-all hover:underline w-fit"
                      >
                        {item.url}
                      </a>
                    )}

                    <CardDescription className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 w-fit">
                      Published On: {formatPublishedDate(item)}
                    </CardDescription>
                  </div>
                  {item.description && (
                    <CardDescription
                      className="text-justify"
                      // className="text-[#4B5563] mt-4 leading-relaxed text-left break-words prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center w-full shadow-sm">
              <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                <p className="text-sm">
                  {" "}
                  No White Paper / Research Publication added yet.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {open && (
        <WhitePaperModal
          key={selectedItem?._id || "new-item"}
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setSelectedItem(null);
          }}
          item={selectedItem}
          fetchWhitePaperData={fetchWhitePaperData}
        />
      )}
    </>
  );
};

export default WhitePaper;
