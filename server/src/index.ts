import express from "express";           // Web server framework
import dotenv from "dotenv";             // Load environment variables from .env
import bodyParser from "body-parser";    // Middleware for parsing request bodies
import cors from "cors";                 // Middleware for enabling CORS
import helmet from "helmet";             // Middleware for securing HTTP headers
import morgan from "morgan";             // HTTP request logging
import * as dynamoose from "dynamoose";  // DynamoDB ORM
import serverless from "serverless-http";
import { 
  clerkMiddleware, 
  createClerkClient, 
  requireAuth 
} from "@clerk/express";                 // Clerk authentication middleware

/* =========================================================================
   Route Imports
   ========================================================================= */
import courseRoutes from "./routes/courseRoutes";          // Course management routes
import { DynamoDB } from "@aws-sdk/client-dynamodb";       // AWS DynamoDB client
import useCLerkRoutes from "./routes/userClerkRoutes";     // User routes (via Clerk)
import transactionRoutes from "./routes/transactionRoutes"; // Transaction/payment routes
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes";
import seed from "./seed/seedDynamodb";

/* =========================================================================
   Configuration
   ========================================================================= */
// Load environment variables from `.env` file into process.env
dotenv.config();

// Determine environment mode
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  // Local development → Use DynamoDB Local
  const ddb = new DynamoDB({
    region: process.env.AWS_REGION || "ap-southeast-2",
    endpoint: "http://localhost:8000", // DynamoDB Local endpoint
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummyAccessKey",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummySecretKey",
    },
  });

  // Attach DynamoDB Local client to Dynamoose
  dynamoose.aws.ddb.set(ddb);
}

// Create Clerk server-side client for managing user data
export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/* =========================================================================
   Express App Setup
   ========================================================================= */
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Apply security-related HTTP headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Log HTTP requests to the console
app.use(morgan("common"));

// Parse incoming requests (JSON + URL encoded)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Apply Clerk authentication middleware to all requests
app.use(clerkMiddleware());

/* =========================================================================
   Routes
   ========================================================================= */
// Root endpoint → GET /
app.get("/", (req, res) => {
  res.send("Hello World"); // Simple response for testing
});

// Course routes → All endpoints under /courses
app.use("/courses", courseRoutes);

// User routes via Clerk → All endpoints under /users/clerk (require authentication)
app.use("/users/clerk", requireAuth(), useCLerkRoutes);

// Transaction routes → All endpoints under /transactions (require authentication)
app.use("/transactions", requireAuth(), transactionRoutes);

// User course progress routes → All endpoints under /users/course-progress (require authentication)
app.use("/users/course-progress", requireAuth(), userCourseProgressRoutes);

/* =========================================================================
   Server Startup
   ========================================================================= */
// Start the server in development mode
const port = process.env.PORT || 3000;
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

/* =========================================================================
   AWS Lambda Production Handler (need to be more secure in production)
   =========================================================================
   Purpose:
   - Wraps the Express `app` for deployment on AWS Lambda.

   How it works:
   1. Checks if the event action is "seed".
      - If yes, runs the database seed script.
      - Returns a success message without starting the API server.

   2. If not "seed", passes the request to the serverless app handler.
      - Handles normal API requests.
   ========================================================================= */
const serverlessApp = serverless(app);
export const handler = async (event: any, context: any) => {
  if (event.action === "seed") {
    await seed();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data seeded successfully" }),
    };
  } else {
    return serverlessApp(event, context);
  }
};
