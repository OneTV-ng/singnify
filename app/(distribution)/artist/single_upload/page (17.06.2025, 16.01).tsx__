"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud } from "lucide-react";

export default function DistributePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploadProgress(20);
    setTimeout(() => setUploadProgress(50), 1000);
    setTimeout(() => setUploadProgress(100), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div 
        className="text-center w-full bg-cover bg-center py-32" 
        style={{ backgroundImage: "url('/images/longroad.jpg')" }}
      >
        <h1 className="text-4xl font-bold">Your Journey to a Global Music Audience Starts Here</h1>
      </div>

      <Card className="w-full max-w-lg bg-zinc-900 p-6 mt-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-white">
            Upload Your Music
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <label className="flex flex-col items-center bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition">
            <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-300">Choose a file to upload</span>
            <Input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <p className="text-sm text-gray-300 mt-2">Selected file: {file.name}</p>
          )}
          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="w-full mt-4" />
          )}
          <Button
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 transition"
            onClick={handleUpload}
            disabled={!file}
          >
            Upload
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
