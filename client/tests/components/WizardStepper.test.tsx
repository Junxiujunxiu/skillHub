/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// Mock lucide-react (Check icon)
jest.mock("lucide-react", () => ({
  Check: (props: any) => <svg data-testid="icon-check" {...props} />,
}));

// Mock cn utility (NOW CORRECTLY EXPANDS OBJECT ARGUMENTS)
jest.mock("@/lib/utils", () => ({
    cn: (...args: any[]) =>
      args
        .map((arg) => {
          if (!arg) return "";
          if (typeof arg === "string") return arg;
          if (typeof arg === "object") {
            return Object.entries(arg)
              .filter(([_, value]) => Boolean(value))
              .map(([key]) => key)
              .join(" ");
          }
          return "";
        })
        .filter(Boolean)
        .join(" "),
  }));
  

import WizardStepper from "../../src/components/WizardStepper";

describe("WizardStepper", () => {
  test("renders all 3 steps", () => {
    render(<WizardStepper currentStep={1} />);

    expect(screen.getByText("Checkout Details")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("Completion")).toBeInTheDocument();
  });

  test("step 1 is active when currentStep = 1", () => {
    render(<WizardStepper currentStep={1} />);

    const step1Circle = screen.getByText("1").parentElement!;
    expect(step1Circle.className).toContain("wizard-stepper__circle--current");
  });

  test("step 2 and 3 are upcoming when currentStep = 1", () => {
    render(<WizardStepper currentStep={1} />);

    expect(screen.getByText("2").parentElement!.className).toContain(
      "wizard-stepper__circle--upcoming"
    );
    expect(screen.getByText("3").parentElement!.className).toContain(
      "wizard-stepper__circle--upcoming"
    );
  });

  test("step 1 is completed and step 2 is current when currentStep = 2", () => {
    render(<WizardStepper currentStep={2} />);

    expect(screen.getByTestId("icon-check")).toBeInTheDocument(); // step 1 checkmark

    const step2Circle = screen.getByText("2").parentElement!;
    expect(step2Circle.className).toContain("wizard-stepper__circle--current");
  });

  test("all steps show completed when currentStep = 3", () => {
    render(<WizardStepper currentStep={3} />);

    // Should render THREE checkmark icons
    const checks = screen.getAllByTestId("icon-check");
    expect(checks.length).toBe(3);
  });

  test("lines between steps show correct classes", () => {
    const { container } = render(<WizardStepper currentStep={2} />);

    const lines = container.querySelectorAll(".wizard-stepper__line");

    expect(lines.length).toBe(2);

    // line after step 1 = completed
    expect(lines[0].className).toContain("wizard-stepper__line--completed");

    // line after step 2 = incomplete
    expect(lines[1].className).toContain("wizard-stepper__line--incomplete");
  });
});
