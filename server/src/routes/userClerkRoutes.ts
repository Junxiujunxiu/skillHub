import express from "express";
import { updateUser } from "../controllers/userClerkController";


const router = express.Router();

router.put("/:userID", updateUser);
export default router;