// src/types/ReportTypes.ts

/**
 * Status of a found item report
 */
export enum ReportStatus {
    PENDING = 'pending',    // Report has been submitted but not yet processed
    CONTACTED = 'contacted', // Owner has contacted the finder
    RECOVERED = 'recovered', // Item has been recovered by the owner
    EXPIRED = 'expired',    // Report has expired (no action taken)
    INVALID = 'invalid',    // Report has been marked as invalid
  }
  
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
  