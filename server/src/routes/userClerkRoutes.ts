import express from "express";
import { updateUser } from "../controllers/userClerkController";

/* =========================================================================
   Router: User Routes
   Purpose:
     - Defines API endpoints for managing user data stored in Clerk.
   ========================================================================= */
const router = express.Router();

/* =========================================================================
   Route: PUT /:userId
   Description:
     - Update a user's public metadata in Clerk.
     - Expects the `userId` in the URL path and updated metadata in the request body.
   Access: Public in this file, but should be protected in production (e.g., requireAuth).
   Controller: updateUser
   Example: PUT /users/12345
   ========================================================================= */
router.put("/:userId", updateUser);

/* =========================================================================
   Export:
     - Exports the configured router for use in the main app.
   ========================================================================= */
export default router;
