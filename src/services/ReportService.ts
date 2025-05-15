// src/services/ReportService.ts
import { collection, addDoc, Timestamp, doc, getDoc, updateDoc, query, where, getDocs, limit } from 'firebase/firestore';
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
      console.log('Submitting report for code:', reportData.code);
      
      // Validate that the code exists before submitting
      const codeRef = doc(db, 'stickerCodes', reportData.code);
      const codeDoc = await getDoc(codeRef);
      
      if (!codeDoc.exists()) {
        console.error('Invalid code:', reportData.code);
        throw new Error('Invalid code. Please check the code and try again.');
      }
      
      const codeData = codeDoc.data();
      console.log('Code data found:', codeData);
      
      // Prepare the report data
      const report = {
        // Basic report info provided by finder
        finderName: reportData.finderName,
        finderEmail: reportData.finderEmail,
        finderPhone: reportData.finderPhone || '',
        locationFound: reportData.locationFound,
        foundDate: reportData.foundDate,
        message: reportData.message || '',
        
        // New location and photo fields
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        photos: reportData.photos || [],
        
        // Code-related information
        code: reportData.code,
        codeId: reportData.code, // Use the code as the ID for easy lookup
        batchId: codeData.batchId || null,
        
        // Status information
        status: 'pending', // Initial status
        reportedAt: Timestamp.now(),
        ownerNotified: false,
        ownerContactedFinder: false,
        resolvedAt: null,
        
        // Additional metadata
        productType: codeData.productType || null,
        
        // Browser info for security
        userAgent: navigator.userAgent,
        // We don't collect IP here for privacy reasons
      };
      
      console.log('Prepared report data:', report);
      
      try {
        // Add the report to Firestore
        const reportRef = await addDoc(collection(db, 'foundReports'), report);
        console.log('Report created with ID:', reportRef.id);
        
        // Try to update the code's last report info, but don't fail if this doesn't work
        try {
          await updateDoc(codeRef, {
            lastReportedAt: Timestamp.now(),
            lastReportId: reportRef.id,
            reportCount: (codeData.reportCount || 0) + 1
          });
          console.log('Code document updated with report information');
        } catch (updateError) {
          // Just log the error but don't fail the overall operation
          console.warn('Could not update code with report info:', updateError);
          console.log('Continuing without updating code document');
        }
        
        return reportRef.id;
      } catch (firestoreError: any) {
        console.error('Firestore error while creating report:', firestoreError);
        const errorDetails = firestoreError.code 
          ? `${firestoreError.code}: ${firestoreError.message}` 
          : firestoreError.message;
        throw new Error(`Failed to submit report: ${errorDetails}`);
      }
    } catch (error: any) {
      console.error('Error submitting report:', error);
      throw error;
    }
  }
  
  /**
   * Check if a report already exists for this code
   * @param code The code to check
   * @returns Whether a report exists and its status
   */
  static async checkExistingReport(code: string): Promise<{ exists: boolean; status?: string; reportedAt?: Date }> {
    try {
      console.log('Checking for existing reports for code:', code);
      const sanitizedCode = code.trim().toUpperCase();
      
      // Query for reports with this code
      const reportsRef = collection(db, 'foundReports');
      const reportsQuery = query(
        reportsRef,
        where('code', '==', sanitizedCode),
        limit(1)
      );
      
      try {
        const snapshot = await getDocs(reportsQuery);
        
        if (snapshot.empty) {
          console.log('No existing reports found');
          return { exists: false };
        }
        
        // Return info about the most recent report
        const reportData = snapshot.docs[0].data();
        console.log('Found existing report:', reportData);
        
        return { 
          exists: true, 
          status: reportData.status,
          reportedAt: reportData.reportedAt?.toDate() 
        };
      } catch (queryError: any) {
        console.warn('Error querying for reports:', queryError);
        // Assume no reports if we can't query due to permissions
        return { exists: false };
      }
    } catch (error) {
      console.error('Error checking existing report:', error);
      return { exists: false };
    }
  }
}