import "@testing-library/jest-dom";
import React from "react";
import { toast } from "sonner";

// -------------------------------------------------------------
// Global toast spies
// -------------------------------------------------------------
(global as any).mockToastError = jest.spyOn(toast, "error");
(global as any).mockToastSuccess = jest.spyOn(toast, "success");

// -------------------------------------------------------------
// lucide-react mock
// -------------------------------------------------------------
jest.mock("lucide-react", () => ({
  CreditCard: () =>
    React.createElement("div", { "data-testid": "mock-credit-card" }),
}));
