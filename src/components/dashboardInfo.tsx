import React from 'react';

export const dashboardInfo = {
  overview: {
    title: "📊 Panoramica Dashboard",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            La dashboard fornisce una visione completa dell'azienda con KPI, statistiche e accesso rapido a tutte le funzioni.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📈 KPI Principali</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Progetti Attivi:</strong> Numero di progetti in corso</li>
            <li>• <strong>ROI Medio:</strong> Ritorno sull'investimento medio</li>
            <li>• <strong>Fatturato Totale:</strong> Somma di tutti i ricavi</li>
            <li>• <strong>Lead Attivi:</strong> Contatti commerciali in gestione</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🔄 Aggiornamento Dati</h3>
          <p className="text-gray-700">
            I dati si aggiornano automaticamente quando aggiungi o modifichi elementi nelle altre sezioni.
          </p>
        </div>
      </div>
    )
  },

  projects: {
    title: "🚀 Gestione Progetti",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Gestisci progetti completi con budget, team, obiettivi, milestone e gestione rischi.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📊 Funzionalità Principali</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Panoramica Progetto:</strong> Vista completa con progresso e metriche</li>
            <li>• <strong>Obiettivi:</strong> Gestione goal, milestone, deliverable e KPI</li>
            <li>• <strong>Budget:</strong> Tracciamento costi per categoria e fornitore</li>
            <li>• <strong>Team:</strong> Gestione membri, ruoli e allocazione risorse</li>
            <li>• <strong>Milestone:</strong> Timeline e fasi del progetto</li>
            <li>• <strong>Rischi:</strong> Identificazione e gestione rischi</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">➕ Creazione Progetti</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Nuovo Progetto:</strong> Crea direttamente nella dashboard</li>
            <li>• <strong>Template:</strong> Usa template predefiniti per categorie</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📊 Campi Principali</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Nome:</strong> Titolo del progetto</li>
            <li>• <strong>Budget:</strong> Budget pianificato</li>
            <li>• <strong>Costo Effettivo:</strong> Costi reali sostenuti</li>
            <li>• <strong>Ricavo Atteso:</strong> Fatturato previsto</li>
            <li>• <strong>Progresso:</strong> Percentuale di completamento (0-100%)</li>
            <li>• <strong>Stato:</strong> Attivo, Completato, In Pausa, Annullato</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🧮 Calcoli Automatici</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>ROI:</strong> (Ricavo - Costo) / Costo × 100</li>
            <li>• <strong>Margine:</strong> Ricavo - Costo</li>
            <li>• <strong>Varianza:</strong> Budget - Costo Effettivo</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">⚡ Azioni Rapide</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Modifica:</strong> Aggiorna dati del progetto</li>
            <li>• <strong>Elimina:</strong> Rimuovi progetto (irreversibile)</li>
          </ul>
        </div>
      </div>
    )
  },

  financial: {
    title: "💰 Gestione Finanziaria",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Gestisci servizi, budget e investimenti con calcoli automatici di margini e ROI.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🛠️ Servizi</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Nome:</strong> Nome del servizio offerto</li>
            <li>• <strong>Prezzo:</strong> Prezzo di vendita</li>
            <li>• <strong>Costo:</strong> Costo di produzione</li>
            <li>• <strong>Ore Vendute:</strong> Ore fatturate</li>
            <li>• <strong>Calcoli:</strong> Ricavo = Prezzo × Ore, Margine = Ricavo - Costo</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📊 Budget</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Periodo:</strong> Anno di riferimento</li>
            <li>• <strong>Budget Pianificato:</strong> Importo previsto</li>
            <li>• <strong>Spesa Effettiva:</strong> Importo speso</li>
            <li>• <strong>Calcoli:</strong> Varianza = Pianificato - Effettivo</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">💼 Investimenti</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Nome:</strong> Descrizione investimento</li>
            <li>• <strong>Importo:</strong> Capitale investito</li>
            <li>• <strong>Ritorno Atteso:</strong> Guadagno previsto</li>
            <li>• <strong>Calcoli:</strong> ROI = (Ritorno - Importo) / Importo × 100</li>
          </ul>
        </div>
      </div>
    )
  },

  rd: {
    title: "🔬 Gestione R&D",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Gestisci progetti di ricerca e sviluppo con budget, progresso e risultati.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📋 Campi Progetto R&D</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Nome:</strong> Titolo del progetto R&D</li>
            <li>• <strong>Descrizione:</strong> Obiettivi e dettagli</li>
            <li>• <strong>Budget:</strong> Fondi allocati</li>
            <li>• <strong>Costo Effettivo:</strong> Spese sostenute</li>
            <li>• <strong>Progresso:</strong> Percentuale completamento</li>
            <li>• <strong>Stato:</strong> In Corso, Completato, Sospeso</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📊 Metriche</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>ROI:</strong> Ritorno sull'investimento in R&D</li>
            <li>• <strong>Varianza:</strong> Differenza budget vs costi reali</li>
            <li>• <strong>Efficienza:</strong> Progresso vs spesa</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">💡 Benefici</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• Tracciamento costi di innovazione</li>
            <li>• Valutazione efficacia progetti R&D</li>
            <li>• Pianificazione budget futuri</li>
            <li>• Analisi ROI innovazione</li>
          </ul>
        </div>
      </div>
    )
  },

  marketing: {
    title: "📢 Gestione Marketing",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Gestisci campagne marketing e lead con metriche di conversione e ROI.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📢 Campagne Marketing</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Nome:</strong> Titolo della campagna</li>
            <li>• <strong>Canale:</strong> Social, Email, Ads, Eventi</li>
            <li>• <strong>Budget:</strong> Fondi allocati</li>
            <li>• <strong>Costo Effettivo:</strong> Spese sostenute</li>
            <li>• <strong>Lead Generati:</strong> Contatti ottenuti</li>
            <li>• <strong>Conversioni:</strong> Lead convertiti in clienti</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">👥 Gestione Lead</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Nome:</strong> Nome del contatto</li>
            <li>• <strong>Email:</strong> Indirizzo email</li>
            <li>• <strong>Telefono:</strong> Numero di contatto</li>
            <li>• <strong>Fonte:</strong> Come ha trovato l'azienda</li>
            <li>• <strong>Stato:</strong> Nuovo, Contattato, Qualificato, Cliente</li>
            <li>• <strong>Valore:</strong> Potenziale valore del lead</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📊 Metriche Automatiche</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>CAC:</strong> Costo di acquisizione cliente</li>
            <li>• <strong>LTV:</strong> Lifetime value del cliente</li>
            <li>• <strong>LTV/CAC:</strong> Rapporto valore/costo cliente</li>
            <li>• <strong>Tasso Conversione:</strong> Lead → Clienti</li>
          </ul>
        </div>
      </div>
    )
  },

  sanityStudio: {
    title: "🎛️ Sanity Studio Manager",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Accesso rapido a tutte le sezioni di Sanity CMS per gestione avanzata di contenuti.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📝 Sezioni Disponibili</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Servizi:</strong> Gestisci servizi e prezzi</li>
            <li>• <strong>Progetti:</strong> Gestisci progetti e clienti</li>
            <li>• <strong>Post:</strong> Gestisci blog e contenuti</li>
            <li>• <strong>Prodotti:</strong> Gestisci catalogo prodotti</li>
            <li>• <strong>Impostazioni:</strong> Configurazione sito</li>
            <li>• <strong>Homepage:</strong> Gestisci sezioni homepage</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🚀 Vantaggi</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Accesso Rapido:</strong> Apertura diretta alle sezioni</li>
            <li>• <strong>Gestione Avanzata:</strong> Funzionalità complete di Sanity</li>
            <li>• <strong>Sincronizzazione:</strong> Dati immediatamente disponibili</li>
            <li>• <strong>Pubblicazione:</strong> Cambiamenti live sul sito</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">💡 Suggerimenti</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• Aggiungi dati finanziari ai servizi</li>
            <li>• Assegna servizi ai progetti</li>
            <li>• Sincronizza dopo modifiche</li>
            <li>• Usa per contenuti complessi</li>
          </ul>
        </div>
      </div>
    )
  },

  sanitySync: {
    title: "🔄 Sincronizzazione Sanity",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Carica dati da Sanity CMS nella dashboard per analisi e gestione integrata.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📥 Cosa Sincronizza</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Servizi:</strong> Nome, prezzo, costi, ore vendute</li>
            <li>• <strong>Progetti:</strong> Titolo, budget, costi, ricavi, progresso</li>
            <li>• <strong>Statistiche:</strong> Conteggi e totali aggregati</li>
            <li>• <strong>Relazioni:</strong> Progetti assegnati ai servizi</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">⚡ Come Funziona</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Clicca "Sincronizza":</strong> Avvia il processo</li>
            <li>• <strong>Caricamento:</strong> Recupera dati da Sanity</li>
            <li>• <strong>Conversione:</strong> Adatta formato dashboard</li>
            <li>• <strong>Aggiornamento:</strong> Sostituisce dati esistenti</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">⚠️ Attenzione</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• I dati della dashboard vengono sovrascritti</li>
            <li>• Usa dopo modifiche in Sanity Studio</li>
            <li>• Mantieni backup se necessario</li>
            <li>• Verifica sempre i dati dopo sincronizzazione</li>
          </ul>
        </div>
      </div>
    )
  },

  sanityStats: {
    title: "📊 Statistiche Sanity",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Visualizza statistiche aggregate dei dati presenti in Sanity CMS.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📈 Metriche Mostrate</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Servizi Totali:</strong> Numero servizi attivi</li>
            <li>• <strong>Progetti Totali:</strong> Numero progetti attivi</li>
            <li>• <strong>Progetti Attivi:</strong> Progetti in corso</li>
            <li>• <strong>Progetti Completati:</strong> Progetti finiti</li>
            <li>• <strong>Budget Totale:</strong> Somma budget progetti</li>
            <li>• <strong>Ricavi Totali:</strong> Somma ricavi progetti</li>
            <li>• <strong>Profitto:</strong> Ricavi - Costi totali</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🔄 Aggiornamento</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Automatico:</strong> Si aggiorna al caricamento</li>
            <li>• <strong>Manuale:</strong> Pulsante "Aggiorna"</li>
            <li>• <strong>Tempo Reale:</strong> Riflette dati Sanity attuali</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">💡 Utilizzo</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• Monitoraggio performance aziendale</li>
            <li>• Confronto con obiettivi</li>
            <li>• Analisi trend temporali</li>
            <li>• Reporting executive</li>
          </ul>
        </div>
      </div>
    )
  },

  serviceAssignment: {
    title: "🔗 Assegnazione Servizi",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Assegna progetti ai servizi di Sanity CMS per organizzazione e classificazione.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🔧 Come Assegnare</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Seleziona Progetto:</strong> Dal dropdown progetti</li>
            <li>• <strong>Seleziona Servizio:</strong> Dal dropdown servizi</li>
            <li>• <strong>Clicca "Assegna":</strong> Conferma l'assegnazione</li>
            <li>• <strong>Aggiornamento:</strong> Modifica salvata in Sanity</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📊 Visualizzazione</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Tabella Progetti:</strong> Tutti i progetti con servizi</li>
            <li>• <strong>Stato Assegnazione:</strong> Badge colorati</li>
            <li>• <strong>Link Modifica:</strong> Apertura diretta Sanity Studio</li>
            <li>• <strong>Aggiornamento:</strong> Pulsante per ricaricare dati</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">💡 Benefici</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• Organizzazione progetti per servizio</li>
            <li>• Analisi performance per categoria</li>
            <li>• Gestione clienti per servizio</li>
            <li>• Reporting segmentato</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">⚠️ Note</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• Le modifiche sono permanenti in Sanity</li>
            <li>• Sincronizza dashboard dopo assegnazioni</li>
            <li>• Un progetto può avere un solo servizio</li>
            <li>• Assegnazione reversibile</li>
          </ul>
        </div>
      </div>
    )
  },

  aiManagement: {
    title: "🤖 AI Management",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Sezione dedicata all'integrazione di AI per generazione contenuti, SEO, immagini e analisi intelligenti.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🤖 Funzionalità AI</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Generazione Contenuti:</strong> Blog post, articoli, social media, email</li>
            <li>• <strong>SEO & Ottimizzazione:</strong> Analisi SEO, suggerimenti, ottimizzazione</li>
            <li>• <strong>Generazione Immagini:</strong> Immagini AI per contenuti e marketing</li>
            <li>• <strong>Generazione Codice:</strong> Funzioni, componenti, API</li>
            <li>• <strong>Analytics AI:</strong> Insights intelligenti sui dati</li>
            <li>• <strong>Integrazioni:</strong> OpenAI, Google AI, Anthropic, Midjourney</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🔗 Integrazioni Supportate</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>OpenAI:</strong> GPT-4, DALL-E per contenuti e immagini</li>
            <li>• <strong>Google AI:</strong> Gemini, Bard per analisi avanzate</li>
            <li>• <strong>Anthropic:</strong> Claude per assistenza intelligente</li>
            <li>• <strong>Midjourney:</strong> Generazione immagini artistiche</li>
            <li>• <strong>GitHub Copilot:</strong> Assistente per il codice</li>
            <li>• <strong>Custom AI:</strong> API personalizzate e modelli custom</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">⚙️ Configurazione</h3>
          <p className="text-gray-700">
            Configura le API keys nelle integrazioni per abilitare le funzionalità AI. Tutti i dati generati possono essere salvati e utilizzati nella dashboard.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🚀 Prossimi Sviluppi</h3>
          <p className="text-gray-700">
            Questa sezione è progettata per essere facilmente estendibile con nuove integrazioni AI e funzionalità avanzate.
          </p>
        </div>
      </div>
    )
  },

  'unified-task-calendar': {
    title: "📅 Task & Calendario Unificato",
    content: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🎯 Scopo</h3>
          <p className="text-gray-700">
            Interfaccia unificata per gestire task e appuntamenti con visualizzazioni moderne e intuitive.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📋 Task Management</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Tabella Completa:</strong> Visualizzazione tabellare con filtri avanzati</li>
            <li>• <strong>Stati e Priorità:</strong> Gestione completa stati e priorità task</li>
            <li>• <strong>Progresso:</strong> Barre di progresso e tracking ore</li>
            <li>• <strong>Filtri:</strong> Per stato, priorità, assegnatario, ricerca</li>
            <li>• <strong>Azioni Rapide:</strong> Completamento, modifica, eliminazione</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📅 Calendario</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Vista Mensile:</strong> Calendario tradizionale con appuntamenti</li>
            <li>• <strong>Vista Settimanale:</strong> Dettaglio settimana</li>
            <li>• <strong>Vista Giornaliera:</strong> Focus su singolo giorno</li>
            <li>• <strong>Appuntamenti:</strong> Creazione, modifica, eliminazione</li>
            <li>• <strong>Tipi Meeting:</strong> Meeting, chiamate, presentazioni, workshop</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">🔄 Vista Unificata</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• <strong>Panoramica:</strong> Task recenti e appuntamenti del giorno</li>
            <li>• <strong>Quick Access:</strong> Accesso rapido alle sezioni principali</li>
            <li>• <strong>Summary:</strong> Riepilogo attività in corso</li>
            <li>• <strong>Navigation:</strong> Navigazione fluida tra le viste</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">💾 Database Integration</h3>
          <p className="text-gray-700">
            Tutti i dati sono salvati nel database Supabase con tabelle dedicate per tasks, appointments, time_entries e weekly_plans.
          </p>
        </div>
      </div>
    )
  }
};
