"use client";

import { useRef } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import globalReducer from "@/state";
import { api } from "@/state/api";

/*---------------------------------- REDUX STORE SETUP ----------------------------------*/
/*
   This section creates the root Redux store for the application.
   - Combines all reducers into one rootReducer.
   - Configures the store with middleware and API handling.
   - Integrates RTK Query for automatic data caching, fetching, and invalidation.
*/
const rootReducer = combineReducers({
  global: globalReducer,        // Global UI state reducer
  [api.reducerPath]: api.reducer, // RTK Query API slice reducer (for data fetching & caching)
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer, // Main state container
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          /*
             These settings prevent Redux's serializableCheck from warning about 
             non-serializable values such as files, form data, and API request/response objects.
             Without this, Redux would throw errors when handling uploads or complex objects.
          */
          ignoredActions: [
            "api/executeMutation/pending",
            "api/executeMutation/fulfilled",
            "api/executeMutation/rejected",
          ],
          ignoredActionPaths: [
            "meta.arg.originalArgs.file",
            "meta.arg.originalArgs.formData",
            "payload.chapter.video",
            "meta.baseQueryMeta.request",
            "meta.baseQueryMeta.response",
          ],
          ignoredPaths: [
            "global.courseEditor.sections",
            "entities.videos.data",
            "meta.baseQueryMeta.request",
            "meta.baseQueryMeta.response",
          ],
        },
      }).concat(api.middleware), // Add RTK Query middleware for API requests
  });
};

/*---------------------------------- REDUX TYPES ----------------------------------*/
/*
   These TypeScript types help ensure type safety across Redux usage:
   - AppStore: Type of the entire store instance
   - RootState: Type of the store's root state
   - AppDispatch: Type of the store's dispatch function
   - useAppDispatch & useAppSelector: Typed versions of the default hooks
*/
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/*---------------------------------- STORE PROVIDER ----------------------------------*/
/*
   This component wraps the app with Redux's <Provider> so all components 
   can access the Redux store.
   - Uses a ref to ensure the store is only created once.
   - Calls setupListeners to enable automatic refetching in RTK Query.
*/
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(); // Create the store
    setupListeners(storeRef.current.dispatch); // Enable refetch on focus/reconnect
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
