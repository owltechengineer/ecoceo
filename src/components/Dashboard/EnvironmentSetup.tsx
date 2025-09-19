'use client';

import { useState } from 'react';

export default function EnvironmentSetup() {
  const [showInstructions, setShowInstructions] = useState(false);

  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Sanity CMS (se utilizzato)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03

# AI Integrations (opzionali)
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-key-here
NEXT_PUBLIC_GOOGLE_AI_API_KEY=AIza-your-google-ai-key-here
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Dashboard Aziendale`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    alert('Template copiato negli appunti!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">⚙️ Configurazione Ambiente</h3>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
        >
          {showInstructions ? 'Nascondi' : 'Mostra'} Istruzioni
        </button>
      </div>

      {showInstructions && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Passaggi per la configurazione:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Crea un file <code className="bg-blue-100 px-1 rounded">.env.local</code> nella root del progetto</li>
              <li>Copia il template qui sotto nel file</li>
              <li>Sostituisci i valori placeholder con i tuoi dati reali</li>
              <li>Riavvia il server di sviluppo</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Importante:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
              <li>Il file <code className="bg-yellow-100 px-1 rounded">.env.local</code> non deve essere committato su Git</li>
              <li>Le variabili <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_*</code> sono visibili nel browser</li>
              <li>Non condividere mai le tue chiavi API</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🔑 Come ottenere le chiavi Supabase:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Vai su <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
              <li>Crea un nuovo progetto o seleziona un progetto esistente</li>
              <li>Vai su Settings → API</li>
              <li>Copia l'URL del progetto e la chiave anonima</li>
              <li>Incolla i valori nel file .env.local</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">✅ Template .env.local:</h4>
            <div className="relative">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                {envTemplate}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
              >
                Copia
              </button>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">🚨 Risoluzione problemi comuni:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
              <li><strong>Errore "Invalid API key":</strong> Verifica che la chiave Supabase sia corretta</li>
              <li><strong>Errore "relation does not exist":</strong> Le tabelle non esistono, vai alla sezione "Setup Database"</li>
              <li><strong>Errore di connessione:</strong> Verifica l'URL di Supabase e la connessione internet</li>
              <li><strong>Permessi negati:</strong> Controlla le policy RLS nel database Supabase</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
