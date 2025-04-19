import { useAuth } from '../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.user_metadata?.first_name || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Properties Card */}
        <div className="relative group bg-white px-6 py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Properties</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Package Claims Card */}
        <div className="relative group bg-white px-6 py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Pending Claims</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Updates Card */}
        <div className="relative group bg-white px-6 py-5 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Recent Updates</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="px-6 py-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <p className="mt-4 text-sm text-gray-500">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}; 