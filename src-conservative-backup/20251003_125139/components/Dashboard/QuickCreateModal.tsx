'use client';

import { useState } from 'react';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'project' | 'campaign' | 'expense';
}

export default function QuickCreateModal({ isOpen, onClose, type }: QuickCreateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    priority: 'medium',
    category: '',
    amount: '',
    vendor: ''
  });

  const getModalConfig = () => {
    switch (type) {
      case 'project':
        return {
          title: 'Nuovo Progetto',
          icon: '🚀',
          fields: [
            { key: 'name', label: 'Nome Progetto', type: 'text', required: true },
            { key: 'description', label: 'Descrizione', type: 'textarea', required: true },
            { key: 'budget', label: 'Budget (€)', type: 'number', required: true },
            { key: 'startDate', label: 'Data Inizio', type: 'date', required: true },
            { key: 'endDate', label: 'Data Fine', type: 'date', required: false },
            { key: 'priority', label: 'Priorità', type: 'select', required: true, options: [
              { value: 'low', label: 'Bassa' },
              { value: 'medium', label: 'Media' },
              { value: 'high', label: 'Alta' }
            ]}
          ]
        };
      case 'campaign':
        return {
          title: 'Nuova Campagna',
          icon: '📈',
          fields: [
            { key: 'name', label: 'Nome Campagna', type: 'text', required: true },
            { key: 'description', label: 'Descrizione', type: 'textarea', required: true },
            { key: 'budget', label: 'Budget (€)', type: 'number', required: true },
            { key: 'startDate', label: 'Data Inizio', type: 'date', required: true },
            { key: 'endDate', label: 'Data Fine', type: 'date', required: true },
            { key: 'category', label: 'Categoria', type: 'select', required: true, options: [
              { value: 'social', label: 'Social Media' },
              { value: 'google', label: 'Google Ads' },
              { value: 'email', label: 'Email Marketing' },
              { value: 'content', label: 'Content Marketing' }
            ]}
          ]
        };
      case 'expense':
        return {
          title: 'Nuova Spesa',
          icon: '💰',
          fields: [
            { key: 'name', label: 'Descrizione Spesa', type: 'text', required: true },
            { key: 'amount', label: 'Importo (€)', type: 'number', required: true },
            { key: 'category', label: 'Categoria', type: 'select', required: true, options: [
              { value: 'office', label: 'Ufficio' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'software', label: 'Software' },
              { value: 'equipment', label: 'Attrezzature' },
              { value: 'travel', label: 'Viaggi' },
              { value: 'other', label: 'Altro' }
            ]},
            { key: 'vendor', label: 'Fornitore', type: 'text', required: false },
            { key: 'startDate', label: 'Data Spesa', type: 'date', required: true }
          ]
        };
      default:
        return { title: '', icon: '', fields: [] };
    }
  };

  const config = getModalConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${type} creato:`, formData);
    alert(`${config.title} creato con successo!`);
    onClose();
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">{config.icon}</span>
            {config.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                >
                  <option value="">Seleziona...</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Crea {config.title.split(' ')[1]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
