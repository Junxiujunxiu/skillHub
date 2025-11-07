import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaymentPage from "../../../../src/app/(nondashboard)/checkout/payment/index";
import { jest } from "@jest/globals";

//  Access global mocks defined in jest.setup.ts
const mockToastError = global.mockToastError as jest.Mock;
const mockToastSuccess = global.mockToastSuccess as jest.Mock;

/* =========================================================
   Mocks
   ========================================================= */

// Mock Stripe hooks and elements
type ConfirmPaymentResult =
  | { paymentIntent: { status: string; id: string } }
  | { error: { type: string; message: string } };

const mockConfirmPayment = jest.fn(
  async (): Promise<ConfirmPaymentResult> => ({
    paymentIntent: { status: "succeeded", id: "pi_123" },
  })
);

jest.mock("@stripe/react-stripe-js", () => ({
  useStripe: () => ({ confirmPayment: mockConfirmPayment }),
  useElements: () => ({}),
  PaymentElement: () => (
    <div data-testid="payment-element">Payment Element</div>
  ),
}));

// Mock course & user hooks
jest.mock("../../../../src/hooks/useCurrentCourse", () => ({
  __esModule: true,
  useCurrentCourse: jest.fn(),
}));
jest.mock("../../../../src/hooks/useCheckoutNavigation", () => ({
  __esModule: true,
  useCheckoutNavigation: jest.fn(),
}));
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  useClerk: jest.fn(),
}));

// Mock RTK Query hooks
jest.mock("../../../../src/state/api", () => ({
  useCreateTransactionMutation: jest.fn(() => [jest.fn()]),
  useGetUserEnrolledCoursesQuery: jest.fn(() => ({ refetch: jest.fn() })),
}));

// Mock UI components
jest.mock("../../../../src/components/CoursePreview", () => ({
  __esModule: true,
  default: ({ course }: any) => (
    <div data-testid="course-preview">{course.title}</div>
  ),
}));
jest.mock("../../../../src/components/ui/button", () => ({
  __esModule: true,
  Button: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));
jest.mock(
  "../../../../src/app/(nondashboard)/checkout/payment/StripeProvider",
  () => ({
    __esModule: true,
    default: ({ children }: any) => (
      <div data-testid="stripe-provider">{children}</div>
    ),
  })
);

/* =========================================================
   Imports after mocks
   ========================================================= */
import { useCurrentCourse } from "../../../../src/hooks/useCurrentCourse";
import { useCheckoutNavigation } from "../../../../src/hooks/useCheckoutNavigation";
import { useUser, useClerk } from "@clerk/nextjs";

/* =========================================================
   Tests
   ========================================================= */
describe("PaymentPage", () => {
  const mockNavigateToStep = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirmPayment.mockReset();

    (useCurrentCourse as jest.Mock).mockReturnValue({
      course: { title: "React Advanced", price: 99 },
      courseId: "course123",
    });

    (useCheckoutNavigation as jest.Mock).mockReturnValue({
      navigateToStep: mockNavigateToStep,
    });

    (useUser as jest.Mock).mockReturnValue({
      user: { id: "user1" },
    });

    (useClerk as jest.Mock).mockReturnValue({
      signOut: mockSignOut,
    });
  });

  /* ---------- Render Tests ---------- */
  test("renders course preview and payment element", () => {
    render(<PaymentPage />);

    expect(screen.getByTestId("course-preview")).toHaveTextContent(
      "React Advanced"
    );
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    expect(screen.getByText(/Pay with Credit Card/i)).toBeInTheDocument();
  });

  /* ---------- Account Switch ---------- */
  test("calls signOut and navigateToStep(1) when switching account", async () => {
    render(<PaymentPage />);

    const switchButton = screen.getByText(/Switch Account/i);
    fireEvent.click(switchButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockNavigateToStep).toHaveBeenCalledWith(1);
    });
  });

  /* ---------- Stripe Missing ---------- */
  test("shows error toast when stripe is unavailable", async () => {
    jest.resetModules();
  
    jest.doMock("@stripe/react-stripe-js", () => ({
      useStripe: () => null,
      useElements: () => null,
      PaymentElement: () => <div data-testid="payment-element" />,
    }));
  
    jest.doMock("@clerk/nextjs", () => ({
      useUser: () => ({ user: { id: "user1" } }),
      useClerk: () => ({ signOut: jest.fn() }),
    }));
  
    jest.doMock("../../../../src/hooks/useCheckoutNavigation", () => ({
      useCheckoutNavigation: () => ({ navigateToStep: jest.fn() }),
    }));
  
    jest.doMock("../../../../src/hooks/useCurrentCourse", () => ({
      useCurrentCourse: () => ({
        course: { title: "React Advanced", price: 99 },
        courseId: "course123",
      }),
    }));
  
    // ✅ Mock "sonner" inside this isolated module so toast connects correctly
    const localToastError = jest.fn();
    jest.doMock("sonner", () => ({
      toast: { error: localToastError, success: jest.fn() },
    }));
  
    let PaymentPageReloaded: any;
    await jest.isolateModulesAsync(async () => {
      const mod = await import(
        "../../../../src/app/(nondashboard)/checkout/payment/index"
      );
      PaymentPageReloaded = mod.default;
    });
  
    render(<PaymentPageReloaded />);
  
    const form = document.querySelector("#payment-form")!;
    fireEvent.submit(form);
  
    await waitFor(() => {
      expect(localToastError).toHaveBeenCalledWith(
        "Stripe service is not available"
      );
    });
  });
  
  /* ---------- Successful Payment ---------- */
  test("handles successful payment and navigates to step 3", async () => {
    mockConfirmPayment.mockResolvedValueOnce({
      paymentIntent: { status: "succeeded", id: "pi_123" },
    });

    render(<PaymentPage />);

    const payButton = screen.getByText(/Pay with Credit Card/i);
    fireEvent.click(payButton);

    await waitFor(
      () => {
        expect(mockConfirmPayment).toHaveBeenCalled();
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "Payment successful! Updating your courses..."
        );
        expect(mockNavigateToStep).toHaveBeenCalledWith(3);
      },
      { timeout: 1500 }
    );
  });

  /* ---------- Failed Payment ---------- */
  test("handles payment error and shows toast", async () => {
    mockConfirmPayment.mockResolvedValueOnce({
      error: { type: "card_error", message: "Card declined" },
    });

    render(<PaymentPage />);

    const payButton = screen.getByText(/Pay with Credit Card/i);
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Card declined");
    });
  });
});
