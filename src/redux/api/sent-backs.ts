import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

const SENT_BACK_BILL_URL = "/sent-back";

export const sentBackBillListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sentBackBills: build.query({
      query: () => ({
        url: `${SENT_BACK_BILL_URL}/`,
        method: "GET",
      }),
      providesTags: [tagTypes.sentBacks],
    }),
  }),
});

export const { useSentBackBillsQuery } = sentBackBillListApi;
