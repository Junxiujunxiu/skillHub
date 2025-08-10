import { Request, Response } from "express";
import { clerkClient } from "../index";

/* =========================================================================
   Controller: updateUser
   Purpose:
     - Update a user's metadata in Clerk.
     - Metadata is stored in the "publicMetadata" field so it can be accessed
       publicly by the application (e.g., user role, settings).
   Flow:
     1. Extract the target userId from request params.
     2. Extract the updated metadata from request body.
     3. Call Clerk API to update the public metadata for that user.
     4. Return the updated user object in the response.
     5. Handle errors gracefully with a 500 status code.
   ========================================================================= */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params; // The Clerk user ID from the URL
  const userData = req.body; // Expected to contain publicMetadata updates

  try {
    // Step 1: Use Clerk's server-side SDK to update user's public metadata
    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        userType: userData.publicMetadata.userType, // e.g., "student" or "instructor"
        settings: userData.publicMetadata.settings, // custom settings object
      },
    });

    // Step 2: Respond with success and the updated user object
    res.json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    // Step 3: Handle and report errors (e.g., invalid userId, Clerk API failure)
    res.status(500).json({
      message: "Error updating user",
      error,
    });
  }
};
