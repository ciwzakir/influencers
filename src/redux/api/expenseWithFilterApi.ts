import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

export const allExpensesWithFilterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    expensesWithFilter: build.query({
      query: () => ({
        url: "/expenses-filters/",
        method: "GET",
      }),
      providesTags: [tagTypes.expenseFilter],
    }),
    // update ac department
  }),
});

export const { useExpensesWithFilterQuery } = allExpensesWithFilterApi;
