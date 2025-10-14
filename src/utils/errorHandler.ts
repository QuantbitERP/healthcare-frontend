/**
 * Utility function to extract actual error messages from ApiError objects
 * The ApiError.message is often generic (like "Bad Request"), but ApiError.body contains the actual API response
 */
export const extractApiErrorMessage = (error: any): string => {
  // Check if it's an ApiError with body (this contains the actual API response)
  if (error?.body && typeof error.body === "object") {
    const responseBody = error.body;
    
    // Handle the specific API response format: { data: null, isError: true, errorMessage: "...", ... }
    if (responseBody?.errorMessage) {
      return responseBody.errorMessage;
    }
    
    // Handle the specific API response format: { data: null, IsError: true, ErrorMessage: "...", ... }
    if (responseBody?.ErrorMessage) {
      return responseBody.ErrorMessage;
    }
    
    if (responseBody?.errors && typeof responseBody.errors === "object") {
      // Handle validation errors from API - extract all error messages
      const extractedErrors: string[] = [];
      
      Object.entries(responseBody.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((message: string) => {
            // Remove "Model." prefix from field names for better display
            const cleanField = field.replace("Model.", "");
            extractedErrors.push(`${cleanField}: ${message}`);
          });
        } else if (typeof messages === "string") {
          const cleanField = field.replace("Model.", "");
          extractedErrors.push(`${cleanField}: ${messages}`);
        }
      });
      
      if (extractedErrors.length > 0) {
        return extractedErrors.join(", ");
      }
    } else if (responseBody?.message) {
      return responseBody.message;
    } else if (responseBody?.title) {
      return responseBody.title;
    } else if (responseBody?.detail) {
      return responseBody.detail;
    }
  }
  
  // Fallback to other error structures
  if (error?.response?.data) {
    const responseData = error.response.data;
    
    // Handle the specific API response format: { data: null, isError: true, errorMessage: "...", ... }
    if (responseData?.errorMessage) {
      return responseData.errorMessage;
    }
    
    // Handle the specific API response format: { data: null, IsError: true, ErrorMessage: "...", ... }
    if (responseData?.ErrorMessage) {
      return responseData.ErrorMessage;
    }
    
    if (responseData?.errors && typeof responseData.errors === "object") {
      const extractedErrors: string[] = [];
      
      Object.entries(responseData.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((message: string) => {
            const cleanField = field.replace("Model.", "");
            extractedErrors.push(`${cleanField}: ${message}`);
          });
        } else if (typeof messages === "string") {
          const cleanField = field.replace("Model.", "");
          extractedErrors.push(`${cleanField}: ${messages}`);
        }
      });
      
      if (extractedErrors.length > 0) {
        return extractedErrors.join(", ");
      }
    } else if (responseData?.message) {
      return responseData.message;
    } else if (responseData?.title) {
      return responseData.title;
    }
  }
  
  if (error?.errors && typeof error.errors === "object") {
    const extractedErrors: string[] = [];
    
    Object.entries(error.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach((message: string) => {
          const cleanField = field.replace("Model.", "");
          extractedErrors.push(`${cleanField}: ${message}`);
        });
      } else if (typeof messages === "string") {
        const cleanField = field.replace("Model.", "");
        extractedErrors.push(`${cleanField}: ${messages}`);
      }
    });
    
    if (extractedErrors.length > 0) {
      return extractedErrors.join(", ");
    }
  }
  
  // Handle direct error message (but filter out generic HTTP messages)
  if (error?.message) {
    const genericMessages = ['Bad Request', 'Unauthorized', 'Forbidden', 'Not Found', 'Internal Server Error'];
    if (!genericMessages.includes(error.message)) {
      return error.message;
    }
  }
  
  if (error?.errorMessage) {
    return error.errorMessage;
  }
  
  if (error?.ErrorMessage) {
    return error.ErrorMessage;
  }
  
  if (error?.title) {
    return error.title;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  // Default fallback
  return "An error occurred. Please try again.";
}
