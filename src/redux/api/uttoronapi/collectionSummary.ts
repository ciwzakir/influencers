import { baseApi } from "../baseApi";
import { tagTypes } from "../tag-types";

const COLLECTIONS_URL = "contribution/allcollections";

export const collectionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET all collections
    collectionSummaries: build.query({
      query: () => ({
        url: `/${COLLECTIONS_URL}/`,
        method: "GET",
      }),
      providesTags: [tagTypes.collectionsSummary],
    }),
  }),
});

export const { useCollectionSummariesQuery } = collectionsApi;
