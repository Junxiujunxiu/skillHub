import React from "react";

export const Select = ({
  children,
  value,
  onValueChange,
}: {
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (v: string) => void;
}) => (
  <select
    data-testid="mock-select"
    value={value}
    onChange={(e) => onValueChange?.(e.target.value)}
  >
    {children}
  </select>
);

export const SelectTrigger = ({
  children,
}: {
  children?: React.ReactNode;
}) => <div data-testid="mock-select-trigger">{children}</div>;

export const SelectContent = ({
  children,
}: {
  children?: React.ReactNode;
}) => <div data-testid="mock-select-content">{children}</div>;

export const SelectItem = ({
  value,
  children,
}: {
  value: string;
  children?: React.ReactNode;
}) => <option value={value}>{children}</option>;
