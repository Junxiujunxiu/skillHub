import express from "express";           // Web server framework
import dotenv from "dotenv";             // Load .env variables
import bodyParser from "body-parser";    // Parse request bodies
import cors from "cors";                 // Allow cross-origin requests
import helmet from "helmet";             // Add security headers
import morgan from "morgan";             // Logging tool
import * as dynamoose from "dynamoose";  // DynamoDB ORM

/*ROute imports*/


/*CONFIGURATIONS */
 // Loads variables from `.env` file into `process.env`
dotenv.config();

const isProduction = process.env.NODE_ENV ==="production";

if(!isProduction){
    dynamoose.aws.ddb.local();// Use local DynamoDB for development/testing
}

const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common")); // Logs requests to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

/*ROUTES*/
app.get("/", (req, rest) =>{
    rest.send("Hello World") //// When you visit localhost:3000/, it shows this
})

/*SERVER*/
//If you're in development (!isProduction), the server runs on the specified port.
const port =process.env.PORT || 3000;
if(!isProduction){
    app.listen(port, ()=>{
        console.log(`Server running on port ${port}`);
    });
}