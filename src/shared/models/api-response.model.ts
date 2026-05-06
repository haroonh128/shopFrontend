import { ApiError } from "../interfaces/api-error.interface";

export class ApiResponse<TData = unknown> {
  success: boolean;
  message: string;
  data: TData;
  errors: ApiError[];
  timestamp: string;

  constructor({
    success,
    message,
    data,
    errors = [],
    timestamp
  }: {
    success: boolean;
    message: string;
    data: TData;
    errors?: ApiError[];
    timestamp: string;
  }) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = timestamp;
  }
}
