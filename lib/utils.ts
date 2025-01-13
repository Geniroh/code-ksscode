import { techMap } from "@/constant/techMap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, getHours } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLocaleLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
};

export const customFormatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, "yyyy-MM-dd");
};

export const format12HTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return format(date, "h:mm a");
};

export const getTimeStamp = (dateString: string) => {
  const now = new Date();
  const date = parseISO(dateString);
  const secondsAgo = Math.floor((now.getTime() - date?.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

export const getTimeOfDay = (date: Date) => {
  const hours = getHours(date);

  if (hours >= 5 && hours < 12) {
    return "morning";
  } else if (hours >= 12 && hours < 17) {
    return "afternoon";
  } else {
    return "evening";
  }
};
