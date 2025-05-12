// src/utils/urlUtils.ts

/**
 * Get a parameter from the URL query string
 * @param name Parameter name
 * @param defaultValue Default value if parameter is not found
 * @returns Parameter value or default value
 */
export function getQueryParam(name: string, defaultValue: string = ''): string {
    if (typeof window === 'undefined') return defaultValue;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || defaultValue;
  }
  
  /**
   * Set a parameter in the URL query string without page reload
   * @param name Parameter name
   * @param value Parameter value
   */
  export function setQueryParam(name: string, value: string): void {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url.toString());
  }
  
  /**
   * Remove a parameter from the URL query string without page reload
   * @param name Parameter name
   */
  export function removeQueryParam(name: string): void {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url.toString());
  }
  
  /**
   * Check if a URL is valid
   * @param url URL to validate
   * @returns Whether the URL is valid
   */
  export function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Extract a code from a URL path
   * @param url URL containing a code
   * @returns Extracted code or null if not found
   */
  export function extractCodeFromPath(url: string): string | null {
    if (!url) return null;
    
    try {
      // Handle full URLs
      let path = url;
      
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        path = urlObj.pathname;
      }
      
      // Split the path by slashes
      const parts = path.split('/').filter(Boolean);
      
      // Check the last part
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        
        // If it looks like a code (contains a hyphen)
        if (lastPart && lastPart.includes('-')) {
          return lastPart.toUpperCase();
        }
      }
      
      return null;
    } catch (e) {
      console.error('Error extracting code from path:', e);
      return null;
    }
  }
  
  /**
   * Build a URL with query parameters
   * @param baseUrl Base URL
   * @param params Object containing query parameters
   * @returns Full URL with query parameters
   */
  export function buildUrl(baseUrl: string, params: Record<string, string>): string {
    const url = new URL(baseUrl, window.location.origin);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  }
  
  /**
   * Checks if the app is running in a mobile browser
   * @returns Whether the app is running on a mobile device
   */
  export function isMobileDevice(): boolean {
    if (typeof window === 'undefined' || !window.navigator) return false;
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    );
  }