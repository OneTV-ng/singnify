// components/CopyButton.tsx
'use client';

import { Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-md text-sm flex items-center"
    >
      {copied ? (
        'Copied!'
      ) : (
        <>
          <Copy className="h-4 w-4 mr-1" />
          Copy
        </>
      )}
    </button>
  );
}