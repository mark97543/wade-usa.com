const dateBlur = (value, setter) => {
    let mm, dd, yy;
  
    if (/^\d{6}$/.test(value)) { // Six digits: MMYYDD or MMDDYY
      // Assuming MMYYDD for now (you'll need logic to determine the actual format if both are possible)
      mm = value.substring(0, 2);
      yy = value.substring(2, 4);
      dd = value.substring(4, 6);
  
       // Add century to the year to avoid Y2K-like issues
       yy = '20' + yy;  //  or  yy = (parseInt(yy) < 50) ? '20' + yy : '19' + yy;
  
    } else if (/^\d{8}$/.test(value)) { // Eight digits YYYYMMDD
      yy = value.substring(0, 4);
      mm = value.substring(4, 6);
      dd = value.substring(6, 8);
  
    } else if (/^\d{2}\/\d{2}\/\d{2}$/.test(value)) {  // Format MM/DD/YY
      [mm, dd, yy] = value.split('/');
        yy = '20' + yy;  //  or conditional logic as above
  
  
    } else {
      // Handle invalid formats or other cases
      setter(null); // Or an error message, or keep the original value
      return;
    }
  
  
    // Validate the date components (e.g., ensure month is 1-12, day is within the month's range)
     try {
          const date = new Date(yy, mm - 1, dd); // Month is 0-indexed in Date constructor
           if (isNaN(date)) {
              setter(null);  // Or handle invalid date
              return;
           }
  
           //Now, reformat:
           const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
          setter(formattedDate);
      } catch (error) {
          setter(null);  //Or handle the error
      }
  
  };

export {dateBlur}