// app/artist/payment/page.tsx
import { CreditCard, DollarSign, Download } from 'lucide-react';
import { Payout } from '@/types';

const payoutHistory: Payout[] = [
  {
    date: 'Jun 15, 2023',
    description: 'Monthly Royalties Payout',
    amount: '+$1,495',
    status: 'Completed'
  },
  {
    date: 'May 15, 2023',
    description: 'Monthly Royalties Payout',
    amount: '+$1,245',
    status: 'Completed'
  },
  {
    date: 'Apr 15, 2023',
    description: 'Monthly Royalties Payout',
    amount: '+$982',
    status: 'Completed'
  },
  {
    date: 'Mar 15, 2023',
    description: 'Monthly Royalties Payout',
    amount: '+$1,124',
    status: 'Completed'
  }
];

export default function Payment() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <DollarSign className="h-6 w-6 text-green-400 mr-2" />
            <h3 className="text-lg font-medium">Available Balance</h3>
          </div>
          <p className="text-3xl font-bold">$2,458</p>
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm">
            Request Payout
          </button>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <CreditCard className="h-6 w-6 text-blue-400 mr-2" />
            <h3 className="text-lg font-medium">Next Payout</h3>
          </div>
          <p className="text-3xl font-bold">$1,842</p>
          <p className="text-sm text-gray-400 mt-2">Scheduled for July 15, 2023</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <DollarSign className="h-6 w-6 text-yellow-400 mr-2" />
            <h3 className="text-lg font-medium">Last Payout</h3>
          </div>
          <p className="text-3xl font-bold">$1,495</p>
          <p className="text-sm text-gray-400 mt-2">Processed on June 15, 2023</p>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payout History</h2>
          <button className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-md">
            <Download className="h-4 w-4 mr-1" />
            Export Statements
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payoutHistory.map((payout, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{payout.date}</td>
                  <td className="px-6 py-4">{payout.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-400">{payout.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-green-800 text-green-200 rounded-full">
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Payout Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Payout Method</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
              <option>Bank Transfer (ACH)</option>
              <option>PayPal</option>
              <option>Wire Transfer</option>
              <option>Check</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payout Frequency</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
              <option>Monthly (15th of each month)</option>
              <option>Quarterly</option>
              <option>On Request</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Minimum Payout Threshold</label>
          <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
            <option>$25</option>
            <option>$50</option>
            <option>$100 (default)</option>
            <option>$250</option>
            <option>$500</option>
          </select>
        </div>
        <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
          Save Settings
        </button>
      </div>
    </div>
  );
}