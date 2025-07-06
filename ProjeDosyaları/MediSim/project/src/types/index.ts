export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  avatar?: string;
  createdAt: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number; // in minutes
  symptoms: string[];
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
  };
  patientInfo: {
    age: number;
    gender: 'male' | 'female';
    medicalHistory: string[];
    currentMedications: string[];
  };
  createdBy: string;
  createdAt: string;
  tags: string[];
}

export interface CaseSession {
  id: string;
  caseId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  score?: number;
  diagnosis: string;
  reasoning: string;
  aiInteractions: AIInteraction[];
  status: 'active' | 'completed' | 'abandoned';
}

export interface AIInteraction {
  id: string;
  sessionId: string;
  question: string;
  response: string;
  timestamp: string;
  type: 'symptom_inquiry' | 'physical_exam' | 'lab_request' | 'diagnosis_check';
}

export interface Performance {
  userId: string;
  totalCases: number;
  completedCases: number;
  averageScore: number;
  categoryScores: { [key: string]: number };
  recentSessions: CaseSession[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}