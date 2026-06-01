import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

// ==============================
// TYPES
// ==============================

interface FieldType {
  _id: string;
  name: string;
  field_type: string;
  field_values?: string;
}

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

// ==============================
// UTILITY
// ==============================

export const serializeAdditionalFields = (
  fields: Record<string, any>
) => {
  return Object.entries(fields || {})
    .map(([key, val]) => {
      if (Array.isArray(val)) {
        return `${key}: ${val.join(", ")}`;
      }

      return `${key}: ${val}`;
    })
    .join(", ");
};

// ==============================
// COMPONENT
// ==============================

const Additionfield = ({
  formData,
  setFormData,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const [fieldlist, setFieldlist] = useState<
    FieldType[]
  >([]);

  // ==============================
  // FETCH FIELDS
  // ==============================

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);

        const response = await api.post(
          "/api/fields/get_all_company_fields"
        );

        if (response.data.success) {
          setFieldlist(response.data.data || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // ==============================
  // HANDLE CHANGE
  // ==============================

  const handleChange = (
    fieldName: string,
    value: any
  ) => {
    setFormData((prev: any) => ({
      ...prev,

      additionalfields: {
        ...prev.additionalfields,

        [fieldName]: value,
      },
    }));
  };

  // ==============================
  // UI
  // ==============================

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading additional fields...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {fieldlist.map((field) => (
        <div
          key={field._id}
          className="space-y-2"
        >
          <label className="text-sm font-medium">
            {field.name}
          </label>

          {/* TEXT */}
          {field.field_type === "text" && (
            <input
              type="text"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              placeholder={`Enter ${field.name}`}
              value={
                formData?.additionalfields?.[
                  field.name
                ] || ""
              }
              onChange={(e) =>
                handleChange(
                  field.name,
                  e.target.value
                )
              }
            />
          )}

          {/* TEXTAREA */}
          {field.field_type === "textarea" && (
            <textarea
              className="min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder={`Enter ${field.name}`}
              value={
                formData?.additionalfields?.[
                  field.name
                ] || ""
              }
              onChange={(e) =>
                handleChange(
                  field.name,
                  e.target.value
                )
              }
            />
          )}

          {/* SELECT */}
          {field.field_type === "select" && (
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={
                formData?.additionalfields?.[
                  field.name
                ] || ""
              }
              onChange={(e) =>
                handleChange(
                  field.name,
                  e.target.value
                )
              }
            >
              <option value="">
                Select {field.name}
              </option>

              {field.field_values
                ?.split(",")
                .map((val) => val.trim())
                .filter(Boolean)
                .map((val, idx) => (
                  <option
                    key={idx}
                    value={val}
                  >
                    {val}
                  </option>
                ))}
            </select>
          )}

          {/* RADIO */}
          {field.field_type === "radio" && (
            <div className="space-y-2 pt-1">
              {field.field_values
                ?.split(",")
                .map((val) => val.trim())
                .filter(Boolean)
                .map((val, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={val}
                      checked={
                        formData
                          ?.additionalfields?.[
                          field.name
                        ] === val
                      }
                      onChange={(e) =>
                        handleChange(
                          field.name,
                          e.target.value
                        )
                      }
                    />

                    <label className="text-sm">
                      {val}
                    </label>
                  </div>
                ))}
            </div>
          )}

          {/* CHECKBOX */}
          {field.field_type === "checkbox" && (
            <div className="space-y-2 pt-1">
              {field.field_values
                ?.split(",")
                .map((val) => val.trim())
                .filter(Boolean)
                .map((val, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={val}
                      checked={
                        formData?.additionalfields?.[
                          field.name
                        ]?.includes(val) || false
                      }
                      onChange={(e) => {
                        const currentValues =
                          formData
                            ?.additionalfields?.[
                            field.name
                          ] || [];

                        const updatedValues =
                          e.target.checked
                            ? [
                                ...currentValues,
                                val,
                              ]
                            : currentValues.filter(
                                (v: string) =>
                                  v !== val
                              );

                        handleChange(
                          field.name,
                          updatedValues
                        );
                      }}
                    />

                    <label className="text-sm">
                      {val}
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Additionfield;