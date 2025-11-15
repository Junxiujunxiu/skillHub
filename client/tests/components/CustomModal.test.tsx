/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomModal from "../../src/components/CustomModal";

describe("CustomModal", () => {
  test("does not render when isOpen = false", () => {
    const { container } = render(
      <CustomModal isOpen={false} onClose={jest.fn()}>
        <div>content</div>
      </CustomModal>
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders overlay and content when open", () => {
    render(
      <CustomModal isOpen={true} onClose={jest.fn()}>
        <div data-testid="modal-child">Hello Modal</div>
      </CustomModal>
    );

    expect(screen.getByTestId("modal-child")).toBeInTheDocument();
    expect(document.querySelector(".custom-modal__overlay")).toBeInTheDocument();
    expect(document.querySelector(".custom-modal__content")).toBeInTheDocument();
  });

  test("calls onClose when clicking overlay", () => {
    const mockClose = jest.fn();

    render(
      <CustomModal isOpen={true} onClose={mockClose}>
        <div>child</div>
      </CustomModal>
    );

    const overlay = document.querySelector(".custom-modal__overlay")!;
    fireEvent.click(overlay);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test("does NOT close when clicking inside content", () => {
    const mockClose = jest.fn();

    render(
      <CustomModal isOpen={true} onClose={mockClose}>
        <div data-testid="modal-inner">child</div>
      </CustomModal>
    );

    const content = screen.getByTestId("modal-inner");
    fireEvent.click(content);

    expect(mockClose).not.toHaveBeenCalled();
  });

  test("renders children correctly", () => {
    render(
      <CustomModal isOpen={true} onClose={jest.fn()}>
        <p data-testid="text">Modal Body</p>
      </CustomModal>
    );

    expect(screen.getByTestId("text")).toHaveTextContent("Modal Body");
  });
});
