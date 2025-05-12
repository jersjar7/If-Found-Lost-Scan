// src/components/QRScanner.tsx
import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

interface QRScannerProps {
  onCodeDetected: (code: string) => void;
  width?: string;
  height?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ 
  onCodeDetected, 
  width = '100%', 
  height = '300px' 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;

    const initializeScanner = async () => {
      try {
        // Check if camera is available
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          // Create scanner instance
          scanner = new Html5Qrcode('qr-reader');
          setScannerInitialized(true);
        } else {
          setHasCamera(false);
          setError("No camera devices found. Please enter the code manually.");
        }
      } catch (err) {
        console.error('Error initializing scanner:', err);
        setHasCamera(false);
        setError("Unable to access camera. Please enter the code manually.");
      }
    };

    initializeScanner();

    // Cleanup function
    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(err => console.error('Error stopping scanner:', err));
      }
    };
  }, []);

  const startScanner = async () => {
    const scanner = new Html5Qrcode('qr-reader');
    setIsScanning(true);
    setError(null);

    try {
      await scanner.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        // Success callback
        (decodedText) => {
          console.log('QR code detected:', decodedText);
          
          // Extract code if it's a URL
          let detectedCode = decodedText;
          try {
            if (decodedText.includes('/')) {
              const url = new URL(decodedText);
              const pathParts = url.pathname.split('/');
              const lastPart = pathParts[pathParts.length - 1];
              if (lastPart && lastPart.includes('-')) {
                detectedCode = lastPart;
              }
            }
          } catch (e) {
            // If not a valid URL, use the text as is
          }
          
          // Stop scanning after successful detection
          scanner.stop().then(() => {
            setIsScanning(false);
            onCodeDetected(detectedCode);
          }).catch(err => console.error('Error stopping scanner:', err));
        },
        // Error callback - we don't stop scanning on error, just log
        (errorMessage) => {
          console.log('QR scan error:', errorMessage);
        }
      );
    } catch (err: any) {
      console.error('Scanner start error:', err);
      setIsScanning(false);
      setError(`Failed to start scanner: ${err.message || 'Unknown error'}`);
    }
  };

  const stopScanner = async () => {
    const scanner = new Html5Qrcode('qr-reader');
    if (scanner && isScanning) {
      try {
        await scanner.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  if (!hasCamera) {
    return (
      <div className="no-camera-message">
        <p>{error || "No camera available. Please enter the code manually."}</p>
        <button
          onClick={() => navigate('/code')}
          className="primary-button"
        >
          Enter Code Manually
        </button>
      </div>
    );
  }

  return (
    <div className="qr-scanner-container">
      <div id="qr-reader" style={{ width, height }}></div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="scanner-controls">
        {!isScanning ? (
          <button
            onClick={startScanner}
            disabled={!scannerInitialized}
            className="primary-button"
          >
            {scannerInitialized ? 'Start Scanner' : 'Initializing...'}
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="secondary-button"
          >
            Stop Scanner
          </button>
        )}
      </div>
      
      <div className="scanner-instructions">
        <p>Position the QR code inside the scanning area</p>
      </div>
    </div>
  );
};

export default QRScanner;