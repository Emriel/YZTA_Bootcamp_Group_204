import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import InstructorDashboard from './components/Dashboard/InstructorDashboard';
import CaseList from './components/Cases/CaseList';
import SimulationInterface from './components/Simulation/SimulationInterface';
import PerformanceAnalytics from './components/Performance/PerformanceAnalytics';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);

  const handleStartCase = (caseId: string) => {
    setCurrentCaseId(caseId);
    setActiveTab('simulation');
  };

  const handleCompleteCase = (diagnosis: string, reasoning: string) => {
    // Here you would typically save the case results
    console.log('Case completed:', { diagnosis, reasoning });
    setCurrentCaseId(null);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  const renderContent = () => {
    if (activeTab === 'simulation' && currentCaseId) {
      return (
        <SimulationInterface 
          caseId={currentCaseId} 
          onComplete={handleCompleteCase}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return user?.role === 'instructor' ? 
          <InstructorDashboard /> : 
          <StudentDashboard />;
      case 'cases':
        return <CaseList onStartCase={handleStartCase} />;
      case 'performance':
        return <PerformanceAnalytics />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600">This feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 md:ml-64">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;