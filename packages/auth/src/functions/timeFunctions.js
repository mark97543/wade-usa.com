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

/**
 * Converts an ISO 8601 date string from Directus into a 'MMM-DD-YY' format.
 * @param {string} isoDateString - The date string from Directus (e.g., "2025-06-14T12:00:00.000Z").
 * @returns {string} The formatted date string (e.g., "Jun-14-25").
 */
export const formatDirectusDateToMMDDYY = (isoDateString) => {
  if (!isoDateString) return ''; // Handle empty or null dates

  const date = new Date(isoDateString);

  // Get year in YY format (last two digits)
  const year = date.getFullYear().toString().slice(-2);
  
  // Get month name abbreviation
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  
  // Get day of the month, not padded for this format
  const day = date.getDate();

  // Format as MMM-DD-YY
  return `${month}-${day}-${year}`;
};

/**
 * Converts an ISO 8601 date string from Directus into 'MMM-DD-YY at HH:MM' format.
 * @param {string} isoDateString - The date string from Directus (e.g., "2025-06-14T12:30:00.000Z").
 * @returns {string} The formatted date string (e.g., "Jun-14-25 at 12:30").
 */
export const formatDirectusDateTime = (isoDateString) => {
  if (!isoDateString) return ''; // Handle empty or null dates

  const date = new Date(isoDateString);

  // --- Reusing the date logic ---
  const year = date.getFullYear().toString().slice(-2);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  // --- New time logic ---
  const hours = date.getHours().toString().padStart(2, '0'); // Get hours (0-23) and pad
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad

  // --- Combine date and time ---
  return `${month}-${day}-${year} at ${hours}:${minutes}`;
};