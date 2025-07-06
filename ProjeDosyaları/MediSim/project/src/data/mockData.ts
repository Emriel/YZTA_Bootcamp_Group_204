import { Case, CaseSession, Performance, Achievement } from '../types';

export const mockCases: Case[] = [
  {
    id: '1',
    title: 'Acute Chest Pain in Emergency Department',
    description: 'A 52-year-old male presents to the emergency department with sudden onset of severe chest pain.',
    difficulty: 'intermediate',
    category: 'Cardiology',
    duration: 30,
    symptoms: ['Chest pain', 'Shortness of breath', 'Nausea', 'Diaphoresis'],
    vitals: {
      temperature: '98.6°F',
      bloodPressure: '160/95 mmHg',
      heartRate: '110 bpm',
      respiratoryRate: '22/min'
    },
    patientInfo: {
      age: 52,
      gender: 'male',
      medicalHistory: ['Hypertension', 'Diabetes Type 2', 'Smoking history'],
      currentMedications: ['Lisinopril', 'Metformin', 'Aspirin']
    },
    createdBy: 'instructor1',
    createdAt: '2024-01-15T10:00:00Z',
    tags: ['Emergency', 'Cardiology', 'Acute Care']
  },
  {
    id: '2',
    title: 'Pediatric Fever and Rash',
    description: 'A 4-year-old child presents with high fever and characteristic rash.',
    difficulty: 'beginner',
    category: 'Pediatrics',
    duration: 20,
    symptoms: ['High fever', 'Rash', 'Irritability', 'Poor appetite'],
    vitals: {
      temperature: '102.8°F',
      bloodPressure: '90/60 mmHg',
      heartRate: '140 bpm',
      respiratoryRate: '28/min'
    },
    patientInfo: {
      age: 4,
      gender: 'female',
      medicalHistory: ['No significant past medical history'],
      currentMedications: ['None']
    },
    createdBy: 'instructor2',
    createdAt: '2024-01-14T14:30:00Z',
    tags: ['Pediatrics', 'Infectious Disease', 'Dermatology']
  },
  {
    id: '3',
    title: 'Chronic Abdominal Pain',
    description: 'A 35-year-old female with a 6-month history of intermittent abdominal pain.',
    difficulty: 'advanced',
    category: 'Gastroenterology',
    duration: 45,
    symptoms: ['Abdominal pain', 'Bloating', 'Irregular bowel movements', 'Weight loss'],
    vitals: {
      temperature: '98.2°F',
      bloodPressure: '118/78 mmHg',
      heartRate: '72 bpm',
      respiratoryRate: '16/min'
    },
    patientInfo: {
      age: 35,
      gender: 'female',
      medicalHistory: ['Anxiety', 'Previous appendectomy'],
      currentMedications: ['Sertraline', 'Multivitamin']
    },
    createdBy: 'instructor1',
    createdAt: '2024-01-13T09:15:00Z',
    tags: ['Gastroenterology', 'Chronic Pain', 'Differential Diagnosis']
  }
];

export const mockSessions: CaseSession[] = [
  {
    id: '1',
    caseId: '1',
    userId: '1',
    startTime: '2024-01-16T10:00:00Z',
    endTime: '2024-01-16T10:28:00Z',
    score: 85,
    diagnosis: 'Acute Myocardial Infarction',
    reasoning: 'Based on patient presentation with chest pain, elevated vitals, and risk factors.',
    aiInteractions: [
      {
        id: '1',
        sessionId: '1',
        question: 'What additional tests would you like to order?',
        response: 'I would recommend an ECG, cardiac troponins, and chest X-ray.',
        timestamp: '2024-01-16T10:05:00Z',
        type: 'lab_request'
      }
    ],
    status: 'completed'
  }
];

export const mockPerformance: Performance = {
  userId: '1',
  totalCases: 12,
  completedCases: 8,
  averageScore: 78.5,
  categoryScores: {
    'Cardiology': 82,
    'Pediatrics': 75,
    'Gastroenterology': 80,
    'Emergency Medicine': 85
  },
  recentSessions: mockSessions,
  achievements: [
    {
      id: '1',
      title: 'First Diagnosis',
      description: 'Complete your first case simulation',
      icon: 'Award',
      unlockedAt: '2024-01-10T12:00:00Z'
    },
    {
      id: '2',
      title: 'Quick Thinker',
      description: 'Complete a case in under 15 minutes',
      icon: 'Zap',
      unlockedAt: '2024-01-12T15:30:00Z'
    }
  ]
};

export const mockAIResponses = {
  symptomInquiry: [
    "The patient reports that the chest pain started suddenly about 2 hours ago while at rest. It's described as a crushing sensation that radiates to the left arm.",
    "The patient appears diaphoretic and anxious. They describe the pain as 9/10 in intensity and unlike anything they've experienced before.",
    "The patient has a history of smoking one pack per day for 30 years and has been managing diabetes and hypertension for the past 5 years."
  ],
  physicalExam: [
    "On auscultation, heart sounds are regular but rapid. No murmurs detected. Lungs are clear to auscultation bilaterally.",
    "The patient has cool, clammy skin with diaphoresis. No peripheral edema noted. Pulses are present but rapid.",
    "Abdominal examination is unremarkable. No organomegaly or tenderness detected."
  ],
  labRequest: [
    "ECG shows ST-elevation in leads V1-V4, consistent with anterior wall myocardial infarction.",
    "Cardiac troponin I is elevated at 15.2 ng/mL (normal <0.04 ng/mL). CK-MB is also elevated.",
    "Chest X-ray shows clear lung fields with normal cardiac silhouette. No signs of acute heart failure."
  ]
};