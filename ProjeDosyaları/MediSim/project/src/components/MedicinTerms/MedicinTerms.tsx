import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Volume2,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';

const GeminiTranslator = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('la');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [wordHistory, setWordHistory] = useState('');

  const languages = [
    { code: 'la', name: 'Latin', flag: '🏛️' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const translateWithGemini = async (text: string, fromLang: string, toLang: string): Promise<string> => {
    const mockTranslations: { [key: string]: string } = {
      'Angina Pectoris': 'Chest pain',
      'Hypertensio': 'High blood pressure',
      'Diabetes Mellitus': 'Diabetes',
      'Pneumonia': 'Lung infection',
      'Gastritis': 'Stomach inflammation',
      'Tachycardia': 'Rapid heart rate'
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTranslations[text] || `Translated: ${text}`);
      }, 1000);
    });
  };

  const getWordHistory = async (text: string): Promise<string> => {
    const wordHistories: { [key: string]: string } = {
      'Angina Pectoris': 'Etymology: From Latin "angina" (strangling, choking) + "pectoris" (of the chest). First described by William Heberden in 1768. The term literally means "strangling of the chest," reflecting the characteristic tight, constricting chest pain experienced during episodes.',
      'Hypertensio': 'Etymology: From Greek "hyper" (over, above) + Latin "tensio" (tension, stretching). The concept of blood pressure was first measured by Stephen Hales in 1733. The term "hypertension" was coined in the early 20th century as understanding of cardiovascular physiology advanced.',
      'Diabetes Mellitus': 'Etymology: "Diabetes" from Greek "diabainein" (to pass through), referring to excessive urination. "Mellitus" from Latin meaning "honey-sweet," added to distinguish from diabetes insipidus. First described by ancient Egyptian physicians around 1550 BCE, with the sweet taste of diabetic urine noted by ancient Indian physicians.',
      'Pneumonia': 'Etymology: From Greek "pneumon" (lung) + "-ia" (condition). Hippocrates (460-370 BCE) called it "the disease of the lungs." The modern understanding began with Edwin Klebs\'s observation of bacteria in airways in 1875, and Carl von Rokitansky\'s pathological descriptions.',
      'Gastritis': 'Etymology: From Greek "gaster" (stomach) + "-itis" (inflammation). The condition was first systematically described by Giovanni Battista Morgagni in 1761. The inflammatory nature was better understood with the development of endoscopy in the 19th century.',
      'Tachycardia': 'Etymology: From Greek "tachy" (swift, rapid) + "kardia" (heart). The term was first used in medical literature in the late 19th century as physicians developed better methods to measure and understand heart rhythms. The condition itself has been recognized since ancient times through pulse examination.'
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(wordHistories[text] || `Historical information: The term "${text}" has roots in classical medical terminology. Many medical terms derive from Greek and Latin origins, reflecting the historical development of medical science through ancient civilizations and continuing through medieval and renaissance periods.`);
      }, 1200);
    });
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    setError('');
    try {
      const [result, history] = await Promise.all([
        translateWithGemini(sourceText, sourceLang, targetLang),
        getWordHistory(sourceText)
      ]);
      setTranslatedText(result);
      setWordHistory(history);
    } catch (error) {
      setError('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-US' : 'la';
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (sourceText.trim() && sourceText.length > 2) handleTranslate();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [sourceText, sourceLang, targetLang]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full h-full">

        {/* Başlık Kutucuğu */}
        <div className="mx-2 mt-2 mb-4 p-6 rounded-2xl shadow-md bg-gradient-to-r from-blue-300 via-white-200 to-indigo-300 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-800 to-blue-600 tracking-wide drop-shadow-md">
            Quick Guide to Latin and English Medical Terms
          </h1>
          <p className="mt-2 text-base md:text-lg text-gray-700 font-medium">
            Understand the roots of modern medicine in both languages
          </p>
        </div>

        {/* Çeviri Paneli */}
        <div className="mx-2 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Kelime Tarihçesi Kutusu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl h-full">
              <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-orange-50">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">📚</span>
                  Word Etymology & History
                </h3>
              </div>
              <div className="p-4 h-96 overflow-y-auto">
                {isTranslating ? (
                  <div className="flex items-center justify-center h-full text-amber-600 space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading history...</span>
                  </div>
                ) : wordHistory ? (
                  <div className="prose prose-sm text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-wrap">{wordHistory}</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 h-full flex items-center justify-center">
                    <div>
                      <span className="text-4xl mb-4 block">🏛️</span>
                      <p className="text-sm">Enter a medical term to explore its fascinating etymology and historical background.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ana Çeviri Kutusu */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Dil Seçimi */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={swapLanguages}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Swap languages"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                </button>

                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Çeviri Kutuları */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Kaynak Metin */}
                <div className="p-6 border-r border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {languages.find(l => l.code === sourceLang)?.flag} {languages.find(l => l.code === sourceLang)?.name}
                    </h3>
                    <button
                      onClick={() => speakText(sourceText, sourceLang)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      disabled={!sourceText}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Enter Latin term or phrase..."
                    className="w-full h-64 p-4 text-lg border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">{sourceText.length}/5000</span>
                    <button
                      onClick={() => setSourceText('')}
                      className="text-sm text-gray-500 hover:text-red-500"
                      disabled={!sourceText}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Çeviri Sonucu */}
                <div className="p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {languages.find(l => l.code === targetLang)?.flag} {languages.find(l => l.code === targetLang)?.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => speakText(translatedText, targetLang)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        disabled={!translatedText}
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(translatedText)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        disabled={!translatedText}
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-64 p-4 bg-white border border-gray-200 rounded-lg overflow-y-auto">
                    {isTranslating ? (
                      <div className="flex items-center justify-center h-full text-blue-600 space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Translating...</span>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full text-red-500 space-x-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                      </div>
                    ) : (
                      <p className="text-lg text-gray-800 whitespace-pre-wrap">
                        {translatedText || 'Translation will appear here...'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Çevir Butonu */}
              <div className="p-4 bg-gray-50 border-t flex justify-center">
                <button
                  onClick={handleTranslate}
                  disabled={!sourceText.trim() || isTranslating}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {isTranslating ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Translating...</span>
                    </div>
                  ) : (
                    'Translate'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tıp Terimleri Örnekleri */}
        <div className="mx-2 mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Examples of Medical Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { text: "Angina Pectoris" },
              { text: "Hypertensio" },
              { text: "Diabetes Mellitus" },
              { text: "Pneumonia" },
              { text: "Gastritis" },
              { text: "Tachycardia" }
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setSourceText(example.text)}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <p className="font-medium text-gray-800">{example.text}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GeminiTranslator;