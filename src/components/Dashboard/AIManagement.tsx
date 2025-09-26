'use client';

import React, { useState } from 'react';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';

export default function AIManagement() {
  const { openInfo } = useInfoModal();
  const [activeTab, setActiveTab] = useState('content-generation');

  // Stati per Content Generation
  const [contentPrompt, setContentPrompt] = useState('');
  const [contentType, setContentType] = useState('blog-post');
  const [contentLength, setContentLength] = useState('medium');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Stati per SEO Optimization
  const [seoUrl, setSeoUrl] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Stati per Image Generation
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('realistic');
  const [imageSize, setImageSize] = useState('1024x1024');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Stati per Code Generation
  const [codePrompt, setCodePrompt] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Stati per Analytics AI
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isAnalyzingData, setIsAnalyzingData] = useState(false);

  const tabs = [
    { id: 'content-generation', name: '🤖 Generazione Contenuti', icon: '📝' },
    { id: 'seo-optimization', name: '🔍 SEO & Ottimizzazione', icon: '📈' },
    { id: 'image-generation', name: '🎨 Generazione Immagini', icon: '🖼️' },
    { id: 'code-generation', name: '💻 Generazione Codice', icon: '⚡' },
    { id: 'analytics-ai', name: '📊 Analytics AI', icon: '🧠' },
    { id: 'integrations', name: '🔗 Integrazioni', icon: '⚙️' }
  ];

  const contentTypes = [
    { value: 'blog-post', label: '📝 Blog Post' },
    { value: 'article', label: '📄 Articolo' },
    { value: 'social-media', label: '📱 Social Media' },
    { value: 'email', label: '📧 Email' },
    { value: 'product-description', label: '🛍️ Descrizione Prodotto' },
    { value: 'landing-page', label: '🏠 Landing Page' },
    { value: 'press-release', label: '📰 Press Release' },
    { value: 'technical-doc', label: '📚 Documentazione Tecnica' }
  ];

  const contentLengths = [
    { value: 'short', label: 'Breve (100-300 parole)' },
    { value: 'medium', label: 'Medio (300-800 parole)' },
    { value: 'long', label: 'Lungo (800+ parole)' }
  ];

  const imageStyles = [
    { value: 'realistic', label: '🎭 Realistico' },
    { value: 'cartoon', label: '🎨 Cartoon' },
    { value: 'minimalist', label: '⚪ Minimalista' },
    { value: 'vintage', label: '📸 Vintage' },
    { value: 'modern', label: '✨ Moderno' },
    { value: 'abstract', label: '🌀 Astratto' }
  ];

  const codeLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'react', label: 'React' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'css', label: 'CSS' },
    { value: 'html', label: 'HTML' },
    { value: 'sql', label: 'SQL' }
  ];

  const handleContentGeneration = async () => {
    setIsGenerating(true);
    // Simulazione generazione contenuto
    setTimeout(() => {
      setGeneratedContent(`
# ${contentPrompt}

## Introduzione
Questo è un contenuto generato automaticamente basato sul prompt: "${contentPrompt}".

## Contenuto Principale
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Conclusione
Questo contenuto è stato generato utilizzando l'AI per ottimizzare la produttività e la qualità dei contenuti.

---
*Generato automaticamente - ${new Date().toLocaleString()}*
      `);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSEOAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulazione analisi SEO
    setTimeout(() => {
      setSeoAnalysis({
        score: 85,
        suggestions: [
          'Aggiungi più parole chiave nel titolo',
          'Ottimizza la meta description',
          'Includi immagini con alt text',
          'Migliora la velocità di caricamento'
        ],
        keywords: seoKeywords.split(',').map(k => k.trim()),
        readability: 'Buona',
        mobileFriendly: true
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleImageGeneration = async () => {
    setIsGeneratingImage(true);
    // Simulazione generazione immagine
    setTimeout(() => {
      setGeneratedImages([
        'https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=Generated+Image+1',
        'https://via.placeholder.com/1024x1024/7C3AED/FFFFFF?text=Generated+Image+2'
      ]);
      setIsGeneratingImage(false);
    }, 3000);
  };

  const handleCodeGeneration = async () => {
    setIsGeneratingCode(true);
    // Simulazione generazione codice
    setTimeout(() => {
      setGeneratedCode(`
// Codice generato per: ${codePrompt}
function ${codePrompt.toLowerCase().replace(/\s+/g, '_')}() {
  // Implementazione generata automaticamente
  console.log('Funzione generata con AI');
  
  return {
    success: true,
    message: 'Codice generato con successo'
  };
}

// Esempio di utilizzo
const result = ${codePrompt.toLowerCase().replace(/\s+/g, '_')}();
console.log(result);
      `);
      setIsGeneratingCode(false);
    }, 2000);
  };

  const handleAnalyticsAnalysis = async () => {
    setIsAnalyzingData(true);
    // Simulazione analisi dati
    setTimeout(() => {
      setAiInsights([
        '📈 Il traffico è aumentato del 25% questa settimana',
        '🎯 Le conversioni sono migliorate del 15%',
        '📱 Il 60% del traffico proviene da mobile',
        '⏰ Il picco di traffico è alle 14:00',
        '🔍 Le parole chiave più performanti sono: "dashboard", "business plan"'
      ]);
      setIsAnalyzingData(false);
    }, 2500);
  };

  const renderContentGeneration = () => (
    <div className="space-y-6">
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 Generazione Contenuti AI</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo di Contenuto
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lunghezza
            </label>
            <select
              value={contentLength}
              onChange={(e) => setContentLength(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
            >
              {contentLengths.map(length => (
                <option key={length.value} value={length.value}>{length.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt per la Generazione
          </label>
          <textarea
            value={contentPrompt}
            onChange={(e) => setContentPrompt(e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
            placeholder="Descrivi il contenuto che vuoi generare... (es. 'Articolo su come ottimizzare la produttività aziendale')"
          />
        </div>
        
        <button
          onClick={handleContentGeneration}
          disabled={!contentPrompt || isGenerating}
          className={`mt-4 px-6 py-3 rounded-lg font-medium transition-colors ${
            !contentPrompt || isGenerating
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isGenerating ? '⏳ Generando...' : '🚀 Genera Contenuto'}
        </button>
      </div>
      
      {generatedContent && (
        <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Contenuto Generato</h3>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg border">
              {generatedContent}
            </pre>
          </div>
          <div className="mt-4 flex space-x-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              ✅ Approva
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
              ✏️ Modifica
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              📋 Copia
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSEOOptimization = () => (
    <div className="space-y-6">
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 SEO & Ottimizzazione</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Analizzare
            </label>
            <input
              type="url"
              value={seoUrl}
              onChange={(e) => setSeoUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
              placeholder="https://example.com/page"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parole Chiave Target
            </label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
              placeholder="dashboard, business plan, management"
            />
          </div>
        </div>
        
        <button
          onClick={handleSEOAnalysis}
          disabled={!seoUrl || isAnalyzing}
          className={`mt-6 px-6 py-3 rounded-lg font-medium transition-colors ${
            !seoUrl || isAnalyzing
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isAnalyzing ? '⏳ Analizzando...' : '🔍 Analizza SEO'}
        </button>
      </div>
      
      {seoAnalysis && (
        <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Risultati Analisi SEO</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{seoAnalysis.score}</div>
              <div className="text-sm text-gray-600">SEO Score</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{seoAnalysis.readability}</div>
              <div className="text-sm text-gray-600">Leggibilità</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {seoAnalysis.mobileFriendly ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600">Mobile Friendly</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">💡 Suggerimenti per il Miglioramento</h4>
            <ul className="space-y-2">
              {seoAnalysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderImageGeneration = () => (
    <div className="space-y-6">
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Generazione Immagini AI</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stile Immagine
            </label>
            <select
              value={imageStyle}
              onChange={(e) => setImageStyle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
            >
              {imageStyles.map(style => (
                <option key={style.value} value={style.value}>{style.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensione
            </label>
            <select
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
            >
              <option value="512x512">512x512</option>
              <option value="1024x1024">1024x1024</option>
              <option value="1024x1792">1024x1792</option>
              <option value="1792x1024">1792x1024</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione Immagine
          </label>
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
            placeholder="Descrivi l'immagine che vuoi generare... (es. 'Un ufficio moderno con dashboard digitale')"
          />
        </div>
        
        <button
          onClick={handleImageGeneration}
          disabled={!imagePrompt || isGeneratingImage}
          className={`mt-4 px-6 py-3 rounded-lg font-medium transition-colors ${
            !imagePrompt || isGeneratingImage
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isGeneratingImage ? '⏳ Generando...' : '🎨 Genera Immagini'}
        </button>
      </div>
      
      {generatedImages.length > 0 && (
        <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Immagini Generate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button className="px-3 py-1 bg-white/30 backdrop-blurbg-opacity-90 rounded text-sm hover:bg-opacity-100">
                    📥 Download
                  </button>
                  <button className="px-3 py-1 bg-white/30 backdrop-blurbg-opacity-90 rounded text-sm hover:bg-opacity-100">
                    ✏️ Modifica
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCodeGeneration = () => (
    <div className="space-y-6">
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💻 Generazione Codice AI</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Linguaggio
            </label>
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
            >
              {codeLanguages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo di Codice
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur">
              <option value="function">Funzione</option>
              <option value="component">Componente</option>
              <option value="class">Classe</option>
              <option value="hook">Hook</option>
              <option value="api">API Endpoint</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione del Codice
          </label>
          <textarea
            value={codePrompt}
            onChange={(e) => setCodePrompt(e.target.value)}
            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
            placeholder="Descrivi il codice che vuoi generare... (es. 'Funzione per calcolare il ROI di un progetto')"
          />
        </div>
        
        <button
          onClick={handleCodeGeneration}
          disabled={!codePrompt || isGeneratingCode}
          className={`mt-4 px-6 py-3 rounded-lg font-medium transition-colors ${
            !codePrompt || isGeneratingCode
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isGeneratingCode ? '⏳ Generando...' : '⚡ Genera Codice'}
        </button>
      </div>
      
      {generatedCode && (
        <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💻 Codice Generato</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <code>{generatedCode}</code>
          </pre>
          <div className="mt-4 flex space-x-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              ✅ Approva
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
              ✏️ Modifica
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              📋 Copia
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalyticsAI = () => (
    <div className="space-y-6">
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Analytics AI</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periodo di Analisi
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur">
              <option value="7d">Ultimi 7 giorni</option>
              <option value="30d">Ultimi 30 giorni</option>
              <option value="90d">Ultimi 90 giorni</option>
              <option value="1y">Ultimo anno</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo di Analisi
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur">
              <option value="traffic">Traffico Web</option>
              <option value="conversions">Conversioni</option>
              <option value="performance">Performance</option>
              <option value="user-behavior">Comportamento Utenti</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleAnalyticsAnalysis}
          disabled={isAnalyzingData}
          className={`mt-6 px-6 py-3 rounded-lg font-medium transition-colors ${
            isAnalyzingData
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          {isAnalyzingData ? '⏳ Analizzando...' : '🧠 Analizza con AI'}
        </button>
      </div>
      
      {aiInsights.length > 0 && (
        <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 Insights AI</h3>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-blue-500 mt-1">💡</span>
                <span className="text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Integrazioni AI</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* OpenAI */}
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">AI</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">OpenAI</h4>
                <p className="text-sm text-gray-500">GPT-4, DALL-E</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Integrazione con OpenAI per generazione contenuti, immagini e analisi avanzate.
            </p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              🔗 Connetti
            </button>
          </div>
          
          {/* Google AI */}
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">G</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Google AI</h4>
                <p className="text-sm text-gray-500">Gemini, Bard</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Accesso alle API Google AI per analisi e generazione contenuti.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              🔗 Connetti
            </button>
          </div>
          
          {/* Anthropic */}
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">A</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Anthropic</h4>
                <p className="text-sm text-gray-500">Claude</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Integrazione con Claude per analisi avanzate e assistenza intelligente.
            </p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              🔗 Connetti
            </button>
          </div>
          
          {/* Midjourney */}
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-pink-600 font-bold">MJ</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Midjourney</h4>
                <p className="text-sm text-gray-500">Generazione Immagini</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Generazione di immagini artistiche e creative di alta qualità.
            </p>
            <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
              🔗 Connetti
            </button>
          </div>
          
          {/* GitHub Copilot */}
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-bold">GH</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">GitHub Copilot</h4>
                <p className="text-sm text-gray-500">Assistente Codice</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Assistente AI per la generazione e completamento del codice.
            </p>
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              🔗 Connetti
            </button>
          </div>
          
          {/* Custom AI */}
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-bold">+</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Custom AI</h4>
                <p className="text-sm text-gray-500">API Personalizzate</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Integra le tue API AI personalizzate o modelli custom.
            </p>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              🔗 Connetti
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Configurazione API</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
              placeholder="sk-..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google AI API Key
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/30 backdrop-blur"
              placeholder="AIza..."
            />
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            💾 Salva Configurazione
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🤖 AI Management</h1>
            <p className="text-gray-600 mt-1">
              Generazione contenuti, SEO, immagini e analisi intelligenti
            </p>
          </div>
          <InfoButton
            onClick={() => openInfo('AI Management', 'Gestione delle integrazioni AI per automatizzare i processi aziendali')}
            className="text-blue-600 hover:text-blue-700"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'content-generation' && renderContentGeneration()}
          {activeTab === 'seo-optimization' && renderSEOOptimization()}
          {activeTab === 'image-generation' && renderImageGeneration()}
          {activeTab === 'code-generation' && renderCodeGeneration()}
          {activeTab === 'analytics-ai' && renderAnalyticsAI()}
          {activeTab === 'integrations' && renderIntegrations()}
        </div>
      </div>
    </div>
  );
}
