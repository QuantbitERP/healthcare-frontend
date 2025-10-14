import { format } from "date-fns";

/**
 * Formats given date and time strings into "dd/MM/yyyy, HH:mm:ss".
 * @param dateString - Date part (e.g., "2025-07-10")
 * @param timeString - Time part (e.g., "15:30:00")
 * @returns Formatted string or empty string if invalid
 */
export function formatVisitDateTime(
  dateString?: string | null,
  timeString?: string | null
): string {
  try {
    if (!dateString || !timeString) {
      return "";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }

    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    if (
      [hours, minutes, seconds].some((v) => isNaN(v)) ||
      hours === undefined ||
      minutes === undefined ||
      seconds === undefined
    ) {
      return "";
    }

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return format(date, "dd/MM/yyyy, HH:mm:ss");
  } catch (error) {
    console.error("Error formatting visit date and time:", error);
    return "";
  }
}
