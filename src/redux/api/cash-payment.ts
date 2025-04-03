import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

export const expenseCashListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    cashListWithFilter: build.query({
      query: () => ({
        url: "/expenses-cash/",
        method: "GET",
      }),
      providesTags: [tagTypes.cheque],
    }),
  }),
});

export const { useCashListWithFilterQuery } = expenseCashListApi;
