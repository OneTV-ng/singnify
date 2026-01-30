// components/SocialConnectButton.tsx
'use client';

import { SocialAccount } from '@/types';

interface SocialConnectButtonProps {
  account: SocialAccount;
}

export default function SocialConnectButton({ account }: SocialConnectButtonProps) {
  const IconComponent = account.icon;

  const handleConnect = () => {
    // Implement connection logic here
    console.log(`Connecting to ${account.platform}`);
  };

  const handleDisconnect = () => {
    // Implement disconnection logic here
    console.log(`Disconnecting from ${account.platform}`);
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <IconComponent className={`h-6 w-6 ${account.color} mr-3`} />
        <div>
          <h3 className="font-medium">{account.platform}</h3>
          <p className="text-sm text-gray-400">
            {account.connected ? 'Connected' : 'Not Connected'}
          </p>
        </div>
      </div>
      {account.connected ? (
        <button 
          onClick={handleDisconnect}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Disconnect
        </button>
      ) : (
        <button 
          onClick={handleConnect}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-md text-sm"
        >
          Connect
        </button>
      )}
    </div>
  );
}