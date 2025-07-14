import { baseApi } from "../baseApi";
import { tagTypes } from "../tag-types";

const COLLECTIONS_URL = "contribution/collections";

export const collectionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET all collections
    collections: build.query({
      query: () => ({
        url: `/${COLLECTIONS_URL}/`, // added trailing slash
        method: "GET",
      }),
      providesTags: [tagTypes.collections],
    }),

    // ✅ GET single collection by ID
    getSingleData: build.query({
      query: (id) => ({
        url: `/${COLLECTIONS_URL}/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: tagTypes.singleCollection, id },
      ],
    }),

    // ✅ FIX: Use `data` instead of `body` when sending FormData
    updateSingleCollection: build.mutation({
      query: ({ id, data }) => ({
        url: `/${COLLECTIONS_URL}/${id}/`,
        method: "PATCH",
        data,
      }),
    }),

    deleteSingleCollection: build.mutation({
      query: (id) => ({
        url: `/${COLLECTIONS_URL}/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: tagTypes.singleCollection, id },
        tagTypes.collections,
      ],
    }),
  }),
});

export const {
  useCollectionsQuery,
  useGetSingleDataQuery,
  useUpdateSingleCollectionMutation,
  useDeleteSingleCollectionMutation,
} = collectionsApi;
