import { baseApi } from "./baseApi";
import { tagTypes } from "./tag-types";

const COLLECTIONS_URL = "/collections";

export const collectionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    collections: build.query({
      query: () => ({
        url: `/${COLLECTIONS_URL}`,
        method: "GET",
      }),
      providesTags: [tagTypes.collections],
    }),

    // get single data by id
    getSingleData: build.query({
      query: (id) => ({
        url: `/${COLLECTIONS_URL}/${id}/`,
        method: "GET",
      }),
      providesTags: [tagTypes.singleCollection],
    }),

    updateSingleData: build.mutation({
      query: ({ id, ...body }) => ({
        url: `${COLLECTIONS_URL}/${id}/`, // Correct URL construction
        method: "PATCH",
        data: body, // Pass the body data
      }),
      invalidatesTags: [tagTypes.updateSingleCollection],
    }),

    deleteSingleData: build.mutation({
      query: (id) => ({
        url: `${COLLECTIONS_URL}/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.deleteSingleCollection],
    }),
  }),
});

export const {
  useCollectionsQuery,
  useDeleteSingleDataMutation,
  useGetSingleDataQuery,
  useUpdateSingleDataMutation,
} = collectionsApi;
