// src/services/CodeValidationService.ts
import { doc, getDoc } from 'firebase/firestore';
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
      // Sanitize the code
      const sanitizedCode = code.trim().toUpperCase();
      
      // Check if the code exists in Firestore
      const codeRef = doc(db, 'stickerCodes', sanitizedCode);
      const codeDoc = await getDoc(codeRef);
      
      if (!codeDoc.exists()) {
        return {
          valid: false,
          code: sanitizedCode,
          message: 'Code not found. Please check the code and try again.'
        };
      }
      
      // Get code data
      const codeData = codeDoc.data();
      
      // Check if code is disabled
      if (codeData.status === 'disabled') {
        return {
          valid: false,
          code: sanitizedCode,
          message: 'This code has been disabled.',
          codeData: codeData as any
        };
      }
      
      // Get batch data for additional context
      let batchData = {};
      if (codeData.batchId) {
        const batchRef = doc(db, 'stickerBatches', codeData.batchId);
        const batchDoc = await getDoc(batchRef);
        
        if (batchDoc.exists()) {
          batchData = batchDoc.data();
        }
      }
      
      return {
        valid: true,
        code: sanitizedCode,
        message: 'Code validated successfully.',
        codeData: codeData as any,
        batchData: batchData as any
      };
    } catch (error: any) {
      console.error('Error validating code:', error);
      return {
        valid: false,
        code,
        message: `Error validating code: ${error.message}`
      };
    }
  }
  
  /**
   * Check if a code has already been reported as found
   * @param code The code to check
   * @returns Whether the code has already been reported
   */
  static async hasExistingReports(code: string): Promise<boolean> {
    // This would query a 'foundReports' collection or similar
    // For now, let's keep it simple and just return false
    return false;
  }
}