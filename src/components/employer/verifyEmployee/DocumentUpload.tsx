import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  label: string;
  name: string;
  valuename: string;
  numbername: string;
  numberError?: string;
  disabled?: boolean;
  formData: any;
  onFileChange: (name: string, file: File | null) => void;
  onfieldChange: (e: any) => void;
  onfieldValidation: (e: any) => void;
}

const DocumentUpload = ({
  label,
  name,
  valuename,
  numbername,
  numberError,
  disabled,
  formData,
  onFileChange,
  onfieldChange,
  onfieldValidation,
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [sameAsName, setSameAsName] = useState(false);

  const handleFile = (e: any) => {
    const selected = e.target.files[0];

    if (selected) {
      setFile(selected);
      onFileChange(name, selected);
    }
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-xl p-4 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="space-y-2">
        <Label>{label} Number</Label>

        <Input
          name={`${name}number`}
          value={numbername}
          onChange={onfieldChange}
          onBlur={onfieldValidation}
          placeholder={`Enter ${label} Number`}
        />

        {numberError && <p className="text-sm text-red-500">{numberError}</p>}
      </div>

      <div className="space-y-2">
        <Label>Name as per {label}</Label>

        <Input
          name={`${name}name`}
          value={valuename}
          disabled={sameAsName}
          onChange={onfieldChange}
          placeholder={`Enter Name`}
          className={
            sameAsName
              ? "text-black opacity-100 disabled:text-black disabled:opacity-100"
              : ""
          }
        />

        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            checked={sameAsName}
            onCheckedChange={(checked: boolean) => {
              setSameAsName(checked);

              onfieldChange({
                target: {
                  name: `${name}name`,
                  value: checked ? formData.name : "",
                },
              });
            }}
          />

          <p className="text-sm">Same as Full Name</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Upload {label}</Label>

        <Input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFile}
        />

        {file && (
          <div className="flex items-center justify-between rounded-md border p-2">
            <span className="text-sm truncate">{file.name}</span>

            <Trash2
              className="h-4 w-4 cursor-pointer text-red-500"
              onClick={() => {
                setFile(null);
                onFileChange(name, null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
