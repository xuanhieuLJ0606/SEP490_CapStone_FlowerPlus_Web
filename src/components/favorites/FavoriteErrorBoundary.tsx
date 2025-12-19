import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FavoriteErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function FavoriteErrorFallback({
  error,
  resetErrorBoundary
}: FavoriteErrorFallbackProps) {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium">Có lỗi xảy ra với tính năng yêu thích</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error.message || 'Không thể tải dữ liệu yêu thích'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetErrorBoundary}
          className="ml-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Thử lại
        </Button>
      </AlertDescription>
    </Alert>
  );
}

interface FavoriteErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<FavoriteErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function FavoriteErrorBoundary({
  children,
  fallback: Fallback = FavoriteErrorFallback,
  onError
}: FavoriteErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onError={(error, errorInfo) => {
        console.error(
          'Favorite Error Boundary caught an error:',
          error,
          errorInfo
        );
        onError?.(error, errorInfo);
      }}
      onReset={() => {
        // Reset any global state if needed
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Hook for handling async errors in components
export function useFavoriteErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error(`Favorite error${context ? ` in ${context}` : ''}:`, error);

    // You could integrate with error reporting service here
    // Example: Sentry.captureException(error, { tags: { context: 'favorites' } });

    return error;
  }, []);

  return { handleError };
}
