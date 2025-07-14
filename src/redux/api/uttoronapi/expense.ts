// src/redux/api/uttoronapi/expense.ts
import { baseApi } from "../baseApi";
const SUMMARY = "cashbook";
export const cashBookApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategorySummary: build.query({
      query: () => ({
        url: `${SUMMARY}/reports/categories`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategorySummaryQuery } = cashBookApi;
