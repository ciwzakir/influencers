import { baseApi } from "./baseApi";

const REGISTER_URL = "api/v1/auth";
export const userRegisterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    registerNewUser: build.mutation({
      query: (data) => ({
        url: `${REGISTER_URL}/register/`,
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useRegisterNewUserMutation } = userRegisterApi;
