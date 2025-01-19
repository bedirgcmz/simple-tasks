// utils/localstorage.js

// LocalStorage'den veri alma fonksiyonu
export const getDataFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null; // Eğer data varsa JSON parse edilir, yoksa null döner
  };
  
  // LocalStorage'e veri kaydetme fonksiyonu
  export const setDataToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  