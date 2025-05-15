// src/types/ReportTypes.ts

/**
 * Status of a found item report
 */
export type ReportStatus = 'pending' | 'contacted' | 'recovered' | 'expired' | 'invalid';

// Constants for ReportStatus (for reference)
export const REPORT_STATUS = {
  PENDING: 'pending',     // Report has been submitted but not yet processed
  CONTACTED: 'contacted', // Owner has contacted the finder
  RECOVERED: 'recovered', // Item has been recovered by the owner
  EXPIRED: 'expired',     // Report has expired (no action taken)
  INVALID: 'invalid',     // Report has been marked as invalid
} as const;

/**
 * Base data for a found item report
 */
export interface FoundReportData {
  finderName: string;
  finderEmail: string;
  finderPhone?: string;
  locationFound: string;
  foundDate: string;
  message?: string;
  code: string;
  codeId: string;
  batchId?: string;
  reportedAt: any; // Firebase Timestamp
  status: ReportStatus | string;
  ownerNotified: boolean;
  ownerNotifiedAt?: any; // Firebase Timestamp
  ownerContactedFinder: boolean;
  ownerContactedAt?: any; // Firebase Timestamp
  resolvedAt?: any; // Firebase Timestamp
  productType?: string;
  ownerNotes?: string;
  // New fields
  latitude?: number;
  longitude?: number;
  photos?: string[]; // Array of photo URLs
}

/**
 * Found report with ID field
 */
export interface FoundReportWithId extends FoundReportData {
  id: string;
}

/**
 * Data for creating a new found item report
 */
export interface CreateFoundReportData {
  finderName: string;
  finderEmail: string;
  finderPhone?: string;
  locationFound: string;
  foundDate: string;
  message?: string;
  code: string;
  // New fields
  latitude?: number;
  longitude?: number;
  photos?: string[]; // Array of photo URLs
}

/**
 * Result of a report submission
 */
export interface ReportSubmissionResult {
  success: boolean;
  reportId?: string;
  message: string;
  redirectUrl?: string;
}