import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

export const fiscalYearApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFinancialYear: build.query({
      query: () => ({
        url: "/fiscal-year/",
        method: "GET",
      }),
      providesTags: [tagTypes.fiscalYear],
    }),
  }),
});

export const { useGetFinancialYearQuery } = fiscalYearApi;
