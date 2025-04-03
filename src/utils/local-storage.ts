export const getFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

export const setToLocalStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

// export const setUserRoleKeyToLocalStorage = (key: string, value: string) => {
//   if (typeof window !== "undefined") {
//     localStorage.setItem(key, value);
//   }
// };

// export const getUserRoleInfoFromLocalStorage = (key: string) => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem(key);
//   }
//   return null;
// };
