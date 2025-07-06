import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockCases } from '../../data/mockData';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Plus,
  BarChart3,
  Activity
} from 'lucide-react';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Students', value: 47, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Cases', value: mockCases.length, icon: FileText, color: 'bg-green-500' },
    { label: 'Avg. Performance', value: '78%', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Hours Simulated', value: 142, icon: Clock, color: 'bg-orange-500' },
  ];

  const recentActivity = [
    { student: 'Alex Chen', case: 'Acute Chest Pain', score: 85, time: '2 hours ago' },
    { student: 'Sarah Johnson', case: 'Pediatric Fever', score: 92, time: '3 hours ago' },
    { student: 'Michael Brown', case: 'Chronic Abdominal Pain', score: 78, time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600">Monitor student progress and manage cases</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Case</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Student Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Student Activity</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{activity.student}</h3>
                      <p className="text-sm text-gray-500">{activity.case}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.score >= 90 ? 'bg-green-100 text-green-800' :
                        activity.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.score}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Case Library Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Library</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cardiology</span>
                <span className="font-medium">8 cases</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pediatrics</span>
                <span className="font-medium">6 cases</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Emergency</span>
                <span className="font-medium">5 cases</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gastroenterology</span>
                <span className="font-medium">4 cases</span>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Class Average</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Needs Improvement</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;