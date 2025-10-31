import { render, screen } from "@testing-library/react";
import CheckoutWizard from "../../../src/app/(nondashboard)/checkout/page";

// mock flags
let mockIsLoaded = false;
let mockCheckoutStep = 1;

//  Mock Clerk useUser()
jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isLoaded: mockIsLoaded,
  }),
}));

//  Mock checkout navigation hook
jest.mock("@/hooks/useCheckoutNavigation", () => ({
  __esModule: true,
  default: () => ({
    checkoutStep: mockCheckoutStep,
  }),
}));

//  Mock step pages (real paths use index.tsx)
jest.mock(
  "../../../src/app/(nondashboard)/checkout/details/index",
  () => () => <div data-testid="details-page">Details Page</div>
);

jest.mock(
  "../../../src/app/(nondashboard)/checkout/payment/index",
  () => () => <div data-testid="payment-page">Payment Page</div>
);

jest.mock(
  "../../../src/app/(nondashboard)/checkout/completion/index",
  () => () => <div data-testid="completion-page">Completion Page</div>
);

//  Mock Wizard Stepper
jest.mock("@/components/WizardStepper", () => ({ currentStep }: any) => (
  <div data-testid="wizard-stepper">Step: {currentStep}</div>
));

//  Mock Loading
jest.mock("@/components/Loading", () => () => (
  <div data-testid="loading-spinner">Loading...</div>
));

describe("CheckoutWizard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner while auth is loading", () => {
    mockIsLoaded = false;
    render(<CheckoutWizard />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders Details Page when step = 1", () => {
    mockIsLoaded = true;
    mockCheckoutStep = 1;
    render(<CheckoutWizard />);
    expect(screen.getByTestId("wizard-stepper")).toHaveTextContent("Step: 1");
    expect(screen.getByTestId("details-page")).toBeInTheDocument();
  });

  it("renders Payment Page when step = 2", () => {
    mockIsLoaded = true;
    mockCheckoutStep = 2;
    render(<CheckoutWizard />);
    expect(screen.getByTestId("wizard-stepper")).toHaveTextContent("Step: 2");
    expect(screen.getByTestId("payment-page")).toBeInTheDocument();
  });

  it("renders Completion Page when step = 3", () => {
    mockIsLoaded = true;
    mockCheckoutStep = 3;
    render(<CheckoutWizard />);
    expect(screen.getByTestId("wizard-stepper")).toHaveTextContent("Step: 3");
    expect(screen.getByTestId("completion-page")).toBeInTheDocument();
  });
});
