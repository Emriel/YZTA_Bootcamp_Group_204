import { GoogleGenerativeAI } from '@google/generative-ai';
import { Case } from '../types';

// Note: Store your API key in .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface PatientResponse {
  response: string;
  type: 'symptom' | 'history' | 'physical' | 'emotional' | 'clarification';
}

export class GeminiPatientSimulator {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  private conversationHistory: string[] = [];
  private case: Case | null = null;

  constructor(caseData?: Case, caseId?: string) {
    if (caseData) {
      this.case = caseData;
      this.initializePatient();
    } else if (caseId) {
      this.loadCaseFromBackend(caseId);
    }
  }

  private async loadCaseFromBackend(caseId: string) {
    try {
      const response = await fetch(`http://localhost:3001/cases/${caseId}`);
      const caseData = await response.json();
      
      if (caseData.error) {
        throw new Error(caseData.error);
      }

      // JSON string'leri parse et
      const parseJsonField = (field: string) => {
        try {
          return typeof field === 'string' ? JSON.parse(field) : (field || []);
        } catch {
          return typeof field === 'string' ? field.split(', ').filter(Boolean) : (field || []);
        }
      };

      // Backend verilerini Case formatına çevir
      this.case = {
        id: caseData.id.toString(),
        title: caseData.title,
        description: caseData.description,
        category: caseData.category,
        difficulty: caseData.difficulty,
        duration: caseData.duration,
        tags: parseJsonField(caseData.tags),
        patientInfo: {
          age: caseData.patient_age,
          gender: caseData.patient_gender,
          medicalHistory: parseJsonField(caseData.medical_history),
          currentMedications: parseJsonField(caseData.current_medications)
        },
        symptoms: parseJsonField(caseData.symptoms),
        vitals: {
          temperature: caseData.temperature,
          bloodPressure: caseData.blood_pressure,
          heartRate: caseData.heart_rate,
          respiratoryRate: caseData.respiratory_rate
        },
        createdBy: 'instructor1',
        createdAt: caseData.created_at || new Date().toISOString()
      };

      this.initializePatient();
    } catch (error) {
      console.error('Error loading case from backend:', error);
      throw error;
    }
  }

  private initializePatient() {
    if (!this.case) return;

    const systemPrompt = `You are playing the role of a patient. Act according to the following patient information:

PATIENT INFORMATION:
- Age: ${this.case.patientInfo.age}
- Gender: ${this.case.patientInfo.gender === 'male' ? 'Male' : 'Female'}
- Chief Complaint: ${this.case.description}
- Symptoms: ${this.case.symptoms.join(', ')}
- Vital Signs: 
  * Temperature: ${this.case.vitals.temperature}
  * Blood Pressure: ${this.case.vitals.bloodPressure}
  * Heart Rate: ${this.case.vitals.heartRate}
  * Respiratory Rate: ${this.case.vitals.respiratoryRate}
- Medical History: ${this.case.patientInfo.medicalHistory.join(', ') || 'No significant history'}
- Current Medications: ${this.case.patientInfo.currentMedications.join(', ') || 'None'}

BEHAVIORAL RULES:
1. Act like a real patient - be anxious, symptom-focused, and emotional when appropriate
2. Only share symptoms and information you actually have
3. Answer doctor's questions from a patient's perspective
4. Don't use medical terminology, speak in simple language
5. Sometimes be uncertain or unable to remember details exactly
6. Describe subjective experiences like pain and discomfort in your own words
7. When the doctor wants to perform physical examination, respond appropriately
8. Speak in English and stay in character as a patient

Introduce yourself in your first message and state your main complaint.`;

    this.conversationHistory.push(systemPrompt);
  }

  async getPatientResponse(doctorQuestion: string): Promise<PatientResponse> {
    try {
      this.conversationHistory.push(`Doctor: ${doctorQuestion}`);
      
      const prompt = this.conversationHistory.join('\n\n') + '\n\nPatient (you):';
      
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      this.conversationHistory.push(`Patient: ${text}`);

      // Response tipini belirle
      const type = this.determineResponseType(doctorQuestion, text);
      
      return {
        response: text,
        type
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        response: 'I\'m sorry, I can\'t respond to you right now. Please try again.',
        type: 'clarification'
      };
    }
  }

  private determineResponseType(question: string, _response: string): PatientResponse['type'] {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('symptom') || questionLower.includes('complaint') || questionLower.includes('problem')) {
      return 'symptom';
    }
    if (questionLower.includes('history') || questionLower.includes('before') || questionLower.includes('family')) {
      return 'history';
    }
    if (questionLower.includes('exam') || questionLower.includes('examine') || questionLower.includes('listen')) {
      return 'physical';
    }
    if (questionLower.includes('feel') || questionLower.includes('worry') || questionLower.includes('concern')) {
      return 'emotional';
    }
    
    return 'clarification';
  }

  async getInitialGreeting(): Promise<string> {
    try {
      const prompt = `${this.conversationHistory[0]}\n\nAs a patient, introduce yourself and explain why you came:`;
      
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      this.conversationHistory.push(`Patient: ${text}`);
      
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return `Hello doctor. ${this.case?.description} I'm ${this.case?.patientInfo.age} years old and I'd like to consult with you about this issue.`;
    }
  }

  getConversationHistory(): string[] {
    return this.conversationHistory.slice(1); // Exclude system prompt
  }

  resetConversation(): void {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Keep only system prompt
  }
}
