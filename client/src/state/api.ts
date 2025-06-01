//createApi: Helps you define API endpoints.
//fetchBaseQuery: A basic wrapper around fetch() to talk to a REST API.
//they are designed to simplify data fetching and caching
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//it just sends the GET request with the URL (and optional query param), gets back an array of courses, and tags it as "Courses".
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Courses"],
  endpoints: (build) => ({
    getCourses: build.query<Course[], {category?: string}>({
      query: ({ category }) => ({
        url: "courses",
        params: {category},
      }),
      providesTags: ["Courses"],
    }),
  }),
});

export const {} = api;