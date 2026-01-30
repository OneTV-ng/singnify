import React, {
  useState,
  useRef,
  useEffect,
  InputHTMLAttributes,
  ChangeEvent,
  FC,
} from 'react';

interface TrackUploadResponse {
  status: string | number;
  message: string;
  link: string;
  duration?: string;
}

type TrackUploadProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'value'
> & {
  apiKey?: string;
  apiEndpoint?: string;
  idValue?: string;
  nounceValue?: string;
  noValue?: string;
  value?: string | null;
  autoPlay?: boolean;
  onChange?: (fileUrl: string | null, response?: TrackUploadResponse) => void;
  onError?: (error: Error) => void;
  onSuccess?: (fileUrl: string, response: TrackUploadResponse) => void;
  onProgress?: (progress: number) => void;
  onDurationChange?: (duration: string) => void;
};

const TrackUploadComponent: FC<TrackUploadProps> = ({
  idValue = '1',
  nounceValue = '12345',
  noValue = '1',
  apiKey = '7c6a180b36896a0a8c02787eeafb0e4c',
  apiEndpoint = 'https://singnify.com/api/v2/php/upload-track.php',
  value,
  autoPlay = false,
  onChange,
  onError,
  onSuccess,
  onProgress,
  onDurationChange,
  ...props
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [duration, setDuration] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (value && value !== previewUrl) {
      setPreviewUrl(value);
    }
  }, [value, previewUrl]);

  useEffect(() => {
    if (previewUrl && audioRef.current && autoPlay) {
      audioRef.current.load();
      audioRef.current
        .play()
        .catch(() => {
          // autoplay may be blocked, no-op fallback
        });
    }
  }, [previewUrl, autoPlay]);

  const getDuration = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                const rawDuration = ""+Math.floor(duration) ;

        
        URL.revokeObjectURL(objectUrl);
       // resolve(formattedDuration);
       resolve(rawDuration);
      });
      
      audio.addEventListener('error', (e) => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Could not load audio file'));
      });
      
      audio.src = objectUrl;
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const uploadFile = async (file: File): Promise<void> => {
    setUploading(true);
    setError(null);
    setSuccess(false);
    setDuration(null);
    setProgress(0);

    abortControllerRef.current = new AbortController();

    let fileDuration: string | null = null;
    try {
      fileDuration = await getDuration(file);
      setDuration(fileDuration);
      onDurationChange?.(fileDuration);
    } catch (err) {
      console.warn('Could not extract duration from file:', err);
    }

    try {
      const base64Data = await fileToBase64(file);
      
      const formData = new FormData();
      formData.append('id', idValue);
      formData.append('nounce', nounceValue);
      formData.append('no', noValue);
      formData.append('file', file.name);
      formData.append('file_data', `data:@file/octet-stream;base64,${base64Data}`);

      const url = `${apiEndpoint}${apiEndpoint.includes('?') ? '&' : '?'}API_KEY=${apiKey}`;
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
          onProgress?.(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText) as TrackUploadResponse;
            
            if (result.status === '200' || result.status === 200) {
              const uploadedUrl = result.link;
              setPreviewUrl(uploadedUrl);
              setSuccess(true);
              setProgress(100);
              onProgress?.(100);

              const responseWithDuration = {
                ...result,
                duration: fileDuration || undefined
              };

              onChange?.(uploadedUrl, responseWithDuration);
              onSuccess?.(uploadedUrl, responseWithDuration);
            } else {
              const errorMessage = result.message || `Upload failed with status: ${result.status}`;
              throw new Error(errorMessage);
            }
          } catch (parseError) {
            const error = parseError instanceof Error ? parseError : new Error('Failed to parse server response');
            setError(error.message);
            onError?.(error);
          }
        } else {
          throw new Error(`HTTP error! status: ${xhr.status}`);
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Network error occurred during upload');
      });

      xhr.addEventListener('abort', () => {
        setError('Upload cancelled');
      });

      xhr.open('POST', url);
      xhr.send(formData);

      abortControllerRef.current.signal.addEventListener('abort', () => {
        xhr.abort();
      });

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred during upload');
      setError(error.message);
      onError?.(error);
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 
        'audio/webm', 'audio/aac', 'audio/flac'
      ];
      
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(mp3|wav|ogg|m4a|aac|flac|webm)$/)) {
        const error = new Error('Please upload an audio file (MP3, WAV, OGG, M4A, AAC, FLAC, or WEBM)');
        setError(error.message);
        onError?.(error);
        return;
      }

      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        const error = new Error('File size too large. Maximum size is 50MB');
        setError(error.message);
        onError?.(error);
        return;
      }

      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
      uploadFile(file);
    }
  };

  const cancelUpload = (): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setUploading(false);
      setProgress(0);
    }
  };

  const clearFile = (): void => {
    if (uploading) {
      cancelUpload();
    }

    setPreviewUrl(null);
    setError(null);
    setSuccess(false);
    setDuration(null);
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    onChange?.(null);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 space-y-4">
      <input
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.webm"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        {...props}
      />

      <div
        className="flex flex-col items-center justify-center border border-dashed border-gray-500 p-6 rounded cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="text-center w-full space-y-3">
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-gray-300">
                Uploading... {progress}%
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelUpload();
                }}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-400 rounded transition-colors"
              >
                Cancel
              </button>
            </div>

            {duration && (
              <p className="text-xs text-gray-400">Duration: {duration}</p>
            )}
          </div>
        ) : previewUrl ? (
          <div className="w-full text-center space-y-2">
            <audio controls ref={audioRef} className="w-full rounded">
              <source src={previewUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            {duration && (
              <p className="text-xs text-gray-400">Duration: {duration}</p>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Remove Track
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-sm">Click to upload or drag & drop an audio file</p>
            <p className="text-xs">(MP3, WAV, OGG, M4A, AAC, FLAC, WEBM)</p>
          </div>
        )}
      </div>

      {success && (
        <div className="space-y-1">
          <p className="flex items-center text-green-400 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Upload successful!
          </p>
          {duration && (
            <p className="text-xs text-gray-400 ml-6">Track duration: {duration}</p>
          )}
        </div>
      )}

      {error && (
        <p className="flex items-center text-red-400 text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default TrackUploadComponent;