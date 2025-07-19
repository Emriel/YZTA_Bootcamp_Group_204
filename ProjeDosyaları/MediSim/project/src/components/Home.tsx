import React from 'react';


export interface HomeProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col">
      
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/medisimlogoDAR.png" alt="MediSim Logo" className="h-12 w-auto" />
          </div>
          
          <div className="flex items-center space-x-3">
            <button onClick={onLoginClick} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition hidden sm:inline-flex">Sign In</button>
            <button onClick={onRegisterClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Sign Up</button>
          </div>
        </div>
      </header>

     
      <section className="flex-1 flex flex-col justify-center items-center py-20 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">AI-Powered Medical Education</span>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Master Clinical <span className="text-blue-600">Decision Making</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Train with AI-powered patient simulations that adapt to your learning style. Practice clinical reasoning, diagnostic skills, and patient interaction in a safe, controlled environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button onClick={onRegisterClick} className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-lg font-semibold transition">Start Training</button>
          </div>
        </div>
      </section>

      
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">🩺</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
            <div className="text-gray-600">Medical Cases</div>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">🎓</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">2,000+</div>
            <div className="text-gray-600">Students Trained</div>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">✅</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">🏫</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
            <div className="text-gray-600">Medical Schools</div>
          </div>
        </div>
      </section>

      
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose MediSim?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our platform combines cutting-edge AI with proven medical education principles to create the most effective training experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-xl font-semibold mb-2">AI-Powered Scenarios</div>
              <div className="text-gray-600">Advanced AI creates realistic patient cases that adapt to your decisions and learning pace.</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-xl font-semibold mb-2">Interactive Simulations</div>
              <div className="text-gray-600">Engage with virtual patients through natural conversation and clinical questioning.</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-xl font-semibold mb-2">Comprehensive Cases</div>
              <div className="text-gray-600">Extensive library of medical cases covering all specialties and difficulty levels.</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-xl font-semibold mb-2">Performance Analytics</div>
              <div className="text-gray-600">Track your progress with detailed analytics and personalized feedback.</div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 bg-blue-600 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Transform Your Medical Education?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of medical students and professionals who are already advancing their careers with MediSim.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onRegisterClick} className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-semibold transition">Start Free Trial</button>
          </div>
        </div>
      </section>

      
      <footer className="bg-gray-900 text-white py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <img src="/medisimlogoDAR.png" alt="MediSim Logo" className="h-8 w-auto" />
            </div>
            <div className="text-gray-400">Empowering the next generation of medical professionals through AI-powered simulation.</div>
          </div>
          <div className="border-t border-gray-800 pt-4 text-gray-400">
            <p>© 2025 MediSim. Made by YZTA Bootcamp Group 204.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 