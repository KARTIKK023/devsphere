import axios from "axios";

export function getApiErrorMessage(
  error: unknown
): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}