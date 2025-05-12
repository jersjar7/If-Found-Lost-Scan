// src/utils/dateUtils.ts

/**
 * Format a date to a human-readable string
 * @param date The date to format
 * @param format The format to use (short, medium, long)
 * @returns Formatted date string
 */
export function formatDate(
    date: Date | string | number | null | undefined,
    format: 'short' | 'medium' | 'long' = 'medium'
  ): string {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'object' ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    // Different format options
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString();
      case 'long':
        return dateObj.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'medium':
      default:
        return dateObj.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
    }
  }
  
  /**
   * Format a date to include time
   * @param date The date to format
   * @param includeSeconds Whether to include seconds
   * @returns Formatted date and time string
   */
  export function formatDateTime(
    date: Date | string | number | null | undefined,
    includeSeconds: boolean = false
  ): string {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'object' ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    if (includeSeconds) {
      options.second = '2-digit';
    }
    
    return dateObj.toLocaleString(undefined, options);
  }
  
  /**
   * Format a date to show how long ago it was
   * @param date The date to calculate from
   * @returns Human-readable time difference
   */
  export function formatRelativeTime(date: Date | string | number | null | undefined): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'object' ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a month
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a year
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
    
    // More than a year
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
  
  /**
   * Check if a date is today
   * @param date The date to check
   * @returns Whether the date is today
   */
  export function isToday(date: Date | string | number): boolean {
    const dateObj = typeof date === 'object' ? date : new Date(date);
    const today = new Date();
    
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  }
  
  /**
   * Convert a Firebase Timestamp to a JavaScript Date
   * @param timestamp Firebase Timestamp object or null
   * @returns JavaScript Date or null
   */
  export function timestampToDate(timestamp: any): Date | null {
    if (!timestamp) return null;
    
    // Check if it's a Firebase Timestamp with toDate method
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    
    // If it's already a Date, return it
    if (timestamp instanceof Date) {
      return timestamp;
    }
    
    // Try to convert from a number or string
    try {
      return new Date(timestamp);
    } catch (e) {
      console.error('Invalid timestamp format:', e);
      return null;
    }
  }