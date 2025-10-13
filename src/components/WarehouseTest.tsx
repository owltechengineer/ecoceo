'use client';

import { useState } from 'react';
import {
  loadWarehouseItems,
  loadWarehouseCategories,
  loadWarehouseLocations,
  loadQuotes,
  loadQuoteItems,
  loadWarehouseTransactions,
  saveWarehouseItem,
  saveQuote,
  WarehouseItem,
  Quote
} from '@/lib/supabase';

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
}

export default function WarehouseTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string>('');

  const runTests = async () => {
    setIsLoading(true);
    setError('');
    setResults([]);

    const testResults: TestResult[] = [];

    try {
      // Test 1: Carica articoli magazzino
      try {
        const items = await loadWarehouseItems();
        testResults.push({
          test: 'Carica Articoli Magazzino',
          success: true,
          message: `Caricati ${items.length} articoli`,
          data: items.slice(0, 3) // Mostra solo i primi 3
        });
      } catch (err: any) {
        testResults.push({
          test: 'Carica Articoli Magazzino',
          success: false,
          message: `Errore: ${err.message}`,
          data: err
        });
      }

      // Test 2: Carica categorie
      try {
        const categories = await loadWarehouseCategories();
        testResults.push({
          test: 'Carica Categorie',
          success: true,
          message: `Caricate ${categories.length} categorie`,
          data: categories
        });
      } catch (err: any) {
        testResults.push({
          test: 'Carica Categorie',
          success: false,
          message: `Errore: ${err.message}`,
          data: err
        });
      }

      // Test 3: Carica posizioni
      try {
        const locations = await loadWarehouseLocations();
        testResults.push({
          test: 'Carica Posizioni',
          success: true,
          message: `Caricate ${locations.length} posizioni`,
          data: locations
        });
      } catch (err: any) {
        testResults.push({
          test: 'Carica Posizioni',
          success: false,
          message: `Errore: ${err.message}`,
          data: err
        });
      }

      // Test 4: Carica preventivi
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

      // Test 5: Carica transazioni
      try {
        const transactions = await loadWarehouseTransactions();
        testResults.push({
          test: 'Carica Transazioni',
          success: true,
          message: `Caricate ${transactions.length} transazioni`,
          data: transactions.slice(0, 3) // Mostra solo le prime 3
        });
      } catch (err: any) {
        testResults.push({
          test: 'Carica Transazioni',
          success: false,
          message: `Errore: ${err.message}`,
          data: err
        });
      }

      // Test 6: Inserisci articolo di test
      try {
        const testItem: Omit<WarehouseItem, 'id' | 'created_at' | 'updated_at'> = {
          user_id: 'default-user',
          name: 'Articolo Test',
          category: 'Test',
          quantity: 1,
          unit: 'pz',
          price: 10.00,
          description: 'Articolo di test per verificare il funzionamento',
          sku: 'TEST-001',
          location: 'Test',
          min_stock: 0,
          max_stock: 10
        };

        const savedItem = await saveWarehouseItem(testItem);
        testResults.push({
          test: 'Inserisci Articolo Test',
          success: true,
          message: `Articolo inserito: ${savedItem.name}`,
          data: savedItem
        });
      } catch (err: any) {
        testResults.push({
          test: 'Inserisci Articolo Test',
          success: false,
          message: `Errore: ${err.message}`,
          data: err
        });
      }

      // Test 7: Inserisci preventivo di test
      try {
        const testQuote: Omit<Quote, 'id' | 'created_at' | 'updated_at'> = {
          user_id: 'default-user',
          client_name: 'Cliente Test',
          client_email: 'test@example.com',
          client_address: 'Via Test 123',
          language: 'it',
          subtotal: 100.00,
          tax: 22.00,
          total: 122.00,
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Preventivo di test',
          status: 'draft'
        };

        const savedQuote = await saveQuote(testQuote);
        testResults.push({
          test: 'Inserisci Preventivo Test',
          success: true,
          message: `Preventivo inserito: ${savedQuote.client_name}`,
          data: savedQuote
        });
      } catch (err: any) {
        testResults.push({
          test: 'Inserisci Preventivo Test',
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
        <h3 className="text-lg font-semibold text-gray-900">🏪 Test Magazzino</h3>
        <button
          onClick={runTests}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <li>I dati di test vengono inseriti nel database</li>
        </ul>
      </div>
    </div>
  );
}
