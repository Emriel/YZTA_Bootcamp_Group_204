import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Volume2,
  Loader2,
  Check,
  AlertCircle,
  Settings
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
  const [apiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');

  const languages = [
    { code: 'la', name: 'Latin', flag: '🏛️' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const detectLanguage = (text: string): string => {
    // Önce yaygın İngilizce tıp terimlerini kontrol et
    const commonEnglishTerms = [
      'diabetes', 'pneumonia', 'gastritis', 'bronchitis', 'arthritis', 
      'hepatitis', 'nephritis', 'dermatitis', 'appendicitis', 'meningitis',
      'hypertension', 'hypotension', 'tachycardia', 'bradycardia',
      'heart attack', 'stroke', 'cancer', 'tumor', 'infection'
    ];
    
    // Yaygın Latince tıp terimlerini kontrol et
    const commonLatinTerms = [
      'angina pectoris', 'corpus', 'caput', 'manus', 'pedis', 'sanguis',
      'morbus', 'dolor', 'febris', 'sudor', 'tremor', 'rigor',
      'ascites', 'icterus', 'cyanosis', 'dyspnea', 'apnea'
    ];
    
    const textLower = text.toLowerCase();
    
    // Önce yaygın terimlerle eşleştir
    if (commonEnglishTerms.some(term => textLower.includes(term))) {
      return 'en';
    }
    
    if (commonLatinTerms.some(term => textLower.includes(term))) {
      return 'la';
    }
    
    // Eğer yaygın terimler bulunamadıysa, pattern tabanlı tespit yap
    const latinPatterns = [
      /-ae$/i,           // Latince çoğul son eki
      /-orum$/i,         // Latince genitif çoğul
      /-us$/i,           // Latince tekil erkek
      /-a$/i,            // Latince tekil dişi (ancak sadece bu değil)
      /^[A-Z][a-z]+ [a-z]+$/  // İki kelime, ilki büyük harfle (Latince taksonomik isim formatı)
    ];
    
    const englishPatterns = [
      /ing$/i,           // İngilizce -ing son eki
      /ed$/i,            // İngilizce geçmiş zaman
      /ly$/i,            // İngilizce zarf son eki
      /ness$/i,          // İngilizce isim son eki
      /\b(the|and|or|of|in|with|for|by)\b/i  // İngilizce yaygın kelimeler
    ];
    
    // İngilizce pattern kontrolü
    if (englishPatterns.some(pattern => pattern.test(text))) {
      return 'en';
    }
    
    // Latince pattern kontrolü
    if (latinPatterns.some(pattern => pattern.test(text))) {
      return 'la';
    }
    
    // Belirsiz durumda varsayılan olarak İngilizce döndür
    return 'en';
  };

  const translateWithGemini = async (text: string, fromLang: string, toLang: string): Promise<string | undefined> => {
    if (!apiKey) return;

    // Girilen metnin dilini tespit et
    const detectedLang = detectLanguage(text);
    
    // Eğer seçilen kaynak dil ile tespit edilen dil uyuşmuyorsa uyarı ver
    // Ancak "diabetes mellitus" gibi her iki dilde de aynı olan terimler için esnek ol
    const ambiguousTerms = ['diabetes mellitus', 'pneumonia', 'gastritis', 'tachycardia'];
    const isAmbiguous = ambiguousTerms.some(term => 
      text.toLowerCase().includes(term.toLowerCase())
    );
    
    if (!isAmbiguous && detectedLang !== fromLang) {
      const expectedLang = fromLang === 'la' ? 'Latin' : 'English';
      const detectedLangName = detectedLang === 'la' ? 'Latin' : 'English';
      throw new Error(`Please enter a ${expectedLang} term. The text appears to be in ${detectedLangName}.`);
    }

    const prompt = `Translate the following ${fromLang === 'la' ? 'Latin' : 'English'} medical term to ${toLang === 'la' ? 'Latin' : 'English'}:

"${text}"

Also, briefly include the word's etymology and historical background in 2-3 sentences.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error('Çeviri alınamadı');
      }
    } catch (error: unknown) {
      console.error('API hatası:', error);
      throw error;
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    if (!apiKey) return;

    setIsTranslating(true);
    setError('');

    try {
      const result = await translateWithGemini(sourceText, sourceLang, targetLang);
      // Düzeltilmiş regex pattern
      const [translationPart, ...historyParts] = result.split(/\n\n|\n(?=[A-Z])/);
      setTranslatedText(translationPart.trim());
      setWordHistory(historyParts.join("\n\n").trim());
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Çeviri başarısız.');
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

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error: unknown) {
      console.error('Kopyalama başarısız:', error);
    }
  };

  const speakText = (text: string, lang: string): void => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-US' : 'la';
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (sourceText.trim() && sourceText.length > 2 && apiKey) {
        handleTranslate();
      }
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [sourceText, sourceLang, targetLang]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full h-full">
        <div className="mx-2 mt-2 mb-4 p-6 rounded-2xl shadow-md bg-gradient-to-r from-blue-300 via-white-200 to-indigo-300 text-center relative">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-800 to-blue-600 tracking-wide drop-shadow-md">
            Quick Guide to Latin and English Medical Terms
          </h1>
          <p className="mt-2 text-base md:text-lg text-gray-700 font-medium">
            Understand the roots of modern medicine in both languages
          </p>
        </div>

        <div className="mx-2 grid grid-cols-1 lg:grid-cols-4 gap-4">
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

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
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

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 border-r border-gray-200">
                  <div className="flex items-center justify-between mb-4 h-12">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {languages.find(l => l.code === sourceLang)?.flag} {languages.find(l => l.code === sourceLang)?.name}
                    </h3>
                    {sourceLang !== targetLang && (
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Enter {sourceLang === 'la' ? 'Latin' : 'English'} only
                      </div>
                    )}
                  </div>
                  <textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder={`Enter ${sourceLang === 'la' ? 'Latin' : 'English'} medical term...`}
                    className="w-full h-64 p-4 text-lg border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4 h-12">
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
                  <div className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto">
                    {isTranslating ? (
                      <div className="flex items-center justify-center h-full text-blue-600 space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Translating...</span>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full text-red-500 space-x-2">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-center">{error}</span>
                      </div>
                    ) : (
                      <p className="text-lg text-gray-800 whitespace-pre-wrap">
                        {translatedText || 'Translation will appear here...'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t flex justify-center">
                <button
                  onClick={handleTranslate}
                  disabled={!sourceText.trim() || isTranslating || !apiKey}
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
                className="p-3 h-16 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center"
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