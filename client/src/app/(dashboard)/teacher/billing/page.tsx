"use client";

import Loading from "@/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { useGetTransactionsQuery } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";

/* =========================================================================
   Component: TeacherBilling
   Purpose:
     - Displays a teacher’s payment history in a table format.
     - Allows filtering of transactions by payment provider (All, Stripe, PayPal).
   Authentication:
     - Requires the user to be signed in (Clerk).
   Data Source:
     - Fetches transactions using RTK Query (`useGetTransactionsQuery`).
   ========================================================================= */
const TeacherBilling = () => {
  /* -------------------------- STATE & HOOKS -------------------------- */
  const [paymentType, setPaymentType] = useState("all"); // Currently selected payment filter
  const { user, isLoaded } = useUser(); // Auth state from Clerk

  // Fetch transactions for the logged-in user
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetTransactionsQuery(user?.id || "", {
      skip: !isLoaded || !user, // Avoid query until user data is ready
    });

  /* -------------------------- DATA FILTERING -------------------------- */
  // Filter transactions based on selected payment type
  const filteredData =
    transactions?.filter((transaction) => {
      const matchesTypes =
        paymentType === "all" ||
        transaction.paymentProvider === paymentType;
      return matchesTypes;
    }) || [];

  /* -------------------------- LOADING & AUTH STATES -------------------------- */
  if (!isLoaded) return <Loading />;
  if (!user)
    return <div>Please sign in to view your billing information</div>;

  /* -------------------------- MAIN RENDER -------------------------- */
  return (
    <div className="billing">
      <div className="billing__container">
        
        {/* ---------- Title ---------- */}
        <h2 className="billing__title">Payment History</h2>

        {/* ---------- Filter Dropdown ---------- */}
        <div className="billing__filters">
          <Select value={paymentType} onValueChange={setPaymentType}>
            <SelectTrigger className="billing__select">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>

            <SelectContent className="billing__select-content">
              <SelectItem className="billing__select-item" value="all">
                All Types
              </SelectItem>
              <SelectItem className="billing__select-item" value="stripe">
                Stripe
              </SelectItem>
              <SelectItem className="billing__select-item" value="paypal">
                PayPal
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ---------- Transactions Table / Loading State ---------- */}
        <div className="billing__grid">
          {isLoadingTransactions ? (
            <Loading />
          ) : (
            <Table className="billing__table">
              {/* ----- Table Header ----- */}
              <TableHeader className="billing__table-header">
                <TableRow className="billing__table-header-row">
                  <TableHead className="billing__table-cell">Date</TableHead>
                  <TableHead className="billing__table-cell">Amount</TableHead>
                  <TableHead className="billing__table-cell">
                    Payment Method
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* ----- Table Body ----- */}
              <TableBody className="billing__table-body">
                {filteredData.length > 0 ? (
                  filteredData.map((transaction) => (
                    <TableRow
                      className="billing__table-row"
                      key={transaction.transactionId}
                    >
                      <TableCell className="billing__table-cell">
                        {new Date(transaction.dateTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="billing__table-cell billing__amount">
                        {formatPrice(transaction.amount)}
                      </TableCell>
                      <TableCell className="billing__table-cell">
                        {transaction.paymentProvider}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="billing__table-row">
                    <TableCell
                      className="billing__table-cell text-center"
                      colSpan={3}
                    >
                      No transactions to display
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherBilling;
