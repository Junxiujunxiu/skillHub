//createApi: Helps you define API endpoints.
//fetchBaseQuery: A basic wrapper around fetch() to talk to a REST API.
//they are designed to simplify data fetching and caching
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {BaseQueryApi, FetchArgs} from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js"
import { toast } from "sonner";

// This is a custom base query function for RTK Query.
// It wraps around fetchBaseQuery and helps extract only the `data` part from the API response.

const customBaseQuery = async (
  args: string | FetchArgs,      // API request info (like URL, params, method)
  api: BaseQueryApi,             // RTK Query's internal tools (like dispatch, getState)
  extraOptions: {}               // Any extra options (not commonly used)
) => {

  // Create a default fetch function using the base URL from your .env config
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g., "http://localhost:8001"
    //For every API call, first get the user’s Clerk token. If it exists, 
    // attach it to the request so the backend knows the user is allowed to access the data.”
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if(token) {
        headers.set("Authorization", `Bearer ${token}`); // Set the Authorization header with the token
      }
    }
  });

  try {
    // Make the actual API request using the baseQuery
    const result: any = await baseQuery(args, api, extraOptions);
    // “If there’s an error after calling the API, show a red error message popup (toast) with the reason.”
    if(result.error) {
      const errorData = result.error.data;
      const errorMessage = errorData?.message || result.error.status.toString() || "An error occurred";
      toast.error(`Error: ${errorMessage}`);
    }
    // “If the request is not a GET (like POST, PUT, DELETE), and the server sent back a success message, show it as a green toast popup.”
    const isMutationRequest = (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) {
        toast.success(successMessage);
      }}
    // If the response has a `data` field, extract the inner `data` field (e.g., response.data.data)
    // This simplifies your component code — you get only the actual payload.
    if (result.data) {
      result.data = result.data.data;
    }else if (
      // If the response is empty (like a DELETE request), return null
      result.error?.status === 204 || 
      result.meta?.response?.status === 24)
      {
        return {data: null};
      }
    // Return the cleaned-up result
    return result;

  } catch (error: unknown) {
    // If an error happens (e.g., network failure), format it in a standard way
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Return the error in a shape that RTK Query can understand
    return {
      error: {
        status: "FETCH_ERROR",
        error: errorMessage,
      },
    };
  }
};


//it just sends the GET request with the URL (and optional query param), gets back an array of courses, and tags it as "Courses".
export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users"], // Define the types of data that can be cached and invalidated
  endpoints: (build) => ({

    
    /*-----------------------------user clerk-------------------------------------*/
    updateUser: build.mutation<User, Partial<User> & { userId: string}>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),
    
    /*-----------------------------courses-------------------------------------*/
    getCourses: build.query<Course[], {category?: string}>({
      query: ({ category }) => ({
        url: "courses",
        params: {category},
      }),
      providesTags: ["Courses"],
    }),
    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) =>[{type: "Courses", id}],
    }),

    updateCourse: build.mutation<Course, {courseId: string; formData: FormData}>({
      query: ({courseId, formData}) => ({
        url: `courses/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, {courseId}) => [
        {type: "Courses", id: courseId },
      ]
    }),

    createCourse: build.mutation<Course, {teacherId: string; teacherName: string}>({
      query: (body) => ({
        url: `courses`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"]
    }),

    deleteCourse: build.mutation<{message: string}, string>({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"]
    }),

    /*-----------------------------transactions-------------------------------------*/
    getTransactions: build.query<Transaction[], string>({
      query: (userId) => `transactions?userId=${userId}`,
    }),

// This endpoint is used to create a Stripe payment intent
    createStripePaymentIntent: build.mutation<
      {clientSecret: string},
      {amount:number}
 >({
      query: ({ amount }) => ({
        url: `/transactions/stripe/payment-intent`,
        method: "POST",
        body: {amount},
      }),
    }),

    //create transactions
    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
    }),


  }),
});

export const { 
  useUpdateUserMutation, 
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery, 
  useGetCourseQuery, 
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useCreateStripePaymentIntentMutation
} = api;

/*note: "Hey, here’s how to call the backend endpoint at /transactions/stripe/payment-intent using a POST request, and here's what kind of data we send and receive."
"Hey frontend, when we call useCreateStripePaymentIntentMutation(), send a POST request to this backend URL."
In api.ts, you're not defining the endpoint, you're mapping it so the frontend knows how to talk to it
The hook useCreateStripePaymentIntentMutation is what you use to trigger that request from a component*/ 