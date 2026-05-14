import { ApiResponse } from './api-response.dto';

export function createResponse<T>(data: T, message = 'OK'): ApiResponse<T> {
  return new ApiResponse({
    success: true,
    message,
    data,
  });
}
