export const validateDocuments = (formData: any) => {
  const {
    pannumber,
    panname,
    licensenumber,
    licensename,
    voternumber,
    votername,
  } = formData;

  const hasAnyDoc =
    pannumber ||
    licensenumber ||
    voternumber;

  if (!hasAnyDoc) {
    return "At least one document is required.";
  }

  if (!panname && pannumber)
    return "PAN Name is required.";

  if (panname && !pannumber)
    return "PAN Number is required.";

  if (!licensename && licensenumber)
    return "Driving License Name is required.";

  if (licensename && !licensenumber)
    return "Driving License Number is required.";

  if (!votername && voternumber)
    return "EPIC Name is required.";

  if (votername && !voternumber)
    return "EPIC Number is required.";

  return null;
};