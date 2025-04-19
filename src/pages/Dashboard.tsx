import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Stats */}
        <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Total Properties</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6">
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </dd>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-green-500 p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Monthly Revenue</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6">
              <p className="text-2xl font-semibold text-gray-900">$24,500</p>
            </dd>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-yellow-500 p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Total Tenants</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6">
              <p className="text-2xl font-semibold text-gray-900">25</p>
            </dd>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-red-500 p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Pending Maintenance</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6">
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </dd>
          </div>
        </dl>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
            <ul role="list" className="divide-y divide-gray-200">
              <li className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <span className="text-sm font-medium leading-none text-green-600">$</span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">Rent Payment Received</p>
                    <p className="truncate text-sm text-gray-500">123 Main St, Apt 4B</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                      <span className="text-sm font-medium leading-none text-red-600">!</span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">Maintenance Request</p>
                    <p className="truncate text-sm text-gray-500">456 Oak Ave, Unit 2C</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Properties Overview */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Properties Overview</h2>
            <Link to="/properties" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all properties
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Property Card */}
            <div className="relative rounded-lg bg-white shadow">
              <div className="h-48 rounded-t-lg bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">123 Main Street</h3>
                <p className="mt-1 text-sm text-gray-500">4 units • 3,500 sqft</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Occupancy</span>
                    <span className="font-medium text-gray-900">100%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add more property cards here */}
          </div>
        </div>
      </div>
    </div>
  );
}; 