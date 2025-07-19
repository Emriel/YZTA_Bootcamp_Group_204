import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');
  const [birthdate, setBirthdate] = useState(user?.birthdate || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updatedUser = {
      ...user,
      name,
      surname,
      birthdate,
      gender,
    };
    localStorage.setItem('medisim_user', JSON.stringify(updatedUser));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    window.location.reload(); // To update context (simple way for now)
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
          <input
            type="text"
            value={surname}
            onChange={e => setSurname(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
          <input
            type="date"
            value={birthdate}
            onChange={e => setBirthdate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
        {success && <div className="text-green-600 text-center mt-2">Profile updated!</div>}
      </form>
    </div>
  );
};

export default UserProfileSettings; 