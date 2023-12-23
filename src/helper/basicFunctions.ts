export function convertTimestampToIndianDateTime(timestamp: number): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDateTime: string = new Intl.DateTimeFormat(
    "en-IN",
    options
  ).format(timestamp * 1000);

  return formattedDateTime;
}
