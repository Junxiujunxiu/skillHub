export {};

declare global {
  // Tell TS that Jest will inject these at runtime
  var mockToastError: jest.Mock;
  var mockToastSuccess: jest.Mock;
}
