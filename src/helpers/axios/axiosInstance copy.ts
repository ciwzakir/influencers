import { authKey } from "@/constants/storageKey";
import { ResponseSuccessType } from "@/types";

import { getFromLocalStorage } from "@/utils/local-storage";
import axios from "axios";

const instance = axios.create({
  timeout: 60000,
  withCredentials: true,
});

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";

instance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(authKey);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Automatically set Content-Type for FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  function (error) {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  // @ts-expect-error: Ignoring this TypeScript error because it doesn't affect runtime behavior
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response.data,
    };
    return responseObject;
  },
  function (error) {
    console.error("Response error:", error);
    const response = error.response;

    if (response) {
      if (response.status === 401) {
        console.error("Unauthorized access. Please log in.");
      }
    } else {
      console.error("No response received. Error details:", error.message);
    }

    return Promise.reject(error);
  }
);

export { instance };
