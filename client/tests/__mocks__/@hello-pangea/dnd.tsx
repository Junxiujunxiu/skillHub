import React from "react";

export const DragDropContext = ({ children, onDragEnd }: any) => (
  <div data-testid="dnd-context" onDragEnd={() => onDragEnd?.({})}>
    {children}
  </div>
);

export const Droppable = ({ children, droppableId }: any) => (
  <div data-testid={`droppable-${droppableId}`}>
    {children({
      innerRef: jest.fn(),
      droppableProps: {},
      placeholder: <div />,
    })}
  </div>
);

export const Draggable = ({ children, draggableId, index }: any) => (
  <div data-testid={`draggable-${draggableId}-${index}`}>
    {children({
      innerRef: jest.fn(),
      draggableProps: {},
      dragHandleProps: {},
    })}
  </div>
);
