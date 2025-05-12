// src/utils/codeFormatUtils.ts

/**
 * Validates a code format
 * @param code The code to validate
 * @param expectedPrefix Optional prefix the code should have (e.g., "IFL-")
 * @returns Whether the code is valid and any error message
 */
export function validateCodeFormat(
    code: string,
    expectedPrefix?: string
  ): { valid: boolean; message: string } {
    // Check if empty
    if (!code) {
      return { valid: false, message: 'Code cannot be empty' };
    }
    
    // Trim and convert to uppercase
    const sanitizedCode = code.trim().toUpperCase();
    
    // Check format: Should be in the format PREFIX-XXXXX
    const codeRegex = /^[A-Z0-9]+-[A-Z0-9]+$/;
    if (!codeRegex.test(sanitizedCode)) {
      return { 
        valid: false, 
        message: 'Invalid code format. Expected something like "IFL-ABC123"' 
      };
    }
    
    // Check prefix if specified
    if (expectedPrefix && !sanitizedCode.startsWith(expectedPrefix)) {
      return { 
        valid: false, 
        message: `Code must start with the prefix "${expectedPrefix}"` 
      };
    }
  
    return { valid: true, message: 'Code is valid' };
  }
  
  /**
   * Sanitize and format a code
   * @param code The code to sanitize
   * @returns Sanitized code
   */
  export function sanitizeCode(code: string): string {
    // Remove whitespace and convert to uppercase
    return code.trim().toUpperCase();
  }
  
  /**
   * Extract code from a URL
   * @param url The URL containing a code
   * @returns Extracted code or null if not found
   */
  export function extractCodeFromUrl(url: string): string | null {
    try {
      // If the URL has a path format like /code/IFL-ABC123
      if (url.includes('/')) {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        // Check the last part of the path
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart && lastPart.includes('-')) {
          return lastPart.toUpperCase();
        }
      }
      
      // If the URL is actually just the code itself
      if (url.includes('-')) {
        return url.trim().toUpperCase();
      }
      
      return null;
    } catch (e) {
      // If parsing as URL fails, check if the string itself looks like a code
      if (url.includes('-')) {
        return url.trim().toUpperCase();
      }
      return null;
    }
  }