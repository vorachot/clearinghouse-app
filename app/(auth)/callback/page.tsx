"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { googleAuthWithCH } from "@/api/auth";
import { useUser } from "@/context/UserContext";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchUser } = useUser();
  const queryString = searchParams.toString();

  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (queryString) {
          const response = await googleAuthWithCH(queryString);

          if (response.ok) {
            await fetchUser();
            router.replace("/organizations");
          } else {
            // Extract error message from response body
            let errorMessage = "Authentication failed";
            try {
              const errorData = await response.text();

              try {
                const errorObj = JSON.parse(errorData);

                if (errorObj.error && typeof errorObj.error === "string") {
                  try {
                    const nestedError = JSON.parse(errorObj.error);
                    errorMessage =
                      nestedError.error ||
                      nestedError.message ||
                      errorObj.error;
                  } catch {
                    errorMessage = errorObj.error;
                  }
                } else if (errorObj.message) {
                  errorMessage = errorObj.message;
                } else {
                  errorMessage = errorData;
                }
              } catch {
                errorMessage = errorData || response.statusText;
              }
            } catch {
              errorMessage = response.statusText;
            }

            throw new Error(errorMessage);
          }
        } else {
          setError("No authentication data received");
          setTimeout(() => router.replace("/login"), 2000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
        setTimeout(() => router.replace("/login?error=callback_failed"), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [queryString, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-4 text-lg">Processing authentication...</p>
          </>
        ) : (
          <p className="text-lg">Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;
