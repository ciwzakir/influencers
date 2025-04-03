import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

export const expenseChequesListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    chequeListWithFilter: build.query({
      query: () => ({
        url: "/expenses-cheques/",
        method: "GET",
      }),
      providesTags: [tagTypes.cheque],
    }),
    // update ac department
  }),
});

export const { useChequeListWithFilterQuery } = expenseChequesListApi;
