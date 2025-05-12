// src/types/CodeTypes.ts

/**
 * Status of a QR code
 */
export type CodeStatus = 'available' | 'assigned' | 'disabled';

// Constants for CodeStatus (for reference)
export const CODE_STATUS = {
  AVAILABLE: 'available',  // Code is available and not assigned to a specific item
  ASSIGNED: 'assigned',    // Code is assigned to an item
  DISABLED: 'disabled',    // Code is disabled and cannot be used
} as const;

/**
 * Code validation result
 */
export interface CodeValidationResult {
  valid: boolean;
  code: string;
  message: string;
  codeData?: CodeData;
  batchData?: BatchData;
}

/**
 * Base code data stored in Firestore
 */
export interface CodeData {
  batchId: string;
  status: CodeStatus | string;
  createdAt: any; // Firebase Timestamp
  assignedAt?: any; // Firebase Timestamp
  assignedTo?: string;
  productType?: string;
  expirationDate?: any; // Firebase Timestamp
  userId?: string; // Owner ID
  ownerId?: string; // Alternative owner ID field
  lastReportedAt?: any; // Firebase Timestamp
  lastReportId?: string;
  reportCount?: number;
}

/**
 * Code with ID field
 */
export interface CodeWithId extends CodeData {
  id: string; // The code itself (e.g., "IFL-ABC123")
}

/**
 * Batch data stored in Firestore
 */
export interface BatchData {
  name: string;
  description?: string;
  prefix: string;
  codeLength: number;
  quantity: number;
  status: 'generating' | 'completed' | 'failed';
  createdAt: any; // Firebase Timestamp
  createdBy: string;
  completedAt?: any; // Firebase Timestamp
  generatedCount: number;
  productType?: string;
}

/**
 * Batch with ID field
 */
export interface BatchWithId extends BatchData {
  id: string;
}