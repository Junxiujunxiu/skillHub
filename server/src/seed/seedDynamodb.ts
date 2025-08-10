import {
  DynamoDBClient,
  DeleteTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import fs from "fs";
import path from "path";
import dynamoose from "dynamoose";
import pluralize from "pluralize";
import Transaction from "../models/transactionModel";
import Course from "../models/courseModel";
import UserCourseProgress from "../models/userCourseProgressModel";
import dotenv from "dotenv";

dotenv.config();

let client: DynamoDBClient;

/* =========================================================================
   DynamoDB Configuration
   Purpose:
     - Configure Dynamoose and AWS SDK for DynamoDB based on environment.
     - If in development → use DynamoDB Local.
     - If in production → use AWS-hosted DynamoDB.
   ========================================================================= */
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  // Development: Local DynamoDB
  dynamoose.aws.ddb.local();
  client = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: "dummyKey123", // Local dev credentials
      secretAccessKey: "dummyKey123",
    },
  });
} else {
  // Production: AWS DynamoDB
  client = new DynamoDBClient({
    region: process.env.AWS_REGION || "ap-southeast-2",
  });
}

/* =========================================================================
   Suppress DynamoDB Local Tag Warnings
   Purpose:
     - Prevent unnecessary console warnings about unsupported features.
   ========================================================================= */
const originalWarn = console.warn.bind(console);
console.warn = (message, ...args) => {
  if (
    !message.includes("Tagging is not currently supported in DynamoDB Local")
  ) {
    originalWarn(message, ...args);
  }
};

/* =========================================================================
   Function: createTables
   Purpose:
     - Creates and initializes all DynamoDB tables for the models.
   Flow:
     1. Define all models to create tables for.
     2. For each model → create a Dynamoose Table.
     3. Initialize and wait for the table to be active.
   ========================================================================= */
async function createTables() {
  const models = [Transaction, UserCourseProgress, Course];

  for (const model of models) {
    const tableName = model.name;
    const table = new dynamoose.Table(tableName, [model], {
      create: true,
      update: true,
      waitForActive: true,
      throughput: { read: 5, write: 5 },
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await table.initialize();
      console.log(`Table created and initialized: ${tableName}`);
    } catch (error: any) {
      console.error(
        `Error creating table ${tableName}:`,
        error.message,
        error.stack
      );
    }
  }
}

/* =========================================================================
   Function: seedData
   Purpose:
     - Inserts initial JSON data into a specified DynamoDB table.
   Flow:
     1. Read JSON file from disk.
     2. Determine table name (singularized and capitalized).
     3. Loop over items in JSON and insert them into DynamoDB.
   ========================================================================= */
async function seedData(tableName: string, filePath: string) {
  const data: { [key: string]: any }[] = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );

  const formattedTableName = pluralize.singular(
    tableName.charAt(0).toUpperCase() + tableName.slice(1)
  );

  console.log(`Seeding data to table: ${formattedTableName}`);

  for (const item of data) {
    try {
      await dynamoose.model(formattedTableName).create(item);
    } catch (err) {
      console.error(
        `Unable to add item to ${formattedTableName}. Error:`,
        JSON.stringify(err, null, 2)
      );
    }
  }

  console.log(
    "\x1b[32m%s\x1b[0m",
    `Successfully seeded data to table: ${formattedTableName}`
  );
}

/* =========================================================================
   Function: deleteTable
   Purpose:
     - Deletes a single DynamoDB table by name.
   ========================================================================= */
async function deleteTable(baseTableName: string) {
  let deleteCommand = new DeleteTableCommand({ TableName: baseTableName });
  try {
    await client.send(deleteCommand);
    console.log(`Table deleted: ${baseTableName}`);
  } catch (err: any) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`Table does not exist: ${baseTableName}`);
    } else {
      console.error(`Error deleting table ${baseTableName}:`, err);
    }
  }
}

/* =========================================================================
   Function: deleteAllTables
   Purpose:
     - Lists and deletes all DynamoDB tables in the current environment.
   Flow:
     1. Fetch all table names.
     2. Loop through and delete each table with a delay to avoid throttling.
   ========================================================================= */
async function deleteAllTables() {
  const listTablesCommand = new ListTablesCommand({});
  const { TableNames } = await client.send(listTablesCommand);

  if (TableNames && TableNames.length > 0) {
    for (const tableName of TableNames) {
      await deleteTable(tableName);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }
}

/* =========================================================================
   Function: seed (Default Export)
   Purpose:
     - Complete process for resetting and seeding the database.
   Flow:
     1. Delete all existing tables.
     2. Create all required tables.
     3. Seed each table with initial data from the /data directory.
   ========================================================================= */
export default async function seed() {
  await deleteAllTables();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await createTables();

  const seedDataPath = path.join(__dirname, "./data");
  const files = fs
    .readdirSync(seedDataPath)
    .filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const tableName = path.basename(file, ".json");
    const filePath = path.join(seedDataPath, file);
    await seedData(tableName, filePath);
  }
}

/* =========================================================================
   CLI Execution
   Purpose:
     - Allows running this script directly from the command line.
   ========================================================================= */
if (require.main === module) {
  seed().catch((error) => {
    console.error("Failed to run seed script:", error);
  });
}
