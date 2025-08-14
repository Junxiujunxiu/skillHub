import { Schema, model } from "dynamoose";

/* =========================================================================
   Schema: transactionSchema
   Purpose:
     - Represents a payment transaction for a course purchase.
     - Used to track payment details, link them to a user and a course.
   Keys:
     - hashKey: userId → Groups transactions by user.
     - rangeKey: transactionId → Uniquely identifies a transaction for that user.
   Fields:
     - userId (string, required) → ID of the user who made the purchase.
     - transactionId (string, required) → Unique ID for this transaction.
     - dateTime (string, required) → ISO timestamp of when the payment occurred.
     - courseId (string, required) → ID of the course purchased.
         - Indexed globally so we can query transactions by courseId.
     - paymentProvider (enum, required) → The payment provider used (currently only "stripe").
     - amount (number) → Amount paid (stored in cents or smallest currency unit).
   Options:
     - saveUnknown: true → Allows storing fields not defined in the schema.
     - timestamps: true → Automatically adds createdAt and updatedAt fields.
   ========================================================================= */
const transactionSchema = new Schema(
  {
    userId: {
      type: String,
      hashKey: true, // Primary partition key for grouping transactions by user
      required: true,
    },
    transactionId: {
      type: String,
      rangeKey: true, // Primary sort key for uniquely identifying each transaction
      required: true,
    },
    dateTime: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      index: {
        name: "CourseTransactionsIndex", // GSI for querying all transactions for a course
        type: "global",
      },
    },
    paymentProvider: {
      type: String,
      enum: ["stripe"], // Currently supports Stripe payments only
      required: true,
    },
    amount: Number, // Amount paid (should follow consistent currency handling in app)
  },
  {
    saveUnknown: true, // Allow unmodeled attributes for flexibility
    timestamps: true,  // Adds createdAt and updatedAt automatically
  }
);

/* =========================================================================
   Model: Transaction
   Purpose:
     - Dynamoose model for interacting with the "Transaction" table.
     - Provides CRUD operations for transaction records.
   ========================================================================= */
const Transaction = model("Transaction", transactionSchema);

export default Transaction;
