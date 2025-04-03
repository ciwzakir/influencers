import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

const AUTH_URL = "api/v1/auth";

export const userAuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* 
=============================
Login Mutation
=============================
*/
    userLogin: build.mutation({
      query: (data) => ({
        url: `/${AUTH_URL}/login/`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    /* 
    =============================
    My Profile Query
    =============================
    */

    myProfile: build.query({
      query: (id) => {
        return {
          url: `/${AUTH_URL}/profile/${id}/`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.profile],
    }),
    /* 
    =============================
    My Profile Query
    =============================
    */

    updateProfile: build.mutation({
      query: ({ id, formData }) => ({
        url: `/${AUTH_URL}/profile/${id}/`,
        method: "PATCH",
        data: formData,
        contentType: "multipart/form-data",
      }),
    }),

    /* 
    =============================
    section
    =============================
    */
  }),
});

export const {
  useUserLoginMutation,
  useMyProfileQuery,
  useUpdateProfileMutation,
} = userAuthApi;
