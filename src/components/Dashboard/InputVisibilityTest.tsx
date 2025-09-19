'use client';

import React, { useState } from 'react';
import { FormField } from './FormModal';

export default function InputVisibilityTest() {
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState(0);
  const [emailValue, setEmailValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  const clearAll = () => {
    setTextValue('');
    setNumberValue(0);
    setEmailValue('');
    setDateValue('');
    setSelectValue('');
    setTextareaValue('');
  };

  const fillAll = () => {
    setTextValue('Testo di esempio');
    setNumberValue(123);
    setEmailValue('test@example.com');
    setDateValue('2024-01-15');
    setSelectValue('option2');
    setTextareaValue('Questo è un testo di esempio per il textarea.\nPuò contenere più righe.');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">👁️ Test Visibilità Input</h3>
      
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={fillAll}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            📝 Riempi Tutti
          </button>
          
          <button
            onClick={clearAll}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            🗑️ Pulisci Tutti
          </button>
        </div>

        {/* Test Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Input */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Testo</h4>
            <FormField
              label="Campo Testo"
              name="text"
              type="text"
              value={textValue}
              onChange={(value) => setTextValue(value as string)}
              placeholder="Inserisci del testo..."
            />
            <div className="text-xs text-gray-500">
              Valore: <code className="bg-gray-100 px-1 rounded">{textValue}</code>
            </div>
          </div>

          {/* Number Input */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Numero</h4>
            <FormField
              label="Campo Numero"
              name="number"
              type="number"
              value={numberValue}
              onChange={(value) => setNumberValue(value as number)}
              placeholder="Inserisci un numero..."
            />
            <div className="text-xs text-gray-500">
              Valore: <code className="bg-gray-100 px-1 rounded">{numberValue}</code>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Email</h4>
            <FormField
              label="Campo Email"
              name="email"
              type="email"
              value={emailValue}
              onChange={(value) => setEmailValue(value as string)}
              placeholder="Inserisci un'email..."
            />
            <div className="text-xs text-gray-500">
              Valore: <code className="bg-gray-100 px-1 rounded">{emailValue}</code>
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Data</h4>
            <FormField
              label="Campo Data"
              name="date"
              type="date"
              value={dateValue}
              onChange={(value) => setDateValue(value as string)}
            />
            <div className="text-xs text-gray-500">
              Valore: <code className="bg-gray-100 px-1 rounded">{dateValue}</code>
            </div>
          </div>

          {/* Select Input */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Select</h4>
            <FormField
              label="Campo Select"
              name="select"
              type="select"
              value={selectValue}
              onChange={(value) => setSelectValue(value as string)}
              options={[
                { value: 'option1', label: 'Opzione 1' },
                { value: 'option2', label: 'Opzione 2' },
                { value: 'option3', label: 'Opzione 3' }
              ]}
            />
            <div className="text-xs text-gray-500">
              Valore: <code className="bg-gray-100 px-1 rounded">{selectValue}</code>
            </div>
          </div>

          {/* Textarea Input */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Textarea</h4>
            <FormField
              label="Campo Textarea"
              name="textarea"
              type="textarea"
              value={textareaValue}
              onChange={(value) => setTextareaValue(value as string)}
              placeholder="Inserisci del testo lungo..."
              rows={3}
            />
            <div className="text-xs text-gray-500">
              Valore: <code className="bg-gray-100 px-1 rounded">{textareaValue}</code>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Istruzioni:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Clicca "📝 Riempi Tutti" per vedere i campi popolati</li>
            <li>Clicca "🗑️ Pulisci Tutti" per svuotare i campi</li>
            <li>Digita nei campi per testare la visibilità del testo</li>
            <li>Verifica che il testo sia visibile mentre digiti</li>
            <li>Controlla i valori mostrati sotto ogni campo</li>
          </ol>
        </div>

        {/* Current State */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">📊 Stato Attuale:</h4>
          <pre className="text-xs text-gray-700 overflow-auto">
            {JSON.stringify({
              textValue,
              numberValue,
              emailValue,
              dateValue,
              selectValue,
              textareaValue
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
