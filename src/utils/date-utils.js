  export const truncateText = (pText, pNumber) =>
  pText.length > pNumber ? `${pText.slice(0, pNumber)}...` : pText;
  
export function formatToShortDate(dateString, language = "en") {
  const monthNames = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haz", "Tem", "Ağu", "Eylül", "Ekim", "Kasım", "Ara"],
    sv: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  };

  const date = new Date(dateString);

  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }

  const day = date.getDate();
  const month = monthNames[language] || monthNames["en"]; // Eğer geçersiz dil varsa İngilizce kullan
  const shortMonth = month[date.getMonth()];

  return `${day} ${shortMonth}`;
}
