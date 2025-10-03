'use client';

import { useState } from 'react';
import {
  loadQuotes,
  loadQuoteItems,
  saveQuote,
  saveQuoteItem,
  updateQuote,
  deleteQuote,
  Quote,
  QuoteItem
} from '@/lib/supabase';

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
}

export default function QuotesTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string>('');

  const runTests = async () => {
    setIsLoading(true);
    setError('');
    setResults([]);

    const testResults: TestResult[] = [];

    try {
      // Test 1: Carica preventivi esistenti
      try {
        const quotes = await loadQuotes();
        testResults.push({
          test: 'Carica Preventivi',
          success: true,
          message: `Caricati ${quotes.length} preventivi`,
          data: quotes.slice(0, 2) // Mostra solo i primi 2
        });
      } catch (err: any) {
        testResults.push({
          test: 'Carica Preventivi',
          success: false,
          message: `Errore: ${err.message}`,
          data: err
        });
      }

      // Test 2: Crea nuovo preventivo
      try {
        const newQuote: Omit<Quote, 'id' | 'created_at' | 'updated_at'> = {
          user_id: 'default-user',
          client_name: 'Cliente Test Preventivo',
          client_email: 'test-quote@example.com',
          client_address: 'Via Test Preventivo 123',
          language: 'it',
          subtotal: 200.00,
          tax: 44.00,
          total: 244.00,
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Preventivo di test per verificare il funzionamento',
          status: 'draft'
        };

        const savedQuote = await saveQuote(newQuote);
        testResults.push({
          test: 'Crea Preventivo',
          success: true,
          message: `Preventivo creato: ${savedQuote.client_name}`,
          data: savedQuote
        });

        // Test 3: Aggiungi articoli al preventivo
        try {
          const quoteItem1: Omit<QuoteItem, 'id' | 'created_at' | 'updated_at'> = {
            quote_id: savedQuote.id,
            name: 'Articolo Test 1',
            description: 'Descrizione articolo test 1',
            quantity: 2,
            unit_price: 50.00,
            total: 100.00
          };

          const quoteItem2: Omit<QuoteItem, 'id' | 'created_at' | 'updated_at'> = {
            quote_id: savedQuote.id,
            name: 'Articolo Test 2',
            description: 'Descrizione articolo test 2',
            quantity: 1,
            unit_price: 100.00,
            total: 100.00
          };

          const [savedItem1, savedItem2] = await Promise.all([
            saveQuoteItem(quoteItem1),
            saveQuoteItem(quoteItem2)
          ]);

          testResults.push({
            test: 'Aggiungi Articoli',
            success: true,
            message: `Aggiunti 2 articoli al preventivo`,
            data: [savedItem1, savedItem2]
          });
        } catch (err: any) {
          testResults.push({
            test: 'Aggiungi Articoli',
            success: false,
            message: `Errore: ${err.message}`,
            data: err
          });
        }

        // Test 4: Aggiorna preventivo
        try {
          const updatedQuote = await updateQuote(savedQuote.id, {
            status: 'sent',
            notes: 'Preventivo aggiornato via test'
          });

          testResults.push({
            test: 'Aggiorna Preventivo',
            success: true,
            message: `Preventivo aggiornato: ${updatedQuote.status}`,
            data: updatedQuote
          });
        } catch (err: any) {
          testResults.push({
            test: 'Aggiorna Preventivo',
            success: false,
            message: `Errore: ${err.message}`,
            data: err
          });
        }

        // Test 5: Carica articoli del preventivo
        try {
          const items = await loadQuoteItems(savedQuote.id);
          testResults.push({
            test: 'Carica Articoli Preventivo',
            success: true,
            message: `Caricati ${items.length} articoli`,
            data: items
          });
        } catch (err: any) {
          testResults.push({
            test: 'Carica Articoli Preventivo',
            success: false,
            message: `Errore: ${err.message}`,
            data: err
          });
        }

        // Test 6: Elimina preventivo (opzionale)
        try {
          await deleteQuote(savedQuote.id);
          testResults.push({
            test: 'Elimina Preventivo',
            success: true,
            message: `Preventivo eliminato: ${savedQuote.client_name}`,
            data: { id: savedQuote.id }
          });
        } catch (err: any) {
          testResults.push({
            test: 'Elimina Preventivo',
            success: false,
            message: `Errore: ${err.message}`,
            data: err
          });
        }

      } catch (err: any) {
        testResults.push({
          test: 'Crea Preventivo',
          success: false,
          message: `Errore: ${err.message}`,
          data: err
        });
      }

    } catch (err: any) {
      setError(`Errore generale: ${err.message}`);
    } finally {
      setResults(testResults);
      setIsLoading(false);
    }
  };

  const getStatusIcon = (result: TestResult) => {
    return result.success ? '✅' : '❌';
  };

  const getStatusColor = (result: TestResult) => {
    return result.success ? 'text-green-800' : 'text-red-800';
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📋 Test Preventivi</h3>
        <button
          onClick={runTests}
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Test in corso...' : 'Esegui Test'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Errore:</strong> {error}
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Risultati Test:</h4>
          <div className="space-y-1">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span className="text-sm font-medium text-gray-700">
                  {result.test}
                </span>
                <div className="flex items-center space-x-2">
                  <span>{getStatusIcon(result)}</span>
                  <span className={`text-sm ${getStatusColor(result)}`}>
                    {result.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h5 className="font-medium text-blue-900 mb-2">Dettagli Dati:</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {results
              .filter(r => r.success && r.data)
              .map((result, index) => (
                <div key={index} className="text-sm">
                  <strong>{result.test}:</strong>
                  <pre className="ml-4 mt-1 text-gray-600 text-xs overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Note:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>✅ = Test completato con successo</li>
          <li>❌ = Test fallito</li>
          <li>I preventivi di test vengono creati e poi eliminati</li>
          <li>Verifica la creazione, aggiornamento e eliminazione</li>
        </ul>
      </div>
    </div>
  );
}
