import React from 'react';
import { Case } from '../../types';
import { Clock, Users, BookOpen, Play, Star } from 'lucide-react';

interface CaseCardProps {
  case: Case;
  onStart: (caseId: string) => void;
  showProgress?: boolean;
  progress?: number;
}

const CaseCard: React.FC<CaseCardProps> = ({ case: caseData, onStart, showProgress = false, progress = 0 }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Tag listesi düzeltmesi
  const tagList: string[] = caseData.tags
    ? caseData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{caseData.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{caseData.description}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{caseData.duration ?? 'N/A'} min</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{caseData.category ?? 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>
                {(caseData.patient_age !== undefined ? caseData.patient_age + 'y ' : 'N/A ')}
                {caseData.patient_gender || ''}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(caseData.difficulty)}`}>
            {caseData.difficulty}
          </span>
          {showProgress && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      {showProgress && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tagList.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onStart(caseData.id)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Play className="h-4 w-4" />
          <span>Start Case</span>
        </button>
      </div>
    </div>
  );
};

export default CaseCard;
