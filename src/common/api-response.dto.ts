export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;

  constructor(partial: ApiResponse<T>) {
    Object.assign(this, partial);
  }
}
