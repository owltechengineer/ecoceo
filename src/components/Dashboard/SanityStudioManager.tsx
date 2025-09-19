'use client';

import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';

export default function SanityStudioManager() {
  const { openInfo } = useInfoModal();
  const studioLinks = [
    {
      title: '📝 Servizi',
      description: 'Gestisci servizi e prezzi',
      url: '/studio/desk/service',
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: '📋 Progetti',
      description: 'Gestisci progetti e clienti',
      url: '/studio/desk/project',
      color: 'from-green-600 to-green-700'
    },
    {
      title: '📄 Post',
      description: 'Gestisci blog e contenuti',
      url: '/studio/desk/post',
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: '🛍️ Prodotti',
      description: 'Gestisci catalogo prodotti',
      url: '/studio/desk/product',
      color: 'from-orange-600 to-orange-700'
    },
    {
      title: '⚙️ Impostazioni',
      description: 'Configurazione sito',
      url: '/studio/desk/siteSettings',
      color: 'from-gray-600 to-gray-700'
    },
    {
      title: '🏠 Homepage',
      description: 'Gestisci sezioni homepage',
      url: '/studio/desk/hero',
      color: 'from-pink-600 to-pink-700'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">🎛️ Sanity Studio</h3>
            <p className="text-sm text-gray-600">
              Accesso rapido alle sezioni di Sanity CMS
            </p>
          </div>
          <InfoButton onClick={() => openInfo(dashboardInfo.sanityStudio.title, dashboardInfo.sanityStudio.content)} />
        </div>
        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          🚀 Apri Studio
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studioLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-gradient-to-r ${link.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105`}
          >
            <div className="text-lg font-semibold mb-1">{link.title}</div>
            <div className="text-sm opacity-90">{link.description}</div>
          </a>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Suggerimenti per l'uso:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• <strong>Servizi:</strong> Aggiungi dati finanziari (prezzo, costi, ore vendute)</li>
          <li>• <strong>Progetti:</strong> Assegna servizi e aggiungi budget/costi</li>
          <li>• <strong>Dopo modifiche:</strong> Usa "Sincronizza" nella dashboard per aggiornare i dati</li>
          <li>• <strong>Pubblicazione:</strong> I cambiamenti si riflettono immediatamente sul sito</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>🔗 Collegamenti Rapidi:</strong> Clicca su qualsiasi sezione per aprire direttamente 
          quella parte di Sanity Studio in una nuova finestra.
        </p>
      </div>
    </div>
  );
}
