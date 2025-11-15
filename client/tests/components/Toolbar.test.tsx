/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Toolbar from "../../src/components/Toolbar";


jest.mock("@/components/ui/select", () => {
    const React = require("react");
  
    return {
      Select: ({ children, onValueChange }: any) => (
        <div data-testid="select">
          {React.Children.map(children, (child: any) =>
            React.cloneElement(child, { onValueChange })
          )}
        </div>
      ),
  
      SelectTrigger: ({ children }: any) => (
        <div data-testid="select-trigger">{children}</div>
      ),
  
      SelectContent: ({ children, onValueChange }: any) => (
        <div data-testid="select-content">
          {React.Children.map(children, (child: any) =>
            React.cloneElement(child, { onSelect: onValueChange })
          )}
        </div>
      ),
  
      SelectItem: ({ value, children, onSelect }: any) => (
        <div
          data-testid={`select-item-${value}`}
          onClick={() => onSelect?.(value)}
        >
          {children}
        </div>
      ),
  
      SelectValue: ({ placeholder }: any) => (
        <span data-testid="select-value">{placeholder}</span>
      ),
    };
  });
  

describe("Toolbar", () => {
  test("calls onSearch when typing", () => {
    const mockOnSearch = jest.fn();
    const mockOnCategoryChange = jest.fn();

    render(
      <Toolbar
        onSearch={mockOnSearch}
        onCategoryChange={mockOnCategoryChange}
        categories={["design", "math"]}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search courses..."), {
      target: { value: "hello" },
    });

    expect(mockOnSearch).toHaveBeenCalledWith("hello");
  });

  test("calls onCategoryChange when selecting a category", () => {
    const mockOnSearch = jest.fn();
    const mockOnCategoryChange = jest.fn();

    render(
      <Toolbar
        onSearch={mockOnSearch}
        onCategoryChange={mockOnCategoryChange}
        categories={["design", "math"]}
      />
    );

    fireEvent.click(screen.getByTestId("select-item-design"));

    expect(mockOnCategoryChange).toHaveBeenCalledWith("design");
  });
});
