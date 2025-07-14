import { authKey } from "@/constants/storageKey";
import { decodedToken } from "../../utils/jwt";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";

export const storeUserInfo = ({ access_token }: { access_token: string }) => {
  return setToLocalStorage(authKey, access_token);
};

export const removeUserInfo = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(authKey);
  }
};

export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    const decodedData = decodedToken(authToken);
    return decodedData;
  } else {
    return null;
  }
};

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  return !!authToken;
};
