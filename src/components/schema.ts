export interface Option {
  value: string | number;
  label: string;
}

export interface NestedFormData {
  [key: string]: unknown | FormData[];
}

export interface FormData {
  [key: string]: unknown;
}