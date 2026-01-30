import React, { useState, useRef, useEffect, InputHTMLAttributes } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Music } from 'lucide-react';

interface TrackUploadResponse {
  status: string | number;
  message: string;
  filename: string;
}

interface TrackUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  apiKey?: string;
  apiEndpoint?: string;
  idValue?: string;
  nounceValue?: string;
  noValue?: string;
  value?: string | null; // 👈 NEW: existing uploaded track URL
  onChange?: (fileUrl: string | null, response?: TrackUploadResponse) => void;
  onError?: (error: Error) => void;
  onSuccess?: (fileUrl: string, response: TrackUploadResponse) => void;
}

const TrackUpload: React.FC<TrackUploadProps> = ({
  idValue = '1',
  nounceValue = '12345',
  noValue = '1',
  apiKey = '7c6a180b36896a0a8c02787eeafb0e4c',
  apiEndpoint = 'https://singnify.com/api/v2/php/upload-track.php',
  value,
  onChange,
  onError,
  onSuccess,
  ...props
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null); // 👈 load from value if provided
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (value && value !== previewUrl) {
      setPreviewUrl(value);
    }
  }, [value]);

  useEffect(() => {
    if (previewUrl && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {}); // autoplay with fallback
    }
  }, [previewUrl]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('id', idValue);
    formData.append('nounce', nounceValue);
    formData.append('no', noValue);
    formData.append('file', file);
    formData.append('file_data', '');

    try {
      const res = await fetch(`${apiEndpoint}?API_KEY=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const result: TrackUploadResponse = await res.json();

      if (result.status === '200' || result.status === 200) {
        const uploadedUrl = `/uploads/${result.filename}`;
        setPreviewUrl(uploadedUrl);

        if (onChange) onChange(uploadedUrl, result);
        if (onSuccess) onSuccess(uploadedUrl, result);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      if (onError) onError(e);
    } finally {
      setUploading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 1500);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      uploadFile(file);
    }
  };

  const clearFile = () => {
    setPreviewUrl(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) onChange(null);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 space-y-4">
      <input
        type="file"
        accept="audio/mp3"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        {...props}
      />

      <div
        className="flex flex-col items-center justify-center border border-dashed border-gray-500 p-6 rounded cursor-pointer hover:border-blue-400"
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mb-2" />
            <p className="text-sm text-gray-300">Uploading... {progress}%</p>
          </div>
        ) : previewUrl ? (
          <div className="w-full text-center space-y-2">
            <audio controls autoPlay ref={audioRef} className="w-full rounded">
              <source src={previewUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove Track
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 text-gray-400">
            <Music className="w-10 h-10" />
            <p className="text-sm">Click to upload or drag & drop an MP3 file</p>
          </div>
        )}
      </div>

      {success && (
        <p className="flex items-center text-green-400 text-sm">
          <CheckCircle className="w-4 h-4 mr-2" /> Upload successful!
        </p>
      )}

      {error && (
        <p className="flex items-center text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" /> {error}
        </p>
      )}
    </div>
  );
};

export default TrackUpload;
