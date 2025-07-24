import express from "express";           // Web server framework
import dotenv from "dotenv";             // Load .env variables
import bodyParser from "body-parser";    // Parse request bodies
import cors from "cors";                 // Allow cross-origin requests
import helmet from "helmet";             // Add security headers
import morgan from "morgan";             // Logging tool
import * as dynamoose from "dynamoose";  // DynamoDB ORM
import { clerkMiddleware, createClerkClient, requireAuth } from "@clerk/express"; 
/*ROute imports*/
import courseRoutes from "./routes/courseRoutes";
import { DynamoDB} from "@aws-sdk/client-dynamodb";
import useCLerkRoutes from "./routes/userClerkRoutes";
import transactionRoutes from "./routes/transactionRoutes";

/*CONFIGURATIONS */
 // Loads variables from `.env` file into `process.env`
dotenv.config();
const isProduction = process.env.NODE_ENV ==="production";

if (!isProduction) {
    // Use local DynamoDB for development
    const ddb = new DynamoDB({
      region: process.env.AWS_REGION || "ap-southeast-2",
      endpoint: "http://localhost:8000", // Add this line for DynamoDB Local
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummyAccessKey",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummySecretKey",
      },
    });
  
    dynamoose.aws.ddb.set(ddb); // Attach DynamoDB client to Dynamoose
  }

  export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  })

/* EXPRESS SETUP */
const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common")); // Logs requests to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(clerkMiddleware());//use Clerk to check who the user is on every request.


/*ROUTES*/
// "/" here only matches the root path like http://localhost:3000/
app.get("/", (req, res) =>{
    res.send("Hello World") //// When you visit localhost:3000/, it shows this
})

//For any request that starts with /course, go check what’s inside courseRoutes”
app.use("/courses", courseRoutes);
//for all /users/clerk/... URLs, make sure the user is signed in. 
//If they are, let them go to the correct page or do the correct action.”
app.use("/users/clerk", requireAuth(), useCLerkRoutes);
// For any request that starts with /transactions, go check what’s inside transactionRoutes”
app.use("/transactions", requireAuth(), transactionRoutes);

/*SERVER*/
//If you're in development (!isProduction), the server runs on the specified port.
const port =process.env.PORT || 3000;
if(!isProduction){
    app.listen(port, ()=>{
        console.log(`Server running on port ${port}`);
    });
}