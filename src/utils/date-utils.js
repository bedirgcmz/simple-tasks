export function formatToShortDate(dateString) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const date = new Date(dateString);
  
    if (isNaN(date)) {
      throw new Error("Invalid date format");
    }
  
    const day = date.getDate();
    const month = months[date.getMonth()];
  
    return `${day} ${month}`;
  }
  