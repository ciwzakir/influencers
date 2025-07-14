import { baseApi } from "../baseApi";
import { tagTypes } from "../tag-types";

const CASH_BOOK_URL = "cashbook/cashbook";

export const cashBookApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getcashbook: build.query({
      query: () => ({
        url: `/${CASH_BOOK_URL}/`,
        method: "GET",
      }),
      providesTags: [tagTypes.cashBook],
    }),

    // ✅ GET single collection by ID
    getSingleCashBook: build.query({
      query: (id) => ({
        url: `/${CASH_BOOK_URL}/${id}/`, // trailing slash is important for DRF
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: tagTypes.cashBook, id }],
    }),

    // ✅ DELETE collection by ID
    deleteSingleCashBook: build.mutation({
      query: (id) => ({
        url: `/${CASH_BOOK_URL}/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: tagTypes.singleCashBook, id },
        tagTypes.collections,
      ],
    }),
  }),
});

export const {
  useGetcashbookQuery,
  useGetSingleCashBookQuery,
  useDeleteSingleCashBookMutation,
} = cashBookApi;
