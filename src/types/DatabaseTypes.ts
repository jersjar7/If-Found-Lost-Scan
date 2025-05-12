// src/types/DatabaseTypes.ts

import { CodeStatus } from './CodeTypes';
import { ReportStatus } from './ReportTypes';

/**
 * User data stored in Firestore
 */
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: any; // Firebase Timestamp
  lastLoginAt?: any; // Firebase Timestamp
  phoneNumber?: string;
  emailVerified: boolean;
  isActive: boolean;
  plan?: 'free' | 'basic' | 'premium' | 'enterprise';
  planExpiryDate?: any; // Firebase Timestamp
  notificationSettings?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

/**
 * Sticker (QR Code) data stored in Firestore
 */
export interface StickerCodeData {
  batchId: string;
  status: CodeStatus;
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
  itemDetails?: {
    name?: string;
    description?: string;
    category?: string;
    photos?: string[];
    value?: number;
    currency?: string;
    customFields?: Record<string, any>;
  };
}

/**
 * Batch data stored in Firestore
 */
export interface StickerBatchData {
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
  manufacturingDetails?: {
    manufacturer?: string;
    productionDate?: any; // Firebase Timestamp
    batchNumber?: string;
  };
  distributionChannel?: string;
  costData?: {
    costPerUnit?: number;
    currency?: string;
    totalCost?: number;
  };
  expirationDate?: any; // Firebase Timestamp
}

/**
 * Found report data stored in Firestore
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
  status: ReportStatus;
  ownerNotified: boolean;
  ownerNotifiedAt?: any; // Firebase Timestamp
  ownerContactedFinder: boolean;
  ownerContactedAt?: any; // Firebase Timestamp
  resolvedAt?: any; // Firebase Timestamp
  productType?: string;
  ownerNotes?: string;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
  isVerified?: boolean;
  verifiedAt?: any; // Firebase Timestamp
}

/**
 * Notification data stored in Firestore
 */
export interface NotificationData {
  recipientId: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  createdAt: any; // Firebase Timestamp
  read: boolean;
  readAt?: any; // Firebase Timestamp
  sentViaEmail: boolean;
  sentViaPush: boolean;
  sentViaSms: boolean;
}

/**
 * With ID helper type
 */
export type WithId<T> = T & { id: string };