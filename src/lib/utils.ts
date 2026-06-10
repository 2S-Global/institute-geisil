import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const YMD = (input) => {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const DMY = (input) => {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

export function nameFormate(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(v =>
      v.charAt(0).toUpperCase() + v.slice(1)
    )
    .join(" ");
}


/* 
export function timeAgo(dateInput) {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}  */

  export function timeAgo(dateInput) {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return "";

  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  console.log("startOfDate",startOfDate)

  const diffDays = Math.floor(
    (startOfToday - startOfDate) / (1000 * 60 * 60 * 24)
  );

  // same day
  if (diffDays === 0) return "Today";

  // older than today
  return `${diffDays}d ago`;
}


  
// date day month
export function DM(dateInput) {
const date = new Date(dateInput);
const formatted = date.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
});
return formatted
}



const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^[0-9]{10}$/;

// Percentage: 0 - 100
const percentageRegex = /^(100(\.0+)?|[0-9]{1,2}(\.[0-9]{1,2})?)$/;

// CGPA: 0 - 10   // DGPA: 0 - 10
const cgpaDgpaRegex = /^(10(\.0+)?|[0-9](\.[0-9]{1,2})?)$/;

export function email(email) {
    if (!emailRegex.test(email)) {
      return true
    }
}

export function phone(phone) {
    if (!phoneRegex.test(phone)) {
      return true
    }
}


export function percentage(val) {
    if (!percentageRegex.test(val)) {
      return true
    }
}


