import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Case } from '../../types';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Plus,
  BarChart3,
  Heart
} from 'lucide-react';
import CreateCaseForm from './CreateCaseForm';

interface InstructorDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ onNavigateToTab }) => {
  const { user } = useAuth();
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [categoryStats, setCategoryStats] = useState<{category: string, count: number}[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Health quotes (Latin + English meaning)
  const healthQuotes = [
    { latin: "Mens sana in corpore sano.", english: "A healthy mind in a healthy body." },
    { latin: "Salus populi suprema lex esto.", english: "The health of the people shall be the supreme law." },
    { latin: "Medicus curat, natura sanat.", english: "The doctor treats, nature heals." },
    { latin: "Vita brevis, ars longa.", english: "Life is short, art is long." },
    { latin: "Cura te ipsum.", english: "Take care of yourself." },
    { latin: "Non est vivere sed valere vita est.", english: "Life is not just being alive, but being well." },
    { latin: "Qui bene dormit, bene vivit.", english: "He who sleeps well, lives well." },
    { latin: "Sanitas sanitatum, omnia sanitas.", english: "Health of healths, everything is health." },
    { latin: "Plenus venter non studet libenter.", english: "A full belly does not study willingly." },
    { latin: "Sine sanitate vita misera est.", english: "Without health, life is miserable." },
    { latin: "Mens aegra corpus habet languidum.", english: "A sick mind has a weary body." },
    { latin: "Medicina est ars bene vivendi.", english: "Medicine is the art of living well." },
    { latin: "Aegris morbo remedium quaerere.", english: "To seek a remedy for the sick." },
    { latin: "Salus per aquam.", english: "Health through water." },
    { latin: "Sanitas prima est.", english: "Health is first." }
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  // Auto-change quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % healthQuotes.length);
    }, 60000); // Changes every 60 seconds

    return () => clearInterval(interval);
  }, [healthQuotes.length]);

  useEffect(() => {
    fetchRecentCases();
    fetchCategoryStats();
  }, []);

  const fetchRecentCases = async () => {
    try {
      setIsLoadingCases(true);
      const response = await fetch('http://localhost:3001/cases');
      if (response.ok) {
        const cases = await response.json();
        setRecentCases(cases.slice(0, 3)); // Show only first 3 popular cases
      } else {
        console.error('Failed to fetch cases');
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setIsLoadingCases(false);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch('http://localhost:3001/cases-by-category');
      if (response.ok) {
        const stats = await response.json();
        setCategoryStats(stats);
      } else {
        console.error('Failed to fetch category stats');
      }
    } catch (error) {
      console.error('Error fetching category stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600">Monitor student progress and manage cases</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          onClick={() => setShowCreateCase(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Create Case</span>
        </button>
      </div>
      {showCreateCase && <CreateCaseForm onClose={() => setShowCreateCase(false)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Quote Section */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-lg font-semibold">Daily Health Quote</h2>
              </div>
              <div className="flex-1 ml-12">
                <p className="text-white/95 text-2xl font-medium italic leading-relaxed animate-fadeInOut">
                  {healthQuotes[currentQuote].latin}
                </p>
                <p className="text-white/70 text-xl italic mt-1 animate-fadeInOut">
                  ({healthQuotes[currentQuote].english})
                </p>
              </div>
            </div>
            {/* Dot indicators */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {healthQuotes.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentQuote ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Case Library Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Library</h2>
            <div className="space-y-3">
              {isLoadingStats ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 text-sm mt-2">Loading statistics...</p>
                </div>
              ) : categoryStats.length > 0 ? (
                categoryStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{stat.category}</span>
                    <span className="font-medium">{stat.count} case{stat.count !== 1 ? 's' : ''}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No cases found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-1">
        {/* Popular Cases */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Popular Cases</h2>
              <button 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => onNavigateToTab?.('cases')}
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {isLoadingCases ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 mt-2">Loading cases...</p>
                </div>
              ) : recentCases.length > 0 ? (
                recentCases.map((case_) => (
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No cases available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Placeholder for balance */}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;