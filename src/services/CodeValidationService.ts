// src/services/CodeValidationService.ts
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Code validation result interface
 */
export interface CodeValidationResult {
  valid: boolean;
  code: string;
  message: string;
  codeData?: {
    batchId: string;
    status: string;
    createdAt: any;
    assignedAt?: any;
    assignedTo?: string;
    productType?: string;
    expirationDate?: any;
  };
  batchData?: {
    name?: string;
    description?: string;
    prefix?: string;
    productType?: string;
  };
}

/**
 * Service for validating QR codes
 */
export class CodeValidationService {
  /**
   * Validate a code against Firestore
   * @param code The code to validate
   * @returns Validation result
   */
  static async validateCode(code: string): Promise<CodeValidationResult> {
    try {
      // Sanitize the code and add diagnostic logging
      const sanitizedCode = code.trim().toUpperCase();
      console.log('Validating code:', sanitizedCode);
      
      // Use getDoc() for a one-time read operation
      try {
        console.log('Getting document:', `stickerCodes/${sanitizedCode}`);
        const codeRef = doc(db, 'stickerCodes', sanitizedCode);
        const codeDoc = await getDoc(codeRef);
        
        console.log('Document exists:', codeDoc.exists());
        
        if (!codeDoc.exists()) {
          console.log('Document not found');
          return {
            valid: false,
            code: sanitizedCode,
            message: 'Code not found. Please check the code and try again.'
          };
        }
        
        // Get code data
        const codeData = codeDoc.data();
        console.log('Retrieved code data:', codeData);
        
        // Check if code is disabled
        if (codeData.status === 'disabled') {
          console.log('Code is disabled');
          return {
            valid: false,
            code: sanitizedCode,
            message: 'This code has been disabled.',
            codeData: codeData as any
          };
        }
        
        // Get batch data using another one-time read operation
        let batchData = {};
        if (codeData.batchId) {
          console.log('Getting batch data for:', codeData.batchId);
          const batchRef = doc(db, 'stickerBatches', codeData.batchId);
          const batchDoc = await getDoc(batchRef);
          
          if (batchDoc.exists()) {
            batchData = batchDoc.data();
            console.log('Retrieved batch data:', batchData);
          } else {
            console.log('Batch document not found');
          }
        }
        
        return {
          valid: true,
          code: sanitizedCode,
          message: 'Code validated successfully.',
          codeData: codeData as any,
          batchData: batchData as any
        };
      } catch (docError: any) {
        console.error('Error during document retrieval:', docError);
        console.error('Error details:', docError.code, docError.message);
        throw docError;
      }
    } catch (error: any) {
      console.error('Error validating code:', error);
      // Provide a more detailed error message for debugging
      const errorDetails = error.code ? `${error.code}: ${error.message}` : error.message;
      return {
        valid: false,
        code,
        message: `Error validating code: ${errorDetails}`
      };
    }
  }
  
  /**
   * Check if a code has already been reported as found
   * @param code The code to check
   * @returns Whether the code has already been reported
   */
  static async hasExistingReports(code: string): Promise<boolean> {
    try {
      console.log('Checking for existing reports for code:', code);
      
      // Use a one-time query with getDocs
      const reportsRef = collection(db, 'foundReports');
      const reportsQuery = query(
        reportsRef,
        where('code', '==', code.trim().toUpperCase()),
        limit(1)
      );
      
      const querySnapshot = await getDocs(reportsQuery);
      const hasReports = !querySnapshot.empty;
      
      console.log('Found existing reports:', hasReports);
      return hasReports;
    } catch (error) {
      console.error('Error checking for existing reports:', error);
      // Default to false in case of error to allow report submission
      return false;
    }
  }
  
  /**
   * Get code details by ID
   * @param code The code ID
   * @returns Code details or null if not found
   */
  static async getCodeDetails(code: string): Promise<any | null> {
    try {
      console.log('Getting details for code:', code);
      const sanitizedCode = code.trim().toUpperCase();
      
      const codeRef = doc(db, 'stickerCodes', sanitizedCode);
      const codeDoc = await getDoc(codeRef);
      
      if (!codeDoc.exists()) {
        console.log('Code not found');
        return null;
      }
      
      const codeData = codeDoc.data();
      console.log('Retrieved code details:', codeData);
      
      return {
        id: codeDoc.id,
        ...codeData
      };
    } catch (error) {
      console.error('Error getting code details:', error);
      return null;
    }
  }
}