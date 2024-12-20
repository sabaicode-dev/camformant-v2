export function convertDate(isoDate: string) {
  const jsDate = new Date(isoDate);

  const day = String(jsDate.getDate()).padStart(2, "0"); // Add leading zero if needed
  const month = String(jsDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = jsDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate 
}
