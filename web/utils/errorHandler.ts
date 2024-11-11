// utils/errorHandler.ts
type ErrorFunction = (title: string, description: string) => void;

let showErrorFunction: ErrorFunction | null = null;

export const initializeErrorHandler = (showError: ErrorFunction) => {
  console.log("Error handler initialized"); // Debug log
  showErrorFunction = showError;
};

export const showGlobalError = (title: string, description: string) => {
  console.log("Attempting to show error:", { title, description });
  if (showErrorFunction) {
    showErrorFunction(title, description);
  } else {
    console.error("Error handler not initialized", { title, description });
  }
};

export const commonErrors = {
  networkError: () =>
    showGlobalError(
      "Network Error",
      "Unable to connect to server. Please check your connection."
    ),
  unauthorized: () =>
    showGlobalError(
      "Unauthorized",
      "You don't have permission to perform this action."
    ),
  serverError: () =>
    showGlobalError(
      "Server Error",
      "Something went wrong on our end. Please try again later."
    ),
  invalidInput: (field: string) =>
    showGlobalError(
      "Invalid Input",
      `Please check the ${field} field and try again.`
    ),
  custom: (title: string, description: string) =>
    showGlobalError(title, description),
};
