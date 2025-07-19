import React, { useState, useEffect } from 'react';
import { Case, AIInteraction } from '../../types';
import { mockCases } from '../../data/mockData';
import { GeminiPatientSimulator } from '../../services/geminiService';
import { 
  Send, 
  User, 
  Bot, 
  Activity, 
  Clock, 
  Heart,
  Thermometer,
  AlertCircle
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
  const [patientSimulator, setPatientSimulator] = useState<GeminiPatientSimulator | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const foundCase = mockCases.find(c => c.id === caseId);
    setCase(foundCase || null);
    
    if (foundCase) {
      // Initialize Gemini Patient Simulator
      const simulator = new GeminiPatientSimulator(foundCase);
      setPatientSimulator(simulator);
      
      // Get initial patient greeting
      const initializePatient = async () => {
        try {
          setIsLoading(true);
          const greeting = await simulator.getInitialGreeting();
          
          const initialMessage: AIInteraction = {
            id: '1',
            sessionId: 'current',
            question: '', // AI greeting için question boş
            response: greeting,
            timestamp: new Date().toISOString(),
            type: 'symptom_inquiry'
          };
          
          setMessages([initialMessage]);
          setApiError(null);
        } catch (error) {
          console.error('Error initializing patient:', error);
          setApiError('API connection problem. Please check your API key.');
          
          // Fallback to mock response
          const fallbackMessage: AIInteraction = {
            id: '1',
            sessionId: 'current',
            question: '', // AI greeting için question boş
            response: `Hello doctor. I'm a ${foundCase.patientInfo.age}-year-old ${foundCase.patientInfo.gender} patient. ${foundCase.description} I'd like to consult with you about this issue.`,
            timestamp: new Date().toISOString(),
            type: 'symptom_inquiry'
          };
          
          setMessages([fallbackMessage]);
        } finally {
          setIsLoading(false);
        }
      };
      
      initializePatient();
    }
  }, [caseId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !patientSimulator) return;
    
    setIsLoading(true);
    setApiError(null);
    
    const userMessage: AIInteraction = {
      id: Date.now().toString(),
      sessionId: 'current',
      question: inputMessage,
      response: '', // Kullanıcı mesajı için response boş bırakılıyor
      timestamp: new Date().toISOString(),
      type: 'symptom_inquiry'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputMessage;
    setInputMessage('');

    try {
      // Get response from Gemini patient simulator
      const patientResponse = await patientSimulator.getPatientResponse(currentQuestion);
      
      const aiResponse: AIInteraction = {
        id: (Date.now() + 1).toString(),
        sessionId: 'current',
        question: '', // AI response için question boş bırakılıyor
        response: patientResponse.response,
        timestamp: new Date().toISOString(),
        type: currentStep === 'history' ? 'symptom_inquiry' : 
              currentStep === 'physical' ? 'physical_exam' : 'lab_request'
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting patient response:', error);
      setApiError('Error getting patient response.');
      
      // Fallback response
      const fallbackResponse: AIInteraction = {
        id: (Date.now() + 1).toString(),
        sessionId: 'current',
        question: '', // AI response için question boş
        response: 'I\'m sorry, I can\'t respond to you right now. Please try again or check your API key.',
        timestamp: new Date().toISOString(),
        type: 'symptom_inquiry'
      };

      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
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
      question: '', // System message için question boş
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
              {[
                { key: 'history', label: 'History' },
                { key: 'physical', label: 'Physical Exam' },
                { key: 'labs', label: 'Labs' },
                { key: 'diagnosis', label: 'Diagnosis' }
              ].map((step) => (
                <button
                  key={step.key}
                  onClick={() => handleStepChange(step.key as typeof currentStep)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentStep === step.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {step.label}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">AI Patient Simulation</h2>
                  <span className="text-sm text-gray-500">• {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)} Phase</span>
                </div>
                {apiError && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>API Connection Issue</span>
                  </div>
                )}
              </div>
              {apiError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{apiError}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Please check your VITE_GEMINI_API_KEY in the .env file.
                  </p>
                </div>
              )}
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
