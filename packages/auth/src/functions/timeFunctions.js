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


/**
 * Converts an ISO 8601 date string from Directus into 'HH:MM' (24-hour) format.
 * @param {string} isoDateString - The date string from Directus (e.g., "2025-06-14T12:30:00.000Z").
 * @returns {string} The formatted time string (e.g., "12:30").
 */
export const formatDirectusTimeOnly = (isoDateString) => {
    if (!isoDateString) return ''; // Handle empty or null dates

    const date = new Date(isoDateString);

    // --- Isolate only the time logic ---
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // --- Return just the time ---
    return `${hours}:${minutes}`;
};


/**
 * Adds a specified number of hours and minutes to an ISO date string.
 *
 * @param {string} isoDateString - The starting date and time in ISO 8601 format (e.g., "2025-07-10T10:00:00").
 * @param {number} hoursToAdd - The number of hours to add to the date.
 * @param {number} minutesToAdd - The number of minutes to add to the date.
 * @returns {Date} A new Date object with the added duration.
 */
export const addDurationToDate = (isoDateString, hoursToAdd, minutesToAdd) => {
  // Create a new Date object from the string to avoid modifying an original object.
  const newDate = new Date(isoDateString);

  // Add the duration using the 'set' methods.
  // JavaScript's Date object handles rollovers (e.g., going to the next day) automatically.
  newDate.setHours(newDate.getHours() + hoursToAdd);
  newDate.setMinutes(newDate.getMinutes() + minutesToAdd);

  // Return the newly calculated Date object.
  return newDate;
};

// --- Example of how to use it ---
/*
const startTime = '2025-07-10T23:00:00'; // 11:00 PM
const tripDurationHours = 3;
const tripDurationMinutes = 30;

const arrivalTime = addDurationToDate(startTime, tripDurationHours, tripDurationMinutes);

console.log(arrivalTime.toLocaleString()); 
// Expected output would be the next day at 2:30 AM
*/