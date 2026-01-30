// app/artist/takedown/page.tsx
import { Trash2, AlertTriangle, FileText } from 'lucide-react';

export default function TakedownRequest() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Takedown Request</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex items-center mb-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
          <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3" />
          <div>
            <h3 className="font-medium text-yellow-200">Important Notice</h3>
            <p className="text-sm text-yellow-100">
              Please only submit takedown requests for content that infringes on your copyrights. 
              Misuse of this system may result in account termination.
            </p>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Submit Takedown Request</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Infringing URL</label>
            <input 
              type="url" 
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
              placeholder="https://example.com/infringing-content"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required>
              <option value="">Select a platform</option>
              <option>YouTube</option>
              <option>SoundCloud</option>
              <option>Facebook</option>
              <option>Instagram</option>
              <option>TikTok</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Original Content</label>
          <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required>
            <option value="">Select your original content</option>
            <option>Summer Vibes</option>
            <option>Midnight Dreams</option>
            <option>City Lights</option>
            <option>Ocean Breeze</option>
            <option>Other</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Description of Infringement</label>
          <textarea 
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
            rows={4}
            placeholder="Please describe how this content infringes on your copyright..."
            required
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Your Contact Information</label>
          <input 
            type="text" 
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
            placeholder="Full name, email, phone number"
            required
          />
        </div>
        
        <div className="flex items-center mb-6">
          <input 
            id="declaration"
            type="checkbox" 
            className="h-4 w-4 text-indigo-600 border-gray-600 rounded bg-gray-700 focus:ring-indigo-500"
            required
          />
          <label htmlFor="declaration" className="ml-2 text-sm text-gray-300">
            I declare, under penalty of perjury, that I am the copyright owner or authorized to act on behalf of the owner.
          </label>
        </div>
        
        <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center">
          <Trash2 className="h-5 w-5 mr-2" />
          Submit Takedown Request
        </button>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Recent Takedown Requests</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Infringing URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Jun 12, 2023</td>
                <td className="px-6 py-4">youtube.com/watch?v=abc123</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-green-800 text-green-200 rounded-full">Completed</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                    <FileText className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">May 28, 2023</td>
                <td className="px-6 py-4">soundcloud.com/user/infringing-track</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-yellow-800 text-yellow-200 rounded-full">In Review</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                    <FileText className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">May 15, 2023</td>
                <td className="px-6 py-4">tiktok.com/@user/video/123</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-blue-800 text-blue-200 rounded-full">Processing</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                    <FileText className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}