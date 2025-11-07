import "@testing-library/jest-dom";
import React from "react";
import { toast } from "sonner";

// ✅ Global toast spies (shared between all tests)
(global as any).mockToastError = jest.spyOn(toast, "error");
(global as any).mockToastSuccess = jest.spyOn(toast, "success");

// ✅ Safe mock for lucide-react (no JSX syntax in .ts)
jest.mock("lucide-react", () => ({
  CreditCard: () =>
    React.createElement("div", { "data-testid": "mock-credit-card" }),
}));
