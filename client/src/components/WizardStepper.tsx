import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';

/* =========================================================
   WizardStepper
   - Displays a 3-step visual indicator for the checkout process.
   - Steps:
       1. Checkout Details
       2. Payment
       3. Completion
   - Features:
       • Highlights current step.
       • Marks completed steps with a checkmark.
       • Shows connecting lines between steps.
   ========================================================= */
const WizardStepper = ({ currentStep }: WizardStepperProps) => {
  return (
    <div className="wizard-stepper">
      {/* ---------- Stepper Container ---------- */}
      <div className="wizard-stepper__container">
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            
            {/* ---------- Step Block ---------- */}
            <div className="wizard-stepper__step">
              
              {/* Step Circle → Number or Checkmark */}
              <div
                className={cn("wizard-stepper__circle", {
                  "wizard-stepper__circle--completed": currentStep > step || (currentStep === 3 && step === 3),
                  "wizard-stepper__circle--current": currentStep === step && step !== 3,
                  "wizard-stepper__circle--upcoming": currentStep < step,
                })}
              >
                {currentStep > step || (currentStep === 3 && step === 3) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>

              {/* Step Label */}
              <p
                className={cn("wizard-stepper__text", {
                  "wizard-stepper__text--active": currentStep >= step,
                  "wizard-stepper__text--inactive": currentStep < step,
                })}
              >
                {step === 1 && "Checkout Details"}
                {step === 2 && "Payment"}
                {step === 3 && "Completion"}
              </p>
            </div>

            {/* ---------- Connecting Line (between steps) ---------- */}
            {index < 2 && (
              <div
                className={cn("wizard-stepper__line", {
                  "wizard-stepper__line--completed": currentStep > step,
                  "wizard-stepper__line--incomplete": currentStep <= step,
                })}
              />
            )}

          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WizardStepper;
