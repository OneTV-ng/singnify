// app/artist/referrals/page.tsx
import { Copy, Users, Gift } from 'lucide-react';
import { Referral } from '@/types';
import CopyButton from '@/components/CopyButton';

const referralsData: Referral[] = [
  {
    artist: 'DJ Soundwave',
    date: 'Jun 12, 2023',
    status: 'Completed',
    earnings: '$5.00'
  },
  {
    artist: 'Melody Maker',
    date: 'May 28, 2023',
    status: 'Completed',
    earnings: '$5.00'
  },
  {
    artist: 'Beat Creator',
    date: 'May 15, 2023',
    status: 'Pending',
    earnings: '-$'
  }
];

export default function Referrals() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Referral Program</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-indigo-400 mr-2" />
            <h3 className="text-lg font-medium">Total Referrals</h3>
          </div>
          <p className="text-3xl font-bold">24</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Gift className="h-6 w-6 text-green-400 mr-2" />
            <h3 className="text-lg font-medium">Earnings from Referrals</h3>
          </div>
          <p className="text-3xl font-bold">$120</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Copy className="h-6 w-6 text-yellow-400 mr-2" />
            <h3 className="text-lg font-medium">Your Referral Code</h3>
          </div>
          <div className="flex items-center mt-2">
            <code className="bg-gray-700 px-3 py-2 rounded-md text-sm font-mono">ARTIST-8XZ42</code>
            <CopyButton text="ARTIST-8XZ42" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">How It Works</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-indigo-600 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</div>
            <p>Share your unique referral code with other artists</p>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-600 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</div>
            <p>They get 10% off their first distribution</p>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-600 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</div>
            <p>You earn $5 for every artist who signs up using your code</p>
          </li>
        </ul>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Referral History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {referralsData.map((referral, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{referral.artist}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{referral.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      referral.status === 'Completed' 
                        ? 'bg-green-800 text-green-200' 
                        : 'bg-yellow-800 text-yellow-200'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{referral.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}