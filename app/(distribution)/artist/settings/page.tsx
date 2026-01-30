// app/artist/settings/page.js
export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Artist Name</label>
            <input 
              type="text" 
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
              defaultValue="Your Artist Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
              defaultValue="artist@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea 
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
              defaultValue="A short bio about yourself and your music..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Profile Image</label>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-xl">AN</span>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
                Upload New
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Change Password</h3>
              <p className="text-sm text-gray-400">Last changed 3 months ago</p>
            </div>
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-400">Delete Account</h3>
              <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}