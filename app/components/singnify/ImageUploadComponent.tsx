'use client'
//@/app/components/singnify/ImageUploadComponent.tsx

import React, { useState, useRef, useCallback, useEffect, InputHTMLAttributes } from 'react';
import { Upload, X, FileImage, AlertCircle, CheckCircle } from 'lucide-react';

const PLATFORM_API_KEY = process.env.PLATFORM_API_KEY;

interface ImageUploadResponse {
  status: string | number;
  message: string;
  imageName: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type' | 'onError'> {
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  apiKey?: string;
  apiEndpoint?: string;
  value?: string | null;
  onChange?: (imageUrl: string | null, response?: ImageUploadResponse) => void;
  onError?: (error: Error) => void;
  onSuccess?: (imageUrl: string, response: ImageUploadResponse) => void;
  accept?: string;
  maxSize?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  showPreview?: boolean;
  showProgress?: boolean;
  allowDragDrop?: boolean;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
}

const ImageUploadComponent: React.FC<ImageUploadProps> = ({
  id,
  name = 'image',
  placeholder = 'Click to upload or drag and drop',
  className = '',
  apiKey = PLATFORM_API_KEY || '7c6a180b36896a0a8c02787eeafb0e4c', // Fallback to your key
  apiEndpoint = 'https://singnify.com/api/v2/php/upload-photo.php?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c',
  value,
  onChange,
  onError,
  onSuccess,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  minWidth = 100,
  maxWidth = 4000,
  minHeight = 100,
  maxHeight = 4000,
  showPreview = true,
  showProgress = true,
  allowDragDrop = true,
  disabled = false,
  required = false,
  multiple = false,
  ...props
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [hasExistingImage, setHasExistingImage] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Effect to handle value prop changes
  useEffect(() => {
    if (value && value.trim() !== '') {
      setPreview(value);
      setHasExistingImage(true);
      setError(null);
      setSuccess(false);
    } else {
      setPreview(null);
      setHasExistingImage(false);
    }
  }, [value]);

  // Validate image dimensions
  const validateImage = (file: File): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        
        if (width < minWidth || width > maxWidth) {
          reject(new Error(`Image width must be between ${minWidth}px and ${maxWidth}px. Current: ${width}px`));
          return;
        }
        
        if (height < minHeight || height > maxHeight) {
          reject(new Error(`Image height must be between ${minHeight}px and ${maxHeight}px. Current: ${height}px`));
          return;
        }
        
        resolve({ width, height });
      };
      
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload file to API
  const uploadFile = async (file: File): Promise<void> => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);
      setSuccess(false);
      setHasExistingImage(false);

      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File size too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      }

      // Validate image dimensions
      await validateImage(file);

      // Convert to base64
      const base64 = await fileToBase64(file);
      
      // Create preview
      if (showPreview) {
        setPreview(base64);
      }

      // Prepare form data - CHANGED: Add API key to form data instead of header
      const formData = new FormData();
      formData.append('image', base64);
      formData.append('api_key', apiKey || ''); // Add API key to form data

      // Setup abort controller for cancellation
      abortControllerRef.current = new AbortController();

      // Upload with progress tracking - CHANGED: Remove Authorization header
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        // Remove headers completely to avoid CORS issues
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      // Simulate progress for better UX (since fetch doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      const result: ImageUploadResponse = await response.json();
      clearInterval(progressInterval);
      setProgress(100);

      if (result.status === '200' || result.status === 200) {
        setSuccess(true);
        const imageUrl = result.imageName;
        
        // Call callbacks
        if (onChange) {
          onChange(imageUrl, result);
        }
        if (onSuccess) {
          onSuccess(imageUrl, result);
        }
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (err) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        setError('Upload cancelled');
      } else {
        setError(error.message);
        if (onError) {
          onError(error);
        }
      }
      setPreview(hasExistingImage ? (value || null) : null);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0]; // Take first file if multiple selected
    uploadFile(file);
  }, [maxSize, minWidth, maxWidth, minHeight, maxHeight, showPreview, apiEndpoint, apiKey, onChange, onSuccess, onError]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (allowDragDrop && !disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    if (!allowDragDrop || disabled) return;
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      const fileList = new DataTransfer();
      files.forEach(file => fileList.items.add(file));
      handleFileSelect(fileList.files);
    }
  };

  // Handle click to open file dialog
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Cancel upload
  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Clear selection
  const clearSelection = () => {
    setPreview(null);
    setError(null);
    setSuccess(false);
    setHasExistingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  // Remove existing image (for value prop)
  const removeExistingImage = () => {
    setPreview(null);
    setHasExistingImage(false);
    setError(null);
    setSuccess(false);
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        name={name}
        accept={accept}
        multiple={multiple}
        required={required}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${dragOver ? 'border-blue-400 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-400 bg-red-900/20' : ''}
          ${success ? 'border-green-400 bg-green-900/20' : ''}
          bg-gray-800
        `}
      >
        {/* Preview */}
        {showPreview && preview && (
          <div className="mb-4 relative">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
            />
            {!uploading && (
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  hasExistingImage ? removeExistingImage() : clearSelection();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title={hasExistingImage ? "Remove existing image" : "Clear selection"}
              >
                <X size={16} />
              </button>
            )}
            
            {/* Overlay text for existing images */}
            {hasExistingImage && !uploading && (
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Current Image
              </div>
            )}
          </div>
        )}

        {/* Upload content */}
        <div className="text-center">
          {uploading ? (
            <div className="space-y-3">
              <div className="animate-spin mx-auto w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
              <p className="text-sm text-gray-300">Uploading...</p>
              
              {/* Progress bar */}
              {showProgress && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              
              {/* Progress percentage */}
              <p className="text-xs text-gray-400">{Math.round(progress)}%</p>
              
              {/* Cancel button */}
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  cancelUpload();
                }}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {success ? (
                <CheckCircle className="mx-auto w-12 h-12 text-green-500" />
              ) : error ? (
                <AlertCircle className="mx-auto w-12 h-12 text-red-500" />
              ) : (
                <div className="flex justify-center">
                  {preview ? (
                    <FileImage className="w-12 h-12 text-gray-400" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-300">
                {success ? 'Upload successful!' : 
                 error ? error : 
                 preview && hasExistingImage ? 'Click to replace image or drag new file' :
                 preview ? 'Click to change selection or drag new file' : 
                 placeholder}
              </p>
              
              {!error && !success && (
                <p className="text-xs text-gray-400">
                  Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB • 
                  Resolution: {minWidth}x{minHeight} to {maxWidth}x{maxHeight}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <AlertCircle size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploadComponent;