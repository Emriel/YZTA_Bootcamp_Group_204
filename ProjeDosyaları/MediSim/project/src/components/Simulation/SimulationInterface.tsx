import React, { useState, useEffect } from 'react';
import { Case, AIInteraction } from '../../types';
import { mockCases, mockAIResponses } from '../../data/mockData';
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot, 
  Activity, 
  Clock, 
  Heart,
  Thermometer,
  Stethoscope,
  FlaskConical
} from 'lucide-react';

interface SimulationInterfaceProps {
  caseId: string;
  onComplete: (diagnosis: string, reasoning: string) => void;
}

const SimulationInterface: React.FC<SimulationInterfaceProps> = ({ caseId, onComplete }) => {
  const [case_, setCase] = useState<Case | null>(null);
  const [messages, setMessages] = useState<AIInteraction[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'history' | 'physical' | 'labs' | 'diagnosis'>('history');
  const [diagnosis, setDiagnosis] = useState('');
  const [reasoning, setReasoning] = useState('');

  useEffect(() => {
    const foundCase = mockCases.find(c => c.id === caseId);
    setCase(foundCase || null);
    
    if (foundCase) {
      // Initial AI greeting
      const initialMessage: AIInteraction = {
        id: '1',
        sessionId: 'current',
        question: 'Welcome to the case simulation',
        response: `Hello! I'm your AI patient simulation assistant. You're about to examine a ${foundCase.patientInfo.age}-year-old ${foundCase.patientInfo.gender} patient. ${foundCase.description} 

What would you like to know about the patient's history?`,
        timestamp: new Date().toISOString(),
        type: 'symptom_inquiry'
      };
      setMessages([initialMessage]);
    }
  }, [caseId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    setIsLoading(true);
    
    const userMessage: AIInteraction = {
      id: Date.now().toString(),
      sessionId: 'current',
      question: inputMessage,
      response: '',
      timestamp: new Date().toISOString(),
      type: 'symptom_inquiry'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const responseType = currentStep === 'history' ? 'symptomInquiry' : 
                          currentStep === 'physical' ? 'physicalExam' : 'labRequest';
      
      const responses = mockAIResponses[responseType as keyof typeof mockAIResponses];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse: AIInteraction = {
        id: (Date.now() + 1).toString(),
        sessionId: 'current',
        question: inputMessage,
        response: randomResponse,
        timestamp: new Date().toISOString(),
        type: currentStep === 'history' ? 'symptom_inquiry' : 
              currentStep === 'physical' ? 'physical_exam' : 'lab_request'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleStepChange = (step: typeof currentStep) => {
    setCurrentStep(step);
    
    const stepMessages = {
      history: "Let's focus on the patient's medical history. What would you like to know?",
      physical: "Now let's proceed with the physical examination. What would you like to examine?",
      labs: "Time to order some tests. What laboratory tests or imaging would you like to request?",
      diagnosis: "Based on your findings, what is your diagnosis?"
    };

    const stepMessage: AIInteraction = {
      id: Date.now().toString(),
      sessionId: 'current',
      question: `Moving to ${step} phase`,
      response: stepMessages[step],
      timestamp: new Date().toISOString(),
      type: 'symptom_inquiry'
    };

    setMessages(prev => [...prev, stepMessage]);
  };

  const handleSubmitDiagnosis = () => {
    if (diagnosis.trim() && reasoning.trim()) {
      onComplete(diagnosis, reasoning);
    }
  };

  if (!case_) {
    return <div className="text-center py-8">Case not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Case Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{case_.title}</h1>
            <p className="text-gray-600 mt-1">{case_.description}</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{case_.duration} min</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{case_.patientInfo.age}y {case_.patientInfo.gender}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Info Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Patient Info</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Age:</strong> {case_.patientInfo.age}</div>
              <div><strong>Gender:</strong> {case_.patientInfo.gender}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Vital Signs</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-sm">{case_.vitals.temperature}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">{case_.vitals.heartRate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{case_.vitals.bloodPressure}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Investigation Steps</h3>
            <div className="space-y-2">
              {['history', 'physical', 'labs', 'diagnosis'].map((step) => (
                <button
                  key={step}
                  onClick={() => handleStepChange(step as typeof currentStep)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentStep === step
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900">AI Patient Simulation</h2>
                <span className="text-sm text-gray-500">• {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)} Phase</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {message.question && (
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                        {message.question}
                      </div>
                    </div>
                  )}
                  {message.response && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-md">
                        {message.response}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            {currentStep !== 'diagnosis' ? (
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about symptoms, request tests, or perform examinations..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-gray-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Diagnosis
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter your diagnosis..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reasoning
                  </label>
                  <textarea
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    placeholder="Explain your reasoning..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSubmitDiagnosis}
                  disabled={!diagnosis.trim() || !reasoning.trim()}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Diagnosis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationInterface;