import { baseApi } from "../baseApi";
import { tagTypes } from "../tag-types";

const SUBSCRIPTION_RATES = "contribution/monthly-rates";

export const contributeRatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET all collections
    monthlyContributeRates: build.query({
      query: () => ({
        url: `${SUBSCRIPTION_RATES}/`,
        method: "GET",
      }),
      providesTags: [tagTypes.contributeRates],
    }),

    updateSingleMonthlyRates: build.mutation({
      query: ({ id, data }) => ({
        url: `${SUBSCRIPTION_RATES}/${id}/`,
        method: "PATCH",
        data,
      }),
    }),

    createSingleMonthlyRates: build.mutation({
      query: ({ data }) => ({
        url: `${SUBSCRIPTION_RATES}/`,
        method: "POST",
        body: data, // ✅ not "data"
      }),
      invalidatesTags: [tagTypes.createContributeRates],
    }),

    deleteSingleMonthlyRates: build.mutation({
      query: (id) => ({
        url: `/${SUBSCRIPTION_RATES}/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: tagTypes.singleContributeRates, id },
        tagTypes.delSubRates,
      ],
    }),
  }),
});

export const {
  useMonthlyContributeRatesQuery,
  useUpdateSingleMonthlyRatesMutation,
  useDeleteSingleMonthlyRatesMutation,
  useCreateSingleMonthlyRatesMutation,
} = contributeRatesApi;
