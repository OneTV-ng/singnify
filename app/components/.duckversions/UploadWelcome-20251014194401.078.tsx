import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const UploadWelcome: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const requirements = [
    'Square album cover (JPG/PNG/TIFF) between 3000 - 4000 pixels',
    'High-quality audio: MP3, WAV, or FLAC; minimum 90 seconds; 44.1kHz 16-bit stereo',
    'Provide Track Name, Artist Name, Genre, and Info About the Song',
    'Upload perfect square artwork (3000x3000 pixels)',
    'Enter Spotify URL (optional)',
    'Enter iTunes URL (optional)',
    'Select the release date for your music',
    'Paste or upload your lyrics (optional)',
    'No social media logos, brand logos, or unrelated text on cover art',
    'Audio files must be 16-bit, 44.1kHz MP3s of good quality',
    'By uploading, you agree to a minimum 6-month availability or $10 takedown fee',
    'Provide a one-minute promo video (H.264 + AAC) for social media distribution',
    'Include a 40-word description of your song for promotion',
  ];

  const handleCheckboxChange = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const allChecked = requirements.every((_, i) => checkedItems[i]);

  const handleAgree = () => {
    if (!agreed) return;
    if (!allChecked) {
      alert('Please check all requirements before proceeding.');
      return;
    }
    setOpen(false);
  };

  const handleDisagree = () => {
    router.push('/home');
  };

  const getHelpLink = (req: string) => {
    const topic = req
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `/help/${topic}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">
          Welcome to Singnify — Uphold Copyright Integrity
        </h2>

        <p className="text-sm text-gray-300 mb-4">
          <strong>Thank you for choosing Singnify</strong> as your trusted partner in music distribution and promotion! 🎶<br />
          We’re committed to supporting you every step of the way — from upload to streaming, and beyond. Before continuing, please take a moment to review these important copyright and upload guidelines.
        </p>

        <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
          <li>Upload only authorized content that you own or are licensed to share.</li>
          <li>Copyright violations can lead to account termination, legal consequences, and loss of royalties.</li>
          <li>Protect your creations by registering your songs with copyright authorities.</li>
        </ul>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 accent-green-500"
          />
          <label htmlFor="agree" className="text-sm text-gray-300">
            I have read and agree to uphold copyright integrity and proceed.
          </label>
        </div>

        {agreed && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 text-center">
              Upload Requirements Checklist
            </h3>
            <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {requirements.map((req, index) => (
                <li key={index} className={`flex flex-col md:flex-row md:items-center justify-between p-2 rounded-lg ${
                  checkedItems[index] ? 'bg-gray-800' : 'bg-gray-800/40'
                }`}>
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={!!checkedItems[index]}
                      onChange={() => handleCheckboxChange(index)}
                      className="mt-1 accent-green-500"
                    />
                    <span className="text-sm text-gray-300">{req}</span>
                  </div>
                  <a
                    href={getHelpLink(req)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline mt-1 md:mt-0 md:ml-4"
                  >
                    Learn more
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleAgree}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
              allChecked && agreed
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
            disabled={!allChecked || !agreed}
          >
            Continue
          </button>
          <button
            onClick={handleDisagree}
            className="px-6 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700"
          >
            I Do Not Agree
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          We’re here to help — contact <a href="/help/support" className="text-blue-400 hover:underline">Singnify Support</a> anytime you need assistance. 💚
        </p>
      </div>
    </div>
  );
};

export default UploadWelcome;
