import React, { useState, useEffect } from 'react';
import CaseCard from './CaseCard';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CreateCaseForm from '../Dashboard/CreateCaseForm';
import { Case } from '../../types';

interface CaseListProps {
  onStartCase: (caseId: string) => void;
}

const CaseList: React.FC<CaseListProps> = ({ onStartCase }) => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showCreateCase, setShowCreateCase] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('http://localhost:3001/cases');
        const data = await response.json();
        setCases(data);
      } catch (error) {
        console.error('Vaka verileri alınırken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);

  const categories = ['all', ...new Set(cases.map(c => c.category))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || case_.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || case_.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-600">Loading cases...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'instructor' ? 'Manage Cases' : 'Available Cases'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'instructor'
              ? 'Create and manage medical case simulations'
              : 'Select a case to start your simulation'}
          </p>
        </div>
        {user?.role === 'instructor' && (
          <>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              onClick={() => setShowCreateCase(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Create New Case</span>
            </button>
            {showCreateCase && <CreateCaseForm onClose={() => setShowCreateCase(false)} />}
          </>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all'
                    ? 'All Levels'
                    : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Case Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCases.map((case_) => (
          <CaseCard
            key={case_.id}
            case={case_}
            onStart={onStartCase}
            showProgress={user?.role === 'student'}
            progress={Math.floor(Math.random() * 100)}
          />
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No cases found matching your criteria</div>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default CaseList;
