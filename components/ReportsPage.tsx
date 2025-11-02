import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">View and generate analytical reports for your business.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Coming Soon!</h2>
        <p className="mt-2 text-gray-600">Detailed analytics and custom report generation features will be available here.</p>
        <p className="mt-1 text-sm text-gray-500">Stay tuned for updates!</p>
      </div>

      {/* Example section for potential future reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800">Campaign Performance</h3>
          <p className="text-sm text-gray-500 mt-2">Analyze the effectiveness of your marketing campaigns.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">View Report</button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800">Contact Engagement</h3>
          <p className="text-sm text-gray-500 mt-2">Understand how your contacts interact with your messages.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">View Report</button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800">User Activity</h3>
          <p className="text-sm text-gray-500 mt-2">Monitor agent and admin activity within the platform.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">View Report</button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;