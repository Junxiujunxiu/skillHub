import React from "react";

const cleanProps = (props: any) => {
  const newProps = { ...props };
  delete newProps.fill;
  delete newProps.stroke;
  delete newProps.color;
  delete newProps.priority;
  return newProps;
};

export const Trash2 = (props: any) => (
  <svg data-testid="icon-trash" {...cleanProps(props)} />
);

export const Pencil = (props: any) => (
  <svg data-testid="icon-pencil" {...cleanProps(props)} />
);

export const Plus = (props: any) => (
  <svg data-testid="icon-plus" {...cleanProps(props)} />
);

export const GripVertical = (props: any) => (
  <svg data-testid="icon-grip" {...cleanProps(props)} />
);
