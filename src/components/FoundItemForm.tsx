// src/components/FoundItemForm.tsx
import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

interface FoundItemFormProps {
  code: string;
  onSubmit: (data: FoundItemData) => Promise<void>;
  isLoading?: boolean;
}

export interface FoundItemData {
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

const FoundItemForm: React.FC<FoundItemFormProps> = ({ 
  code, 
  onSubmit, 
  isLoading = false 
}) => {
  // Initialize form state
  const [formData, setFormData] = useState<Omit<FoundItemData, 'code'>>({
    finderName: '',
    finderEmail: '',
    finderPhone: '',
    locationFound: '',
    foundDate: new Date().toISOString().split('T')[0], // Default to today
    message: '',
    latitude: undefined,
    longitude: undefined,
    photos: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'getting' | 'success' | 'error'>('idle');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus('getting');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLocationStatus('success');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('error');
        }
      );
    } else {
      setLocationStatus('error');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPhotoFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.finderName.trim()) {
      newErrors.finderName = 'First name is required';
    }
    
    if (!formData.finderEmail.trim()) {
      newErrors.finderEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.finderEmail)) {
      newErrors.finderEmail = 'Please enter a valid email address';
    }
    
    if (!formData.locationFound.trim()) {
      newErrors.locationFound = 'Location is required';
    }
    
    if (!formData.foundDate) {
      newErrors.foundDate = 'Date found is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (photoFiles.length === 0) return [];

    setUploadStatus('uploading');
    const photoUrls: string[] = [];

    try {
      for (const file of photoFiles) {
        const fileRef = ref(storage, `found-items/${code}/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        photoUrls.push(downloadUrl);
      }
      setUploadStatus('success');
      return photoUrls;
    } catch (error) {
      console.error('Error uploading photos:', error);
      setUploadStatus('error');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      // Upload photos first if any exist
      let photoUrls: string[] = [];
      if (photoFiles.length > 0) {
        photoUrls = await uploadPhotos();
      }

      // Submit the form data with the code and photo URLs
      await onSubmit({
        ...formData,
        photos: photoUrls,
        code
      });
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setSubmissionError(err.message || 'Failed to submit the form. Please try again.');
    }
  };

  return (
    <div className="found-item-form-container">
      <div className="form-header">
        <h2>Report Found Item</h2>
        <p className="code-display">Code: <span>{code}</span></p>
      </div>
      
      {submissionError && (
        <div className="error-banner">
          {submissionError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="found-item-form">
        <div className="form-section">
          <h3>Your Information</h3>
          <p className="section-help">We'll share this with the owner so they can contact you.</p>
          
          <div className="app-download-promo">
            <h4>Privacy-Conscious?</h4>
            <p>Download our app to use our secure in-app messaging system instead of sharing your contact details directly.</p>
            <a href="https://www.iffoundlost.com/app" target="_blank" rel="noopener noreferrer" className="secondary-button">
              Download Our App
            </a>
          </div>
          
          <div className="form-group">
            <label htmlFor="finderName">Your First Name *</label>
            <input
              id="finderName"
              name="finderName"
              type="text"
              value={formData.finderName}
              onChange={handleChange}
              disabled={isLoading}
              required
              placeholder="First name only is fine"
            />
            <span className="field-help">We'll share this with the item owner so they can address you properly.</span>
            {errors.finderName && <span className="error-message">{errors.finderName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="finderEmail">Email Address *</label>
            <input
              id="finderEmail"
              name="finderEmail"
              type="email"
              value={formData.finderEmail}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <span className="field-help">This allows the owner to contact you about their item. Only shared with verified owners.</span>
            {errors.finderEmail && <span className="error-message">{errors.finderEmail}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="finderPhone">Phone Number (Optional)</label>
            <input
              id="finderPhone"
              name="finderPhone"
              type="tel"
              value={formData.finderPhone}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Optional"
            />
            <span className="field-help">Alternative contact method if email isn't working. Only provided to the owner if you choose to share it.</span>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Item Details</h3>
          
          <div className="form-group">
            <label htmlFor="locationFound">Where did you find it? *</label>
            <input
              id="locationFound"
              name="locationFound"
              type="text"
              value={formData.locationFound}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="e.g., Central Park, NYC"
              required
            />
            {errors.locationFound && <span className="error-message">{errors.locationFound}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="foundDate">When did you find it? *</label>
            <input
              id="foundDate"
              name="foundDate"
              type="date"
              value={formData.foundDate}
              onChange={handleChange}
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]} // Cannot be in the future
              required
            />
            {errors.foundDate && <span className="error-message">{errors.foundDate}</span>}
          </div>
          
          <div className="form-group">
            <label>Current Location</label>
            <div className="location-status">
              {locationStatus === 'getting' && <span>Getting your current location...</span>}
              {locationStatus === 'success' && (
                <span className="success-message">
                  ✓ Location captured successfully. This helps the owner find their item.
                </span>
              )}
              {locationStatus === 'error' && (
                <span className="warning-message">
                  Could not get your current location. The owner will still see your written description.
                </span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>Photos of the Item (Optional)</label>
            <p className="field-help">
              Photos help the owner identify their item and see its current location.
              Max 3 photos, 10MB each.
            </p>
            
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={isLoading || photoFiles.length >= 3}
              multiple={photoFiles.length < 3}
              className="file-input"
            />
            
            {photoFiles.length > 0 && (
              <div className="photo-previews">
                {photoFiles.map((file, index) => (
                  <div key={index} className="photo-preview">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Preview ${index + 1}`} 
                    />
                    <button 
                      type="button" 
                      onClick={() => removePhoto(index)}
                      className="remove-photo-btn"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {uploadStatus === 'uploading' && (
              <div className="upload-status">Uploading photos...</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Additional information (Optional)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={isLoading}
              rows={3}
              placeholder="Add any details that might help the owner identify their item"
            />
          </div>
        </div>
        
        <div className="privacy-notice">
          <p>Your contact information will only be shared with the verified owner of this item. We prioritize your privacy.</p>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading || uploadStatus === 'uploading'} 
            className="primary-button"
          >
            {isLoading || uploadStatus === 'uploading' ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoundItemForm;