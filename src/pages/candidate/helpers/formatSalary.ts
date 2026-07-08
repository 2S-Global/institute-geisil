 export const formatSalary = (salaryObj: any) => {
    if (!salaryObj) return "Salary not disclosed";
    const { structure, currency, min, max, amount, rate } = salaryObj;
    const curr = currency || "₹";
    const rt = rate ? ` ${rate}` : "";
    if (structure === "starting amount" || structure === "exact amount" || structure === "maximum amount") {
      return amount ? `${curr}${amount.toLocaleString()}${rt}` : "Salary not disclosed";
    }
    if (structure === "range" && min != null && max != null) {
      return `${curr}${min.toLocaleString()} - ${curr}${max.toLocaleString()}${rt}`;
    }
    return "Salary not disclosed";
  };