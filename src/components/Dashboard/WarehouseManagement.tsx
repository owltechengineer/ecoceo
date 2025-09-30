'use client';

import React, { useState } from 'react';

interface WarehouseItem {
  id: string;
  name: string;
  category: 'Tutti' | 'Elettronica' | 'Accessori' | 'Software' | 'Servizi';
  quantity: number;
  unit: string;
  price: number;
  description: string;
  sku: string;
  location: string;
  minStock: number;
  maxStock: number;
  imageUrl?: string;
}

interface QuoteItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quote {
  id: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  language: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  notes: string;
}

export default function WarehouseManagement() {
  const [activeTab, setActiveTab] = useState<'warehouse' | 'quotes'>('warehouse');
  const [showNewItem, setShowNewItem] = useState(false);
  const [showNewQuote, setShowNewQuote] = useState(false);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
  const [selectedItems, setSelectedItems] = useState<WarehouseItem[]>([]);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentQuote, setCurrentQuote] = useState<Partial<Quote>>({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    language: 'it',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    validUntil: '',
    notes: ''
  });

  // Mock data per il magazzino
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([
    {
      id: '1',
      name: 'Laptop Dell XPS 13',
      category: 'Elettronica',
      quantity: 15,
      unit: 'pz',
      price: 1299.00,
      description: 'Laptop ultrabook con processore Intel i7, 16GB RAM, SSD 512GB',
      sku: 'DELL-XPS13-001',
      location: 'A1-B2',
      minStock: 5,
      maxStock: 50
    },
    {
      id: '2',
      name: 'Monitor Samsung 27" 4K',
      category: 'Elettronica',
      quantity: 8,
      unit: 'pz',
      price: 399.00,
      description: 'Monitor 4K da 27 pollici con tecnologia IPS e HDR',
      sku: 'SAMS-27-4K-002',
      location: 'A2-B1',
      minStock: 3,
      maxStock: 20
    },
    {
      id: '3',
      name: 'Tastiera Logitech MX Keys',
      category: 'Accessori' as const,
      quantity: 25,
      unit: 'pz',
      price: 99.99,
      description: 'Tastiera wireless con retroilluminazione e design ergonomico',
      sku: 'LOG-MXK-003',
      location: 'B3-C1',
      minStock: 5,
      maxStock: 50
    },
    {
      id: '4',
      name: 'Mouse Logitech MX Master 3',
      category: 'Accessori',
      quantity: 18,
      unit: 'pz',
      price: 89.99,
      description: 'Mouse wireless ergonomico con scorrimento magnetico',
      sku: 'LOG-MXM3-004',
      location: 'B3-C2',
      minStock: 5,
      maxStock: 40
    },
    {
      id: '5',
      name: 'SSD Samsung 1TB NVMe',
      category: 'Storage',
      quantity: 22,
      unit: 'pz',
      price: 129.99,
      description: 'SSD NVMe ad alta velocità per laptop e desktop',
      sku: 'SAMS-SSD1T-005',
      location: 'C1-D1',
      minStock: 10,
      maxStock: 50
    },
    {
      id: '6',
      name: 'Webcam Logitech C920 HD',
      category: 'Accessori',
      quantity: 12,
      unit: 'pz',
      price: 79.99,
      description: 'Webcam HD per videoconferenze e streaming',
      sku: 'LOG-C920-006',
      location: 'C1-D2',
      minStock: 3,
      maxStock: 25
    },
    {
      id: '7',
      name: 'Cuffie Sony WH-1000XM4',
      category: 'Audio',
      quantity: 8,
      unit: 'pz',
      price: 349.99,
      description: 'Cuffie wireless con cancellazione rumore e audio ad alta qualità',
      sku: 'SONY-WH1000XM4-007',
      location: 'D1-E1',
      minStock: 2,
      maxStock: 20
    },
    {
      id: '8',
      name: 'Tablet iPad Air 10.9"',
      category: 'Elettronica',
      quantity: 6,
      unit: 'pz',
      price: 599.00,
      description: 'Tablet Apple con chip A14 Bionic e display Liquid Retina',
      sku: 'APPLE-IPADAIR-008',
      location: 'D1-E2',
      minStock: 2,
      maxStock: 15
    },
    {
      id: '9',
      name: 'Router WiFi 6 Netgear',
      category: 'Networking',
      quantity: 10,
      unit: 'pz',
      price: 199.99,
      description: 'Router WiFi 6 con velocità fino a 6Gbps e copertura estesa',
      sku: 'NETG-WIFI6-009',
      location: 'E1-F1',
      minStock: 3,
      maxStock: 20
    },
    {
      id: '10',
      name: 'Hard Disk Esterno 2TB',
      category: 'Storage',
      quantity: 35,
      unit: 'pz',
      price: 89.99,
      description: 'Hard disk esterno USB 3.0 da 2TB per backup e archiviazione',
      sku: 'WD-EXT2TB-010',
      location: 'E1-F2',
      minStock: 10,
      maxStock: 60
    },
    {
      id: '11',
      name: 'Cavo HDMI 2m Premium',
      category: 'Accessori',
      quantity: 50,
      unit: 'pz',
      price: 15.99,
      description: 'Cavo HDMI ad alta velocità 2 metri con connettori dorati',
      sku: 'HDMI-2M-PREM-011',
      location: 'F1-G1',
      minStock: 20,
      maxStock: 100
    },
    {
      id: '12',
      name: 'Tastiera Meccanica RGB',
      category: 'Accessori',
      quantity: 14,
      unit: 'pz',
      price: 129.99,
      description: 'Tastiera gaming meccanica con switch Cherry MX e retroilluminazione RGB',
      sku: 'KEYB-MECH-RGB-012',
      location: 'F1-G2',
      minStock: 5,
      maxStock: 30
    }
  ]);

  // Mock data per i preventivi
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const categories = ['Tutti', 'Elettronica', 'Accessori', 'Software', 'Servizi'];

  const getStockStatus = (item: WarehouseItem) => {
    if (item.quantity <= item.minStock) return 'low';
    if (item.quantity >= item.maxStock) return 'high';
    return 'normal';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case 'low': return '🔴';
      case 'high': return '🟢';
      default: return '🔵';
    }
  };

  // Funzione per filtrare e ordinare i prodotti
  const getFilteredAndSortedItems = () => {
    let filtered = warehouseItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Ordinamento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'quantity':
          return b.quantity - a.quantity;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Funzione per ottenere le categorie uniche
  const getUniqueCategories = () => {
    return categories.filter(cat => cat !== 'Tutti');
  };

  const handleAddToQuote = (item: WarehouseItem) => {
    if (!selectedItems.find(selected => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveFromQuote = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleUpdateQuoteItem = (itemId: string, quantity: number, unitPrice: number) => {
    setQuoteItems(quoteItems.map(item => 
      item.itemId === itemId 
        ? { ...item, quantity, unitPrice, total: quantity * unitPrice }
        : item
    ));
  };

  const handleAddQuoteItem = (item: WarehouseItem, quantity: number = 1) => {
    const existingItem = quoteItems.find(qi => qi.itemId === item.id);
    if (existingItem) {
      handleUpdateQuoteItem(item.id, existingItem.quantity + quantity, item.price);
    } else {
      const newQuoteItem: QuoteItem = {
        id: `quote-${Date.now()}`,
        itemId: item.id,
        name: item.name,
        quantity,
        unitPrice: item.price,
        total: quantity * item.price
      };
      setQuoteItems([...quoteItems, newQuoteItem]);
    }
    
    // Mostra l'anteprima del preventivo
    setShowQuotePreview(true);
  };

  const handleRemoveQuoteItem = (itemId: string) => {
    setQuoteItems(quoteItems.filter(item => item.itemId !== itemId));
  };

  const calculateQuoteTotal = () => {
    return quoteItems.reduce((total, item) => total + item.total, 0);
  };

  const calculateQuoteSubtotal = () => {
    return calculateQuoteTotal();
  };

  const calculateQuoteTax = () => {
    return calculateQuoteSubtotal() * 0.22; // 22% IVA
  };

  const calculateQuoteFinalTotal = () => {
    return calculateQuoteSubtotal() + calculateQuoteTax();
  };

  // Funzione per tradurre automaticamente i testi
  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    try {
      // Simulazione traduzione automatica (in produzione useresti un servizio come Google Translate API)
      const translations: Record<string, Record<string, string>> = {
        'it': {
          'Quote': 'Preventivo',
          'Client': 'Cliente',
          'Email': 'Email',
          'Address': 'Indirizzo',
          'Items': 'Articoli',
          'Quantity': 'Quantità',
          'Unit Price': 'Prezzo Unitario',
          'Total': 'Totale',
          'Subtotal': 'Subtotale',
          'Tax': 'IVA',
          'Final Total': 'Totale Finale',
          'Valid Until': 'Valido Fino Al',
          'Notes': 'Note',
          'Generate PDF': 'Genera PDF',
          'Generate Image': 'Genera Immagine'
        },
        'en': {
          'Quote': 'Quote',
          'Client': 'Client',
          'Email': 'Email',
          'Address': 'Address',
          'Items': 'Items',
          'Quantity': 'Quantity',
          'Unit Price': 'Unit Price',
          'Total': 'Total',
          'Subtotal': 'Subtotal',
          'Tax': 'Tax',
          'Final Total': 'Final Total',
          'Valid Until': 'Valid Until',
          'Notes': 'Notes',
          'Generate PDF': 'Generate PDF',
          'Generate Image': 'Generate Image'
        },
        'fr': {
          'Quote': 'Devis',
          'Client': 'Client',
          'Email': 'Email',
          'Address': 'Adresse',
          'Items': 'Articles',
          'Quantity': 'Quantité',
          'Unit Price': 'Prix Unitaire',
          'Total': 'Total',
          'Subtotal': 'Sous-total',
          'Tax': 'TVA',
          'Final Total': 'Total Final',
          'Valid Until': 'Valide Jusqu\'au',
          'Notes': 'Notes',
          'Generate PDF': 'Générer PDF',
          'Generate Image': 'Générer Image'
        },
        'de': {
          'Quote': 'Angebot',
          'Client': 'Kunde',
          'Email': 'Email',
          'Address': 'Adresse',
          'Items': 'Artikel',
          'Quantity': 'Menge',
          'Unit Price': 'Einzelpreis',
          'Total': 'Gesamt',
          'Subtotal': 'Zwischensumme',
          'Tax': 'MwSt',
          'Final Total': 'Endsumme',
          'Valid Until': 'Gültig Bis',
          'Notes': 'Notizen',
          'Generate PDF': 'PDF Erstellen',
          'Generate Image': 'Bild Erstellen'
        }
      };

      return translations[targetLanguage]?.[text] || text;
    } catch (error) {
      console.error('Errore traduzione:', error);
      return text;
    }
  };

  // Funzione per generare HTML del preventivo tradotto
  const generateQuoteHTML = async (quoteData: any): Promise<string> => {
    const lang = quoteData.language || 'it';
    
    const translatedLabels = {
      quote: await translateText('Quote', lang),
      client: await translateText('Client', lang),
      email: await translateText('Email', lang),
      address: await translateText('Address', lang),
      items: await translateText('Items', lang),
      quantity: await translateText('Quantity', lang),
      unitPrice: await translateText('Unit Price', lang),
      total: await translateText('Total', lang),
      subtotal: await translateText('Subtotal', lang),
      tax: await translateText('Tax', lang),
      finalTotal: await translateText('Final Total', lang),
      validUntil: await translateText('Valid Until', lang),
      notes: await translateText('Notes', lang)
    };

    const validUntilDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('it-IT');
    
    return `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${translatedLabels.quote} - ${quoteData.clientName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
          .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 2.5em; font-weight: bold; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1em; }
          .content { padding: 30px; }
          .client-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .client-info h3 { margin: 0 0 15px 0; color: #333; font-size: 1.3em; }
          .client-info p { margin: 5px 0; color: #666; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { padding: 15px; text-align: left; border-bottom: 1px solid #ddd; }
          .items-table th { background: #f8f9fa; font-weight: bold; color: #333; }
          .items-table tr:hover { background: #f8f9fa; }
          .totals { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .totals-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .totals-row.final { border-top: 2px solid #333; padding-top: 15px; font-weight: bold; font-size: 1.2em; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-top: 1px solid #ddd; }
          .validity { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .validity strong { color: #1976d2; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${translatedLabels.quote}</h1>
            <p>${new Date().toLocaleDateString('it-IT')}</p>
          </div>
          
          <div class="content">
            <div class="client-info">
              <h3>${translatedLabels.client}</h3>
              <p><strong>${translatedLabels.client}:</strong> ${quoteData.clientName}</p>
              <p><strong>${translatedLabels.email}:</strong> ${quoteData.clientEmail}</p>
              <p><strong>${translatedLabels.address}:</strong> ${quoteData.clientAddress}</p>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>${translatedLabels.items}</th>
                  <th>${translatedLabels.quantity}</th>
                  <th>${translatedLabels.unitPrice}</th>
                  <th>${translatedLabels.total}</th>
                </tr>
              </thead>
              <tbody>
                ${quoteData.items.map((item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>€${item.unitPrice.toFixed(2)}</td>
                    <td>€${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="totals-row">
                <span>${translatedLabels.subtotal}:</span>
                <span>€${quoteData.subtotal.toFixed(2)}</span>
              </div>
              <div class="totals-row">
                <span>${translatedLabels.tax} (22%):</span>
                <span>€${quoteData.tax.toFixed(2)}</span>
              </div>
              <div class="totals-row final">
                <span>${translatedLabels.finalTotal}:</span>
                <span>€${quoteData.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="validity">
              <strong>${translatedLabels.validUntil}:</strong> ${validUntilDate}
            </div>
            
            ${quoteData.notes ? `
              <div class="notes">
                <h3>${translatedLabels.notes}</h3>
                <p>${quoteData.notes}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>Grazie per la vostra fiducia!</p>
            <p>Per informazioni: info@azienda.com | +39 123 456 7890</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Funzione per generare PDF
  const generatePDF = async () => {
    try {
      const quoteData = {
        ...currentQuote,
        items: quoteItems,
        subtotal: calculateQuoteSubtotal(),
        tax: calculateQuoteTax(),
        total: calculateQuoteFinalTotal(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      // Genera HTML tradotto
      const htmlContent = await generateQuoteHTML(quoteData);
      
      // Crea blob HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Apri in nuova finestra per stampa/PDF
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      
      // Salva il preventivo
      const newQuote: Quote = {
        id: `quote-${Date.now()}`,
        ...quoteData,
        validUntil: quoteData.validUntil
      };
      
      setQuotes([...quotes, newQuote]);
      setQuoteItems([]);
      setCurrentQuote({
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        language: 'it',
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        validUntil: '',
        notes: ''
      });
      setShowNewQuote(false);
      
      alert(`PDF generato per ${quoteData.clientName}!\nTotale: €${quoteData.total.toFixed(2)}`);
    } catch (error) {
      console.error('Errore generazione PDF:', error);
      alert('Errore nella generazione del PDF');
    }
  };

  // Funzione per generare immagine del preventivo
  const generateImage = async () => {
    try {
      const quoteData = {
        ...currentQuote,
        items: quoteItems,
        subtotal: calculateQuoteSubtotal(),
        tax: calculateQuoteTax(),
        total: calculateQuoteFinalTotal(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      // Genera HTML tradotto
      const htmlContent = await generateQuoteHTML(quoteData);
      
      // Crea elemento temporaneo per rendering
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Usa html2canvas per convertire in immagine
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Dimensioni canvas
      canvas.width = 800;
      canvas.height = 1000;
      
      // Sfondo bianco
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Simula contenuto (in produzione useresti html2canvas)
        ctx.fillStyle = '#333333';
        ctx.font = '24px Arial';
        ctx.fillText(`${quoteData.clientName} - Preventivo`, 50, 100);
        ctx.fillText(`Totale: €${quoteData.total.toFixed(2)}`, 50, 150);
        ctx.fillText(`Data: ${new Date().toLocaleDateString('it-IT')}`, 50, 200);
      }
      
      // Converti in blob e scarica
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `preventivo-${quoteData.clientName}-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
      
      // Rimuovi elemento temporaneo
      document.body.removeChild(tempDiv);
      
      alert(`Immagine generata per ${quoteData.clientName}!\nTotale: €${quoteData.total.toFixed(2)}`);
    } catch (error) {
      console.error('Errore generazione immagine:', error);
      alert('Errore nella generazione dell\'immagine');
    }
  };

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg mr-3">
              <span className="text-xl text-white">📦</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Magazzino e Documenti</h1>
              <p className="text-gray-600">Gestione inventario e creazione preventivi</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewItem(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium text-sm"
            >
              ➕ Nuovo Articolo
            </button>
            <button
              onClick={() => setShowNewQuote(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium text-sm"
            >
              📄 Nuovo Preventivo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('warehouse')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'warehouse'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📦 Magazzino
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'quotes'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📄 Preventivi
          </button>
        </div>

        {/* Magazzino Tab */}
        {activeTab === 'warehouse' && (
          <div className="space-y-6">
            {/* Filtri */}
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Controlli Ricerca e Filtri */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Ricerca */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Cerca per nome, SKU o descrizione..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Filtro Categoria */}
                <div className="md:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tutte le categorie</option>
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Ordinamento */}
                <div className="md:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="name">Nome</option>
                    <option value="price">Prezzo</option>
                    <option value="quantity">Quantità</option>
                    <option value="category">Categoria</option>
                  </select>
                </div>
              </div>
              
              {/* Contatore risultati */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {getFilteredAndSortedItems().length} prodotti trovati
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Filtri attivi:</span>
                  {searchTerm && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Ricerca: "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Categoria: {selectedCategory}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Grid Magazzino */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFilteredAndSortedItems().map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <div
                    key={item.id}
                    className={`bg-gradient-to-br rounded-xl p-4 shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer ${getStockColor(stockStatus)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                      </div>
                      <span className="text-2xl">📦</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quantità:</span>
                        <span className="text-lg font-bold">{item.quantity} {item.unit}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Prezzo:</span>
                        <span className="text-lg font-bold text-green-600">€{item.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Valore Stock:</span>
                        <span className="text-sm font-semibold text-blue-600">€{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Posizione:</span>
                        <span className="text-sm font-mono">{item.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Stock:</span>
                        <span className="text-sm">
                          {getStockIcon(stockStatus)} {stockStatus === 'low' ? 'Basso' : stockStatus === 'high' ? 'Alto' : 'Normale'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleAddQuoteItem(item)}
                        className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        ➕ Aggiungi
                      </button>
                      <button className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                        ✏️ Modifica
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Preventivi Tab */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📄</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun preventivo creato</h3>
                <p className="text-gray-600 mb-6">Crea il tuo primo preventivo selezionando articoli dal magazzino</p>
                <button
                  onClick={() => setShowNewQuote(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium"
                >
                  📄 Crea Preventivo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Preventivo #{quote.id}</h3>
                        <p className="text-gray-600">Cliente: {quote.clientName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">€{quote.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Totale</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        👁️ Visualizza
                      </button>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                        📄 PDF
                      </button>
                      <button className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                        ✏️ Modifica
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Nuovo Articolo */}
      {showNewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">➕ Nuovo Articolo</h3>
              <button
                onClick={() => setShowNewItem(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Articolo</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Inserisci nome articolo..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Seleziona categoria</option>
                    <option value="Elettronica">Elettronica</option>
                    <option value="Accessori">Accessori</option>
                    <option value="Software">Software</option>
                    <option value="Servizi">Servizi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Codice SKU..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posizione</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Es: A1-B2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantità</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Descrizione articolo..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewItem(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  ➕ Crea Articolo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nuovo Preventivo */}
      {showNewQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">📄 Nuovo Preventivo</h3>
              <button
                onClick={() => setShowNewQuote(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dati Cliente */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Dati Cliente</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Cliente</label>
                  <input
                    type="text"
                    value={currentQuote.clientName || ''}
                    onChange={(e) => setCurrentQuote({...currentQuote, clientName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Nome del cliente..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={currentQuote.clientEmail || ''}
                    onChange={(e) => setCurrentQuote({...currentQuote, clientEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="email@cliente.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indirizzo</label>
                  <textarea
                    value={currentQuote.clientAddress || ''}
                    onChange={(e) => setCurrentQuote({...currentQuote, clientAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Indirizzo completo..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lingua</label>
                  <select 
                    value={currentQuote.language || 'it'}
                    onChange={(e) => setCurrentQuote({...currentQuote, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="it">Italiano</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
              
              {/* Articoli Selezionati */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Articoli Selezionati</h4>
                {quoteItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-2 block">📦</span>
                    <p>Nessun articolo selezionato</p>
                    <p className="text-sm">Vai al magazzino per selezionare articoli</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quoteItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <p className="text-sm text-gray-600">€{item.unitPrice.toFixed(2)} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuoteItem(item.itemId, parseInt(e.target.value) || 1, item.unitPrice)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleUpdateQuoteItem(item.itemId, item.quantity, parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span className="text-sm font-medium">€{item.total.toFixed(2)}</span>
                            <button
                              onClick={() => handleRemoveQuoteItem(item.itemId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotale:</span>
                        <span className="font-medium">€{calculateQuoteSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">IVA (22%):</span>
                        <span className="font-medium">€{calculateQuoteTax().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="font-semibold text-gray-900">Totale:</span>
                        <span className="text-xl font-bold text-gray-900">€{calculateQuoteFinalTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 pt-6">
              <button
                onClick={() => setShowNewQuote(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => setActiveTab('warehouse')}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                📦 Seleziona Articoli
              </button>
              <button 
                onClick={generatePDF}
                disabled={quoteItems.length === 0 || !currentQuote.clientName}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📄 Genera PDF
              </button>
              <button 
                onClick={generateImage}
                disabled={quoteItems.length === 0 || !currentQuote.clientName}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🖼️ Genera Immagine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anteprima Preventivo */}
      {showQuotePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-lg mr-3">
                    <span className="text-xl text-white">📄</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Anteprima Preventivo</h3>
                    <p className="text-gray-600">Controlla gli articoli selezionati</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuotePreview(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Contenuto Anteprima */}
              <div className="space-y-6">
                {/* Riepilogo Articoli */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Articoli Selezionati</h4>
                  {quoteItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <span className="text-4xl mb-2 block">📦</span>
                      <p>Nessun articolo selezionato</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quoteItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-600">€{item.unitPrice.toFixed(2)} x {item.quantity}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-sm text-gray-500">Totale</div>
                                <div className="font-semibold text-gray-900">€{item.total.toFixed(2)}</div>
                              </div>
                              <button
                                onClick={() => handleRemoveQuoteItem(item.itemId)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Calcoli */}
                {quoteItems.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Riepilogo Costi</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotale:</span>
                        <span className="font-medium">€{calculateQuoteSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">IVA (22%):</span>
                        <span className="font-medium">€{calculateQuoteTax().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="font-semibold text-gray-900">Totale:</span>
                        <span className="text-xl font-bold text-gray-900">€{calculateQuoteFinalTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Azioni */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowQuotePreview(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Continua Selezione
                  </button>
                  <button
                    onClick={() => {
                      setShowQuotePreview(false);
                      setShowNewQuote(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    📝 Completa Preventivo
                  </button>
                  <button
                    onClick={() => {
                      setQuoteItems([]);
                      setShowQuotePreview(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    🗑️ Cancella Tutto
                  </button>
                </div>
                
                {/* Pulsanti Generazione */}
                {quoteItems.length > 0 && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={generatePDF}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-all duration-200"
                    >
                      📄 Genera PDF
                    </button>
                    <button
                      onClick={generateImage}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-all duration-200"
                    >
                      🖼️ Genera Immagine
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Riepilogo Valore Magazzino */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Valore Totale Magazzino</h3>
                    <p className="text-sm text-gray-600">Valore complessivo dell'inventario</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    €{warehouseItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {warehouseItems.length} prodotti
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
