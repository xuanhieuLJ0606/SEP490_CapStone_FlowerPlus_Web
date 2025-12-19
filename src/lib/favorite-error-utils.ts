import { toast } from 'sonner';

export interface FavoriteError extends Error {
  code?: string;
  status?: number;
  response?: {
    status: number;
    data?: {
      message?: string;
      code?: string;
    };
  };
}

export class FavoriteErrorHandler {
  private static readonly ERROR_MESSAGES = {
    NETWORK_ERROR:
      'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
    UNAUTHORIZED: 'Bạn cần đăng nhập để sử dụng tính năng này.',
    FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
    NOT_FOUND: 'Sản phẩm không tồn tại hoặc đã bị xóa.',
    CONFLICT: 'Sản phẩm đã có trong danh sách yêu thích.',
    SERVER_ERROR: 'Có lỗi xảy ra trên máy chủ. Vui lòng thử lại sau.',
    TIMEOUT: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',
    UNKNOWN: 'Có lỗi không xác định xảy ra.'
  };

  static getErrorMessage(error: FavoriteError): string {
    // Check for specific error codes first
    if (error.code) {
      switch (error.code) {
        case 'NETWORK_ERROR':
        case 'ERR_NETWORK':
          return this.ERROR_MESSAGES.NETWORK_ERROR;
        case 'TIMEOUT':
        case 'ERR_TIMEOUT':
          return this.ERROR_MESSAGES.TIMEOUT;
      }
    }

    // Check HTTP status codes
    const status = error.response?.status || error.status;
    if (status) {
      switch (status) {
        case 401:
          return this.ERROR_MESSAGES.UNAUTHORIZED;
        case 403:
          return this.ERROR_MESSAGES.FORBIDDEN;
        case 404:
          return this.ERROR_MESSAGES.NOT_FOUND;
        case 409:
          return this.ERROR_MESSAGES.CONFLICT;
        case 500:
        case 502:
        case 503:
        case 504:
          return this.ERROR_MESSAGES.SERVER_ERROR;
      }
    }

    // Check for custom message from server
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      return serverMessage;
    }

    // Fallback to error message or unknown error
    return error.message || this.ERROR_MESSAGES.UNKNOWN;
  }

  static shouldRetry(error: FavoriteError, attemptNumber: number): boolean {
    // Don't retry more than 3 times
    if (attemptNumber >= 3) {
      return false;
    }

    // Don't retry client errors (4xx)
    const status = error.response?.status || error.status;
    if (status && status >= 400 && status < 500) {
      return false;
    }

    // Retry on network errors and server errors
    return Boolean(
      error.code === 'NETWORK_ERROR' ||
        error.code === 'ERR_NETWORK' ||
        error.code === 'TIMEOUT' ||
        error.code === 'ERR_TIMEOUT' ||
        (status && status >= 500)
    );
  }

  static getRetryDelay(attemptNumber: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const exponentialDelay = baseDelay * Math.pow(2, attemptNumber);
    const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter

    return Math.min(exponentialDelay + jitter, maxDelay);
  }

  static handleError(error: FavoriteError, context?: string): void {
    const message = this.getErrorMessage(error);

    console.error(`Favorite error${context ? ` in ${context}` : ''}:`, {
      message: error.message,
      status: error.response?.status || error.status,
      code: error.code,
      stack: error.stack
    });

    // Show user-friendly error message
    toast.error(message);

    // Report to error tracking service if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          context: context || 'favorites',
          component: 'favorite-error-handler'
        },
        extra: {
          status: error.response?.status || error.status,
          code: error.code
        }
      });
    }
  }

  static createRetryablePromise<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    context?: string
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let attemptNumber = 0;

      const attempt = async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          const favoriteError = error as FavoriteError;
          attemptNumber++;

          if (
            this.shouldRetry(favoriteError, attemptNumber) &&
            attemptNumber <= maxRetries
          ) {
            const delay = this.getRetryDelay(attemptNumber - 1);

            console.warn(
              `Retrying favorite operation (attempt ${attemptNumber}/${maxRetries}) after ${delay}ms`,
              { context, error: favoriteError.message }
            );

            setTimeout(attempt, delay);
          } else {
            this.handleError(favoriteError, context);
            reject(favoriteError);
          }
        }
      };

      attempt();
    });
  }
}

// Utility functions for common error scenarios
export const favoriteErrorUtils = {
  isNetworkError: (error: FavoriteError): boolean => {
    return error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK';
  },

  isTimeoutError: (error: FavoriteError): boolean => {
    return error.code === 'TIMEOUT' || error.code === 'ERR_TIMEOUT';
  },

  isAuthError: (error: FavoriteError): boolean => {
    const status = error.response?.status || error.status;
    return status === 401 || status === 403;
  },

  isServerError: (error: FavoriteError): boolean => {
    const status = error.response?.status || error.status;
    return status ? status >= 500 : false;
  },

  isClientError: (error: FavoriteError): boolean => {
    const status = error.response?.status || error.status;
    return status ? status >= 400 && status < 500 : false;
  }
};
