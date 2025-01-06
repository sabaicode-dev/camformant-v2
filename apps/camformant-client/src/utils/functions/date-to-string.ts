export function formatDate(dateString: string | Date) {
  const date = new Date(dateString);

  // use the 'en-TH' locale (for Thailand) and specify the time zone offset.
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Bangkok", // Specify Thailand's time zone (UTC +7)
  };

  // Format the date with the desired time zone and return it
  const formattedDate = date.toLocaleString("en-GB", options);
  return formattedDate;
}

