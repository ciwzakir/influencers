import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

const AUTH_URL = "api/v1/auth"; // No leading slash

export const userAuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Login Mutation
    userLogin: build.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login/`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    // My Profile Query
    myProfile: build.query({
      query: (id) => ({
        url: `${AUTH_URL}/profile/${id}/`,
        method: "GET",
      }),
      providesTags: [tagTypes.profile],
    }),

    // Update Profile Mutation
    updateProfile: build.mutation({
      query: ({ id, data }) => ({
        url: `${AUTH_URL}/profile/${id}/`,
        method: "PATCH",
        data,
      }),
    }),

    // Closing
  }),
});

export const {
  useUserLoginMutation,
  useMyProfileQuery,
  useUpdateProfileMutation,
} = userAuthApi;
