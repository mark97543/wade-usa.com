

/**
 * Converts an ISO 8601 date string from Directus into a 'YY-MMM-DD' format.
 * @param {string} isoDateString - The date string from Directus (e.g., "2025-06-14T12:00:00.000Z").
 * @returns {string} The formatted date string (e.g., "25-Jun-14").
 */
export const formatDirectusDateToYYMMDD = (isoDateString) => {
  if (!isoDateString) return ''; // Handle empty or null dates

  const date = new Date(isoDateString);

  // Get year in YY format (last two digits)
  const year = date.getFullYear().toString().slice(-2);
  
  // Get month name abbreviation
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()]; // Gets the 3-letter month abbreviation
  
  // Get day of the month, and pad with leading zero if needed
  const day = date.getDate().toString().padStart(2, '0');

  // Format as YY-MMM-DD
  return `${year}-${month}-${day}`;
};
