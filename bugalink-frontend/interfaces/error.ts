export type APIError = {
  type: string;
  errors: Error[];
};

export type Error = {
  code: string;
  detail: string;
  attr?: any;
};
