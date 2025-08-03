export interface User {
  id: string;
  name: string;
  surname?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
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
  symptoms: string[]; // array of symptoms
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
  tags: string[];
  createdBy?: string;
  createdAt?: string;
}

// Backend Case format
export interface BackendCase {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number;
  symptoms: string; // comma-separated string
  temperature: string;
  blood_pressure: string;
  heart_rate: string;
  respiratory_rate: string;
  patient_age: number;
  patient_gender: 'male' | 'female';
  medical_history: string; // comma-separated string
  current_medications: string; // comma-separated string
  tags: string; // comma-separated string
  created_at?: string;
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
