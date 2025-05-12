// src/services/NotificationService.ts
import { httpsCallable } from 'firebase/functions';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { functions, db } from '../firebase';

/**
 * Notification types
 */
export type NotificationType = 'item_found' | 'item_recovered' | 'report_update';

// Constants for NotificationType (for reference)
export const NOTIFICATION_TYPES = {
  ITEM_FOUND: 'item_found',
  ITEM_RECOVERED: 'item_recovered',
  REPORT_UPDATE: 'report_update',
} as const;

/**
 * Notification data interface
 */
export interface NotificationData {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
}

/**
 * Service for sending notifications
 */
export class NotificationService {
  /**
   * Send a notification to an item owner when their item is found
   * @param reportId The report ID
   * @param codeId The code ID
   * @returns Success status
   */
  static async sendItemFoundNotification(
    reportId: string,
    codeId: string
  ): Promise<boolean> {
    try {
      // Get the report details
      const reportRef = doc(db, 'foundReports', reportId);
      const reportDoc = await getDoc(reportRef);
      
      if (!reportDoc.exists()) {
        console.error('Report not found:', reportId);
        return false;
      }
      
      const reportData = reportDoc.data();
      
      // Get the code details
      const codeRef = doc(db, 'stickerCodes', codeId);
      const codeDoc = await getDoc(codeRef);
      
      if (!codeDoc.exists()) {
        console.error('Code not found:', codeId);
        return false;
      }
      
      const codeData = codeDoc.data();
      
      // Get the item owner's ID
      const ownerId = codeData.userId || codeData.ownerId;
      
      if (!ownerId) {
        console.error('Owner ID not found for code:', codeId);
        return false;
      }
      
      // Call the Cloud Function to send the notification
      const sendNotification = httpsCallable<any, { success: boolean }>(
        functions,
        'sendNotification'
      );
      
      const locationFound = reportData.locationFound || 'an unknown location';
      
      const result = await sendNotification({
        recipientId: ownerId,
        type: 'item_found',
        title: 'Your Item Has Been Found!',
        message: `Someone has found your item with code ${codeId} in ${locationFound}. Check your account for details.`,
        data: {
          reportId,
          codeId,
          locationFound: reportData.locationFound,
          foundDate: reportData.foundDate,
          finderName: reportData.finderName,
        },
      });
      
      // Update the report to indicate that the owner has been notified
      if (result.data.success) {
        await updateDoc(reportRef, {
          ownerNotified: true,
          ownerNotifiedAt: Timestamp.now(),
        });
      }
      
      return result.data.success;
    } catch (error) {
      console.error('Error sending item found notification:', error);
      return false;
    }
  }
  
  /**
   * Send a direct email notification (fallback method if Cloud Functions are not available)
   * Note: This should be used with caution to avoid exposing email addresses
   * @param data Notification data
   * @returns Success status
   */
  static async sendEmailNotification(
    email: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    try {
      // Call the Cloud Function to send the email
      const sendEmail = httpsCallable<any, { success: boolean }>(
        functions,
        'sendEmail'
      );
      
      const result = await sendEmail({
        to: email,
        subject,
        message,
      });
      
      return result.data.success;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }
  
  /**
   * Check notification settings for a user
   * @param userId User ID
   * @returns Notification settings
   */
  static async getNotificationSettings(userId: string): Promise<any> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return {
          email: true,
          push: true,
          sms: false,
        };
      }
      
      const userData = userDoc.data();
      
      return userData.notificationSettings || {
        email: true,
        push: true,
        sms: false,
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        email: true,
        push: true,
        sms: false,
      };
    }
  }
}