// src/services/ReportService.ts
import { collection, addDoc, Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { FoundItemData } from '../components/FoundItemForm';

/**
 * Service for submitting and managing found item reports
 */
export class ReportService {
  /**
   * Submit a found item report
   * @param reportData The report data
   * @returns The report ID
   */
  static async submitReport(reportData: FoundItemData): Promise<string> {
    try {
      // Validate that the code exists before submitting
      const codeRef = doc(db, 'stickerCodes', reportData.code);
      const codeDoc = await getDoc(codeRef);
      
      if (!codeDoc.exists()) {
        throw new Error('Invalid code. Please check the code and try again.');
      }
      
      const codeData = codeDoc.data();
      
      // Prepare the report data
      const report = {
        ...reportData,
        status: 'pending', // Initial status
        reportedAt: Timestamp.now(),
        codeId: reportData.code,
        batchId: codeData.batchId || null,
        ownerNotified: false,
        ownerContactedFinder: false,
        resolvedAt: null,
        productType: codeData.productType || null,
      };
      
      // Add the report to Firestore
      const reportRef = await addDoc(collection(db, 'foundReports'), report);
      
      // Update the code status to indicate it's been reported
      await updateDoc(codeRef, {
        lastReportedAt: Timestamp.now(),
        lastReportId: reportRef.id,
        reportCount: (codeData.reportCount || 0) + 1
      });
      
      // Trigger notification processes (could be handled by a Cloud Function)
      
      return reportRef.id;
    } catch (error: any) {
      console.error('Error submitting report:', error);
      throw new Error(error.message || 'Failed to submit the report. Please try again.');
    }
  }
  
  /**
   * Check if a report already exists for this code
   * @param code The code to check
   * @returns Whether a report exists and its status
   */
  static async checkExistingReport(code: string): Promise<{ exists: boolean; status?: string; reportedAt?: Date }> {
    try {
      // Get the code document to check for last report
      const codeRef = doc(db, 'stickerCodes', code);
      const codeDoc = await getDoc(codeRef);
      
      if (!codeDoc.exists() || !codeDoc.data().lastReportId) {
        return { exists: false };
      }
      
      // Get the last report 
      const lastReportId = codeDoc.data().lastReportId;
      const reportRef = doc(db, 'foundReports', lastReportId);
      const reportDoc = await getDoc(reportRef);
      
      if (!reportDoc.exists()) {
        return { exists: false };
      }
      
      const reportData = reportDoc.data();
      
      return { 
        exists: true, 
        status: reportData.status,
        reportedAt: reportData.reportedAt?.toDate() 
      };
    } catch (error) {
      console.error('Error checking existing report:', error);
      return { exists: false };
    }
  }
}