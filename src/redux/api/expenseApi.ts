import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

export const allExpensesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExpenses: build.query({
      query: () => ({
        url: "/mass-expenses/",
        method: "GET",
      }),

      providesTags: [tagTypes.expenses],
    }),
    // update ac department
  }),
});

export const { useGetExpensesQuery } = allExpensesApi;
