import React from 'react';

export interface HomeProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick, onRegisterClick }: HomeProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-white relative">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 absolute top-0 left-0 z-10">
        <div className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm select-none">
          MediSim
        </div>
        <div className="flex gap-3">
          <button onClick={onLoginClick} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Giriş Yap</button>
          <button onClick={onRegisterClick} className="bg-gray-200 text-blue-700 px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-300 transition">Kayıt Ol</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col justify-center items-center text-center px-4">
        <div className="mt-32 mb-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 drop-shadow-sm">MediSim'e Hoşgeldiniz!</h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed bg-white/70 rounded-xl p-6 shadow">
            MediSim, tıp öğrencileri için geliştirilen yapay zeka destekli, web tabanlı bir hasta simülasyon platformudur. Öğrenciler, sanal hastalar ile etkileşime geçerek vaka analizi yapabilir, teşhis koyabilir ve klinik pratiğe hazırlanabilir. LLM teknolojisi ile desteklenen sistem, gerçekçi diyalog ve semptom aktarımı sunar.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-500 text-sm absolute bottom-0 left-0 bg-transparent">
        © 2025 | YZTA Bootcamp Group 204 tarafından yapılmıştır
      </footer>
    </div>
  );
};

export default Home; 