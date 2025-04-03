import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

const USERS_URL = "/api/v1/auth";

export const allUsersAuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    allUsers: build.query({
      query: () => ({
        url: `${USERS_URL}/users/`,
        method: "GET",
      }),
      providesTags: [tagTypes.users],
    }),

    // get single department by id
    getSingleUser: build.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}/`,
        method: "GET",
      }),
      providesTags: [tagTypes.singleUser],
    }),
  }),
});

export const { useAllUsersQuery, useGetSingleUserQuery } = allUsersAuthApi;
