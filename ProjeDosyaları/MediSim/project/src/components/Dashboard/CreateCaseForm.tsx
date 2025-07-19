import React, { useState } from 'react';
import { Case } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const defaultVitals = {
  temperature: '',
  bloodPressure: '',
  heartRate: '',
  respiratoryRate: '',
};
const defaultPatientInfo = {
  age: 0,
  gender: 'male',
  medicalHistory: [],
  currentMedications: [],
};

const CreateCaseForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState(30);
  const [symptoms, setSymptoms] = useState<string>('');
  const [vitals, setVitals] = useState(defaultVitals);
  const [patientInfo, setPatientInfo] = useState(defaultPatientInfo);
  const [tags, setTags] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleChangeVitals = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };
  const handleChangePatientInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientInfo({
      ...patientInfo,
      [name]: name === 'gender' ? (value as 'male' | 'female') : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newCase: Case = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      difficulty,
      category,
      duration,
      symptoms: symptoms.split(',').map(s => s.trim()).filter(Boolean),
      vitals: { ...vitals },
      patientInfo: {
        ...patientInfo,
        age: Number(patientInfo.age),
        gender: patientInfo.gender as 'male' | 'female',
        medicalHistory: (patientInfo.medicalHistory as any as string).split(',').map((s: string) => s.trim()).filter(Boolean),
        currentMedications: (patientInfo.currentMedications as any as string).split(',').map((s: string) => s.trim()).filter(Boolean),
      },
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      tags: tags.split(',').map(s => s.trim()).filter(Boolean),
    };
    console.log('Created case:', newCase);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Case</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (comma separated)</label>
            <input type="text" value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
              <input type="text" name="temperature" value={vitals.temperature} onChange={handleChangeVitals} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
              <input type="text" name="bloodPressure" value={vitals.bloodPressure} onChange={handleChangeVitals} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
              <input type="text" name="heartRate" value={vitals.heartRate} onChange={handleChangeVitals} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate</label>
              <input type="text" name="respiratoryRate" value={vitals.respiratoryRate} onChange={handleChangeVitals} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Age</label>
              <input type="number" name="age" value={patientInfo.age} onChange={handleChangePatientInfo} min={0} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Gender</label>
              <select name="gender" value={patientInfo.gender} onChange={handleChangePatientInfo} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical History (comma separated)</label>
            <input type="text" name="medicalHistory" value={patientInfo.medicalHistory as any as string} onChange={handleChangePatientInfo} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications (comma separated)</label>
            <input type="text" name="currentMedications" value={patientInfo.currentMedications as any as string} onChange={handleChangePatientInfo} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Create Case</button>
          {success && <div className="text-green-600 text-center mt-2">Case created!</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateCaseForm; 