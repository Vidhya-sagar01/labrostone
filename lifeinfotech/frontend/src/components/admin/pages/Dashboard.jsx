import React from 'react';

const Dashboard = () => {
  // Yeh sample data hai, baad mein hum ise Node.js API se connect karenge
  const stats = [
    { id: 1, name: 'Total Products', value: '120', icon: '📦', color: 'bg-blue-500' },
    { id: 2, name: 'Total Orders', value: '450', icon: '🛒', color: 'bg-green-500' },
    { id: 3, name: 'Total Users', value: '1,200', icon: '👥', color: 'bg-purple-500' },
    { id: 4, name: 'Revenue', value: '₹54,000', icon: '💰', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`${item.color} text-white p-3 rounded-lg text-2xl`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.name}</p>
              <h3 className="text-xl font-bold text-gray-800">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-700">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <tr>
                <td className="px-6 py-4 font-medium text-blue-600">#LB-9901</td>
                <td className="px-6 py-4 text-gray-700">Vidhya Sagar</td>
                <td className="px-6 py-4 text-gray-700">Lebrostone Capsules</td>
                <td className="px-6 py-4 font-bold text-gray-800">₹1,200</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Delivered</span>
                </td>
              </tr>
              {/* More rows can go here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;