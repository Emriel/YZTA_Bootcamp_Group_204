import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockCases, mockPerformance } from '../../data/mockData';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Play, 
  Star,
  Calendar,
  Target
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const recentCases = mockCases.slice(0, 3);
  const stats = [
    { label: 'Cases Completed', value: mockPerformance.completedCases, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Average Score', value: `${mockPerformance.averageScore}%`, icon: Star, color: 'bg-green-500' },
    { label: 'Total Cases', value: mockPerformance.totalCases, icon: Target, color: 'bg-purple-500' },
    { label: 'Achievements', value: mockPerformance.achievements.length, icon: Trophy, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Continue your medical education journey</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Cases</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentCases.map((case_) => (
                <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{case_.title}</h3>
                      <p className="text-sm text-gray-500">{case_.category} • {case_.duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      case_.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      case_.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {case_.difficulty}
                    </span>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent Achievement */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Achievement</h2>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900">{mockPerformance.achievements[0]?.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{mockPerformance.achievements[0]?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;