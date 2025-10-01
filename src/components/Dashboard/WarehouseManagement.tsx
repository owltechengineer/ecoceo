'use client';

import React, { useState, useEffect } from 'react';
import { smartTranslate, translateWithDictionary } from '@/lib/translation';
import { quotesService } from '@/lib/supabase';

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
  description: string;
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

// Interfaccia per impostazioni preventivo
interface QuoteSettings {
  // Dati Azienda Base
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyZip: string;
  companyCountry: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyLogo?: string;
  
  // Dati Fiscali
  vatNumber: string; // P.IVA
  taxCode: string; // Codice Fiscale
  
  // Dati Bancari
  bankName: string;
  iban: string;
  swift: string;
  
  // Dati Fatturazione Elettronica
  pec: string; // PEC
  sdi: string; // Codice SDI
  
  // Personalizzazione
  footerText: string;
  termsAndConditions: string;
  primaryColor: string;
  secondaryColor: string;
  showLogo: boolean;
  showFooter: boolean;
  showBankDetails: boolean;
  showTerms: boolean;
  defaultValidityDays: number;
  
  // Note Legali
  legalNote: string;
}

export default function WarehouseManagement() {
  const [activeTab, setActiveTab] = useState<'warehouse' | 'quotes' | 'settings'>('warehouse');
  const [showNewItem, setShowNewItem] = useState(false);
  const [showQuoteEditor, setShowQuoteEditor] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
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

  // Stati per i preventivi
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [isSavingQuote, setIsSavingQuote] = useState(false);

  // Stati per impostazioni
  const [quoteSettings, setQuoteSettings] = useState<QuoteSettings>({
    // Dati Azienda Base
    companyName: 'La Tua Azienda S.r.l.',
    companyAddress: 'Via Esempio 123',
    companyCity: 'Roma',
    companyZip: '00100',
    companyCountry: 'Italia',
    companyPhone: '+39 123 456 7890',
    companyEmail: 'info@azienda.com',
    companyWebsite: 'www.azienda.com',
    companyLogo: '',
    
    // Dati Fiscali
    vatNumber: 'IT12345678901',
    taxCode: 'RSSMRA80A01H501U',
    
    // Dati Bancari
    bankName: 'Banca Esempio',
    iban: 'IT60 X054 2811 1010 0000 0123 456',
    swift: 'BPMOIT22XXX',
    
    // Dati Fatturazione Elettronica
    pec: 'azienda@pec.it',
    sdi: 'ABCDEFG',
    
    // Personalizzazione
    footerText: 'Grazie per la vostra fiducia! Per informazioni: info@azienda.com | +39 123 456 7890',
    termsAndConditions: 'Il presente preventivo è valido per {days} giorni dalla data di emissione. I prezzi si intendono IVA esclusa salvo diversa indicazione.',
    primaryColor: '#2563eb',
    secondaryColor: '#16a34a',
    showLogo: true,
    showFooter: true,
    showBankDetails: true,
    showTerms: true,
    defaultValidityDays: 30,
    
    // Note Legali
    legalNote: 'Ai sensi del D.Lgs. 196/2003, Vi informiamo che i Vostri dati sono raccolti per le finalità connesse ai rapporti commerciali tra di noi intercorrenti.'
  });

  const categories = ['Tutti', 'Elettronica', 'Accessori', 'Software', 'Servizi'];

  // Carica preventivi all'avvio
  useEffect(() => {
    loadQuotes();
    
    // Carica impostazioni da localStorage
    const savedSettings = localStorage.getItem('quoteSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setQuoteSettings(parsed);
        console.log('✅ Impostazioni preventivo caricate');
      } catch (error) {
        console.error('Errore caricamento impostazioni:', error);
      }
    }
  }, []);

  // Funzione per caricare i preventivi
  const loadQuotes = async () => {
    try {
      setIsLoadingQuotes(true);
      const data = await quotesService.loadQuotes();
      
      // Converti i dati dal database al formato dell'interfaccia Quote
      const formattedQuotes: Quote[] = data.map((q: any) => ({
        id: q.id,
        clientName: q.client_name,
        clientEmail: q.client_email || '',
        clientAddress: q.client_address || '',
        language: q.language || 'it',
        items: q.quote_items?.map((item: any) => ({
          id: item.id,
          itemId: item.item_id || '',
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total
        })) || [],
        subtotal: q.subtotal,
        tax: q.tax,
        total: q.total,
        validUntil: q.valid_until || '',
        notes: q.notes || ''
      }));
      
      setQuotes(formattedQuotes);
      console.log(`✅ Caricati ${formattedQuotes.length} preventivi`);
    } catch (error) {
      console.error('Errore caricamento preventivi:', error);
      alert('Errore nel caricamento dei preventivi');
    } finally {
      setIsLoadingQuotes(false);
    }
  };

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

  // Funzione per testare il traduttore
  const runTranslationTest = async () => {
    setIsTranslating(true);
    setTestResults([]);
    
    const testText = "Laptop con processore Intel i7, tecnologia wireless e design ergonomico";
    const testLanguages = ['en', 'es', 'pt', 'fr', 'de', 'ru', 'zh'];
    const results: any[] = [];
    
    for (const lang of testLanguages) {
      // Usa smartTranslate che ora usa il dizionario interno (sempre funzionante)
      const translated = await smartTranslate(testText, lang, 'it');
      results.push({
        lang,
        success: true,
        method: 'Dizionario Interno (Keyword Translation)',
        original: testText,
        translated
      });
      
      // Piccola pausa per UI fluida
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setTestResults(results);
    setIsTranslating(false);
    setShowTranslationTest(true);
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

  // Funzione unificata per aprire l'editor preventivo
  const openQuoteEditor = (mode: 'new' | 'edit' | 'add', quote?: Quote) => {
    if (mode === 'edit' && quote) {
      setEditingQuote(quote);
      setQuoteItems(quote.items);
      setCurrentQuote({
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        clientAddress: quote.clientAddress,
        language: quote.language,
        validUntil: quote.validUntil,
        notes: quote.notes
      });
    } else if (mode === 'new') {
      setEditingQuote(null);
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
    }
    // mode 'add' mantiene i quoteItems esistenti
    setShowQuoteEditor(true);
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
        description: item.description,
        quantity,
        unitPrice: item.price,
        total: quantity * item.price
      };
      setQuoteItems([...quoteItems, newQuoteItem]);
    }
    
    // Apre l'editor unificato
    openQuoteEditor('add');
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
    // IVA al 22% solo per lingua italiana, 0% per altre lingue
    const taxRate = currentQuote.language === 'it' ? 0.22 : 0;
    return calculateQuoteSubtotal() * taxRate;
  };

  const calculateQuoteFinalTotal = () => {
    return calculateQuoteSubtotal() + calculateQuoteTax();
  };

  // Funzione per tradurre automaticamente i testi (ora usa smartTranslate direttamente)
  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    try {
      if (targetLanguage === 'it') return text;
      
      // Usa smartTranslate per tradurre tutte le etichette
      return await smartTranslate(text, targetLanguage, 'it');
    } catch (error) {
      console.error('Errore traduzione:', error);
      return text;
    }
  };

  // RIMOSSO: Vecchio dizionario limitato per etichette, ora usa smartTranslate
  const translateTextOLD = async (text: string, targetLanguage: string): Promise<string> => {
    try {
      // Fallback al dizionario interno per etichette comuni (non più usato)
      const translations: Record<string, Record<string, string>> = {
        'it': {
          'Quote': 'Preventivo',
          'Client': 'Cliente',
          'Email': 'Email',
          'Address': 'Indirizzo',
          'Items': 'Articoli',
          'Item': 'Articolo',
          'Description': 'Descrizione',
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
          'Item': 'Item',
          'Description': 'Description',
          'Quantity': 'Quantity',
          'Unit Price': 'Unit Price',
          'Total': 'Total',
          'Subtotal': 'Subtotal',
          'Tax': 'VAT',
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
          'Item': 'Article',
          'Description': 'Description',
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
          'Item': 'Artikel',
          'Description': 'Beschreibung',
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
        },
        'es': {
          'Quote': 'Presupuesto',
          'Client': 'Cliente',
          'Email': 'Email',
          'Address': 'Dirección',
          'Items': 'Artículos',
          'Item': 'Artículo',
          'Description': 'Descripción',
          'Quantity': 'Cantidad',
          'Unit Price': 'Precio Unitario',
          'Total': 'Total',
          'Subtotal': 'Subtotal',
          'Tax': 'IVA',
          'Final Total': 'Total Final',
          'Valid Until': 'Válido Hasta',
          'Notes': 'Notas',
          'Generate PDF': 'Generar PDF',
          'Generate Image': 'Generar Imagen'
        },
        'pt': {
          'Quote': 'Orçamento',
          'Client': 'Cliente',
          'Email': 'Email',
          'Address': 'Endereço',
          'Items': 'Itens',
          'Item': 'Item',
          'Description': 'Descrição',
          'Quantity': 'Quantidade',
          'Unit Price': 'Preço Unitário',
          'Total': 'Total',
          'Subtotal': 'Subtotal',
          'Tax': 'IVA',
          'Final Total': 'Total Final',
          'Valid Until': 'Válido Até',
          'Notes': 'Notas',
          'Generate PDF': 'Gerar PDF',
          'Generate Image': 'Gerar Imagem'
        },
        'ru': {
          'Quote': 'Предложение',
          'Client': 'Клиент',
          'Email': 'Email',
          'Address': 'Адрес',
          'Items': 'Товары',
          'Item': 'Товар',
          'Description': 'Описание',
          'Quantity': 'Количество',
          'Unit Price': 'Цена за единицу',
          'Total': 'Итого',
          'Subtotal': 'Промежуточный итог',
          'Tax': 'НДС',
          'Final Total': 'Окончательный итог',
          'Valid Until': 'Действителен до',
          'Notes': 'Примечания',
          'Generate PDF': 'Создать PDF',
          'Generate Image': 'Создать изображение'
        },
        'zh': {
          'Quote': '报价单',
          'Client': '客户',
          'Email': '电子邮件',
          'Address': '地址',
          'Items': '项目',
          'Item': '项目',
          'Description': '描述',
          'Quantity': '数量',
          'Unit Price': '单价',
          'Total': '总计',
          'Subtotal': '小计',
          'Tax': '税费',
          'Final Total': '最终总计',
          'Valid Until': '有效期至',
          'Notes': '备注',
          'Generate PDF': '生成PDF',
          'Generate Image': '生成图片'
        }
      };

      return translations[targetLanguage]?.[text] || text;
    } catch (error) {
      console.error('Errore traduzione:', error);
      return text;
    }
  };

  // Cache per traduzioni (evita chiamate API duplicate)
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});
  const [translatedDescriptions, setTranslatedDescriptions] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslationTest, setShowTranslationTest] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showTranslationPreview, setShowTranslationPreview] = useState(false);
  
  // Le traduzioni avvengono in tempo reale tramite translateWithDictionary()
  // Non serve più pre-traduzione con useEffect
  
  const translateProductDescription = async (description: string, targetLanguage: string): Promise<string> => {
    if (!description) return '';
    if (targetLanguage === 'it') return description;
    
    // Controlla la cache
    const cacheKey = `${description}-${targetLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    try {
      // Usa LibreTranslate API (gratuita)
      const translated = await smartTranslate(description, targetLanguage, 'it');
      
      // Salva in cache
      setTranslationCache(prev => ({ ...prev, [cacheKey]: translated }));
      
      return translated;
    } catch (error) {
      console.warn('Traduzione API fallita, uso dizionario interno');
      // Fallback al dizionario interno
      return translateProductDescriptionFallback(description, targetLanguage);
    }
  };
  
  // Fallback con dizionario interno
  const translateProductDescriptionFallback = (description: string, targetLanguage: string): string => {
    if (!description) return '';
    if (targetLanguage === 'it') return description;
    
    // Dizionario completo di traduzioni per parole chiave comuni
    const productTranslations: Record<string, Record<string, string>> = {
      'en': {
        'Laptop': 'Laptop', 'ultrabook': 'ultrabook', 'con': 'with', 'processore': 'processor',
        'tecnologia': 'technology', 'Monitor': 'Monitor', 'pollici': 'inches',
        'Tastiera': 'Keyboard', 'Mouse': 'Mouse', 'wireless': 'wireless',
        'retroilluminazione': 'backlight', 'ergonomico': 'ergonomic', 'design': 'design',
        'Cuffie': 'Headphones', 'cancellazione': 'cancellation', 'rumore': 'noise',
        'Webcam': 'Webcam', 'Full': 'Full', 'HD': 'HD', 'microfono': 'microphone',
        'integrato': 'integrated', 'Stampante': 'Printer', 'laser': 'laser',
        'multifunzione': 'multifunction', 'stampa': 'print', 'scansione': 'scan',
        'copia': 'copy', 'Hub': 'Hub', 'USB': 'USB', 'porte': 'ports',
        'Cavetti': 'Cables', 'HDMI': 'HDMI', 'metri': 'meters', 'qualità': 'quality',
        'premium': 'premium', 'Supporto': 'Stand', 'notebook': 'notebook',
        'regolabile': 'adjustable', 'altezza': 'height', 'Zaino': 'Backpack',
        'porta': 'laptop', 'scomparto': 'compartment', 'imbottito': 'padded',
        'Pacchetto': 'Package', 'Office': 'Office', 'suite': 'suite', 'licenza': 'license',
        'utente': 'user', 'Antivirus': 'Antivirus', 'Protezione': 'Protection',
        'completa': 'complete', 'contro': 'against', 'malware': 'malware', 'phishing': 'phishing',
        'Consulenza': 'Consulting', 'personalizzata': 'customized', 'strategia': 'strategy',
        'digitale': 'digital', 'Social': 'Social', 'Media': 'Media', 'Management': 'Management',
        'gestione': 'management', 'creazione': 'creation', 'contenuti': 'content',
        'SEO': 'SEO', 'Ottimizzazione': 'Optimization', 'per': 'for', 'motori': 'engines',
        'ricerca': 'search', 'analisi': 'analysis', 'parole': 'keywords', 'chiave': 'key',
        'e': 'and', 'da': 'from', 'a': 'to', 'di': 'of', 'il': 'the', 'la': 'the',
        'in': 'in', 'su': 'on', 'del': 'of the', 'della': 'of the'
      },
      'fr': {
        'Laptop': 'Ordinateur portable', 'ultrabook': 'ultrabook', 'con': 'avec', 'processore': 'processeur',
        'tecnologia': 'technologie', 'Monitor': 'Moniteur', 'pollici': 'pouces',
        'Tastiera': 'Clavier', 'Mouse': 'Souris', 'wireless': 'sans fil',
        'retroilluminazione': 'rétroéclairage', 'ergonomico': 'ergonomique', 'design': 'design',
        'Cuffie': 'Casque', 'cancellazione': 'annulation', 'rumore': 'bruit',
        'Webcam': 'Webcam', 'Full': 'Full', 'HD': 'HD', 'microfono': 'microphone',
        'integrato': 'intégré', 'Stampante': 'Imprimante', 'laser': 'laser',
        'multifunzione': 'multifonction', 'stampa': 'impression', 'scansione': 'numérisation',
        'copia': 'copie', 'Hub': 'Hub', 'USB': 'USB', 'porte': 'ports',
        'Cavetti': 'Câbles', 'HDMI': 'HDMI', 'metri': 'mètres', 'qualità': 'qualité',
        'premium': 'premium', 'Supporto': 'Support', 'notebook': 'ordinateur portable',
        'regolabile': 'réglable', 'altezza': 'hauteur', 'Zaino': 'Sac à dos',
        'porta': 'ordinateur portable', 'scomparto': 'compartiment', 'imbottito': 'rembourré',
        'Pacchetto': 'Package', 'Office': 'Office', 'suite': 'suite', 'licenza': 'licence',
        'utente': 'utilisateur', 'Antivirus': 'Antivirus', 'Protezione': 'Protection',
        'completa': 'complète', 'contro': 'contre', 'malware': 'malware', 'phishing': 'phishing',
        'Consulenza': 'Conseil', 'personalizzata': 'personnalisé', 'strategia': 'stratégie',
        'digitale': 'numérique', 'Social': 'Réseaux', 'Media': 'Sociaux', 'Management': 'Gestion',
        'gestione': 'gestion', 'creazione': 'création', 'contenuti': 'contenu',
        'SEO': 'SEO', 'Ottimizzazione': 'Optimisation', 'per': 'pour', 'motori': 'moteurs',
        'ricerca': 'recherche', 'analisi': 'analyse', 'parole': 'mots', 'chiave': 'clés',
        'e': 'et', 'da': 'de', 'a': 'à', 'di': 'de', 'il': 'le', 'la': 'la',
        'in': 'dans', 'su': 'sur', 'del': 'du', 'della': 'de la'
      },
      'de': {
        'Laptop': 'Laptop', 'ultrabook': 'Ultrabook', 'con': 'mit', 'processore': 'Prozessor',
        'tecnologia': 'Technologie', 'Monitor': 'Monitor', 'pollici': 'Zoll',
        'Tastiera': 'Tastatur', 'Mouse': 'Maus', 'wireless': 'drahtlos',
        'retroilluminazione': 'Hintergrundbeleuchtung', 'ergonomico': 'ergonomisch', 'design': 'Design',
        'Cuffie': 'Kopfhörer', 'cancellazione': 'Stornierung', 'rumore': 'Geräusch',
        'Webcam': 'Webcam', 'Full': 'Full', 'HD': 'HD', 'microfono': 'Mikrofon',
        'integrato': 'integriert', 'Stampante': 'Drucker', 'laser': 'Laser',
        'multifunzione': 'Multifunktion', 'stampa': 'Druck', 'scansione': 'Scannen',
        'copia': 'Kopie', 'Hub': 'Hub', 'USB': 'USB', 'porte': 'Anschlüsse',
        'Cavetti': 'Kabel', 'HDMI': 'HDMI', 'metri': 'Meter', 'qualità': 'Qualität',
        'premium': 'Premium', 'Supporto': 'Ständer', 'notebook': 'Notebook',
        'regolabile': 'verstellbar', 'altezza': 'Höhe', 'Zaino': 'Rucksack',
        'porta': 'Laptop', 'scomparto': 'Fach', 'imbottito': 'gepolstert',
        'Pacchetto': 'Paket', 'Office': 'Office', 'suite': 'Suite', 'licenza': 'Lizenz',
        'utente': 'Benutzer', 'Antivirus': 'Antivirus', 'Protezione': 'Schutz',
        'completa': 'vollständig', 'contro': 'gegen', 'malware': 'Malware', 'phishing': 'Phishing',
        'Consulenza': 'Beratung', 'personalizzata': 'maßgeschneidert', 'strategia': 'Strategie',
        'digitale': 'digital', 'Social': 'Social', 'Media': 'Media', 'Management': 'Management',
        'gestione': 'Verwaltung', 'creazione': 'Erstellung', 'contenuti': 'Inhalte',
        'SEO': 'SEO', 'Ottimizzazione': 'Optimierung', 'per': 'für', 'motori': 'Suchmaschinen',
        'ricerca': 'Suche', 'analisi': 'Analyse', 'parole': 'Schlüsselwörter', 'chiave': 'Schlüssel',
        'e': 'und', 'da': 'von', 'a': 'zu', 'di': 'von', 'il': 'der', 'la': 'die',
        'in': 'in', 'su': 'auf', 'del': 'des', 'della': 'der'
      },
      'es': {
        'Laptop': 'Portátil', 'ultrabook': 'ultrabook', 'con': 'con', 'processore': 'procesador',
        'tecnologia': 'tecnología', 'Monitor': 'Monitor', 'pollici': 'pulgadas',
        'Tastiera': 'Teclado', 'Mouse': 'Ratón', 'wireless': 'inalámbrico',
        'retroilluminazione': 'retroiluminación', 'ergonomico': 'ergonómico', 'design': 'diseño',
        'Cuffie': 'Auriculares', 'cancellazione': 'cancelación', 'rumore': 'ruido',
        'Webcam': 'Cámara web', 'Full': 'Full', 'HD': 'HD', 'microfono': 'micrófono',
        'integrato': 'integrado', 'Stampante': 'Impresora', 'laser': 'láser',
        'multifunzione': 'multifunción', 'stampa': 'impresión', 'scansione': 'escaneo',
        'copia': 'copia', 'Hub': 'Hub', 'USB': 'USB', 'porte': 'puertos',
        'Cavetti': 'Cables', 'HDMI': 'HDMI', 'metri': 'metros', 'qualità': 'calidad',
        'premium': 'premium', 'Supporto': 'Soporte', 'notebook': 'portátil',
        'regolabile': 'ajustable', 'altezza': 'altura', 'Zaino': 'Mochila',
        'porta': 'portátil', 'scomparto': 'compartimento', 'imbottito': 'acolchado',
        'Pacchetto': 'Paquete', 'Office': 'Office', 'suite': 'suite', 'licenza': 'licencia',
        'utente': 'usuario', 'Antivirus': 'Antivirus', 'Protezione': 'Protección',
        'completa': 'completa', 'contro': 'contra', 'malware': 'malware', 'phishing': 'phishing',
        'Consulenza': 'Consultoría', 'personalizzata': 'personalizada', 'strategia': 'estrategia',
        'digitale': 'digital', 'Social': 'Redes', 'Media': 'Sociales', 'Management': 'Gestión',
        'gestione': 'gestión', 'creazione': 'creación', 'contenuti': 'contenido',
        'SEO': 'SEO', 'Ottimizzazione': 'Optimización', 'per': 'para', 'motori': 'motores',
        'ricerca': 'búsqueda', 'analisi': 'análisis', 'parole': 'palabras', 'chiave': 'clave',
        'e': 'y', 'da': 'de', 'a': 'a', 'di': 'de', 'il': 'el', 'la': 'la',
        'in': 'en', 'su': 'sobre', 'del': 'del', 'della': 'de la'
      },
      'pt': {
        'Laptop': 'Laptop', 'ultrabook': 'ultrabook', 'con': 'com', 'processore': 'processador',
        'tecnologia': 'tecnologia', 'Monitor': 'Monitor', 'pollici': 'polegadas',
        'Tastiera': 'Teclado', 'Mouse': 'Mouse', 'wireless': 'sem fio',
        'retroilluminazione': 'retroiluminação', 'ergonomico': 'ergonômico', 'design': 'design',
        'Cuffie': 'Fones de ouvido', 'cancellazione': 'cancelamento', 'rumore': 'ruído',
        'Webcam': 'Webcam', 'Full': 'Full', 'HD': 'HD', 'microfono': 'microfone',
        'integrato': 'integrado', 'Stampante': 'Impressora', 'laser': 'laser',
        'multifunzione': 'multifuncional', 'stampa': 'impressão', 'scansione': 'digitalização',
        'copia': 'cópia', 'Hub': 'Hub', 'USB': 'USB', 'porte': 'portas',
        'Cavetti': 'Cabos', 'HDMI': 'HDMI', 'metri': 'metros', 'qualità': 'qualidade',
        'premium': 'premium', 'Supporto': 'Suporte', 'notebook': 'notebook',
        'regolabile': 'ajustável', 'altezza': 'altura', 'Zaino': 'Mochila',
        'porta': 'laptop', 'scomparto': 'compartimento', 'imbottito': 'acolchoado',
        'Pacchetto': 'Pacote', 'Office': 'Office', 'suite': 'suite', 'licenza': 'licença',
        'utente': 'usuário', 'Antivirus': 'Antivírus', 'Protezione': 'Proteção',
        'completa': 'completa', 'contro': 'contra', 'malware': 'malware', 'phishing': 'phishing',
        'Consulenza': 'Consultoria', 'personalizzata': 'personalizada', 'strategia': 'estratégia',
        'digitale': 'digital', 'Social': 'Mídias', 'Media': 'Sociais', 'Management': 'Gestão',
        'gestione': 'gestão', 'creazione': 'criação', 'contenuti': 'conteúdo',
        'SEO': 'SEO', 'Ottimizzazione': 'Otimização', 'per': 'para', 'motori': 'motores',
        'ricerca': 'pesquisa', 'analisi': 'análise', 'parole': 'palavras', 'chiave': 'chave',
        'e': 'e', 'da': 'de', 'a': 'para', 'di': 'de', 'il': 'o', 'la': 'a',
        'in': 'em', 'su': 'sobre', 'del': 'do', 'della': 'da'
      },
      'ru': {
        'Laptop': 'Ноутбук', 'ultrabook': 'ультрабук', 'con': 'с', 'processore': 'процессор',
        'tecnologia': 'технология', 'Monitor': 'Монитор', 'pollici': 'дюймов',
        'Tastiera': 'Клавиатура', 'Mouse': 'Мышь', 'wireless': 'беспроводной',
        'retroilluminazione': 'подсветка', 'ergonomico': 'эргономичный', 'design': 'дизайн',
        'Cuffie': 'Наушники', 'cancellazione': 'шумоподавление', 'rumore': 'шум',
        'Webcam': 'Веб-камера', 'Full': 'Full', 'HD': 'HD', 'microfono': 'микрофон',
        'integrato': 'встроенный', 'Stampante': 'Принтер', 'laser': 'лазерный',
        'multifunzione': 'многофункциональный', 'stampa': 'печать', 'scansione': 'сканирование',
        'copia': 'копия', 'Hub': 'Хаб', 'USB': 'USB', 'porte': 'порты',
        'Cavetti': 'Кабели', 'HDMI': 'HDMI', 'metri': 'метров', 'qualità': 'качество',
        'premium': 'премиум', 'Supporto': 'Подставка', 'notebook': 'ноутбук',
        'regolabile': 'регулируемый', 'altezza': 'высота', 'Zaino': 'Рюкзак',
        'Pacchetto': 'Пакет', 'Office': 'Office', 'suite': 'пакет', 'licenza': 'лицензия',
        'Consulenza': 'Консультация', 'personalizzata': 'персонализированная', 'strategia': 'стратегия',
        'digitale': 'цифровой', 'gestione': 'управление', 'creazione': 'создание', 'contenuti': 'контент',
        'e': 'и', 'con': 'с', 'per': 'для', 'di': 'из'
      },
      'zh': {
        'Laptop': '笔记本电脑', 'ultrabook': '超极本', 'con': '与', 'processore': '处理器',
        'tecnologia': '技术', 'Monitor': '显示器', 'pollici': '英寸',
        'Tastiera': '键盘', 'Mouse': '鼠标', 'wireless': '无线',
        'retroilluminazione': '背光', 'ergonomico': '人体工程学', 'design': '设计',
        'Cuffie': '耳机', 'cancellazione': '降噪', 'rumore': '噪音',
        'Webcam': '网络摄像头', 'Full': 'Full', 'HD': 'HD', 'microfono': '麦克风',
        'integrato': '集成', 'Stampante': '打印机', 'laser': '激光',
        'multifunzione': '多功能', 'stampa': '打印', 'scansione': '扫描',
        'copia': '复印', 'Hub': '集线器', 'USB': 'USB', 'porte': '端口',
        'Cavetti': '电缆', 'HDMI': 'HDMI', 'metri': '米', 'qualità': '质量',
        'premium': '高级', 'Supporto': '支架', 'notebook': '笔记本',
        'regolabile': '可调节', 'altezza': '高度', 'Zaino': '背包',
        'Pacchetto': '套餐', 'Office': 'Office', 'suite': '套件', 'licenza': '许可证',
        'Consulenza': '咨询', 'personalizzata': '定制', 'strategia': '策略',
        'digitale': '数字', 'gestione': '管理', 'creazione': '创建', 'contenuti': '内容',
        'e': '和', 'con': '与', 'per': '为', 'di': '的'
      }
    };

    let translated = description;
    const langDict = productTranslations[targetLanguage] || {};
    
    // Ordina per lunghezza decrescente per evitare sostituzioni parziali
    const sortedEntries = Object.entries(langDict).sort((a, b) => b[0].length - a[0].length);
    
    sortedEntries.forEach(([italian, foreign]) => {
      const regex = new RegExp(`\\b${italian}\\b`, 'gi');
      translated = translated.replace(regex, foreign);
    });
    
    return translated;
  };

  // Funzione per generare HTML del preventivo tradotto
  const generateQuoteHTML = async (quoteData: any, settings: QuoteSettings = quoteSettings): Promise<string> => {
    const lang = quoteData.language || 'it';
    
    // Traduci tutte le etichette
    const translatedLabels = {
      quote: await translateText('Quote', lang),
      client: await translateText('Client', lang),
      email: await translateText('Email', lang),
      address: await translateText('Address', lang),
      items: await translateText('Items', lang),
      item: await translateText('Item', lang),
      description: await translateText('Description', lang),
      quantity: await translateText('Quantity', lang),
      unitPrice: await translateText('Unit Price', lang),
      total: await translateText('Total', lang),
      subtotal: await translateText('Subtotal', lang),
      tax: await translateText('Tax', lang),
      finalTotal: await translateText('Final Total', lang),
      validUntil: await translateText('Valid Until', lang),
      notes: await translateText('Notes', lang),
      vatNumber: await translateText('VAT Number', lang),
      iban: await translateText('IBAN', lang),
      bankDetails: await translateText('Bank Details', lang)
    };

    // Pre-traduci TUTTO il contenuto degli articoli (nome + descrizione)
    const translatedItems = await Promise.all(
      quoteData.items.map(async (item: any) => ({
        ...item,
        translatedName: await smartTranslate(item.name || '', lang, 'it'),
        translatedDescription: await translateProductDescription(item.description || '', lang)
      }))
    );

    // Traduci anche le note se presenti
    const translatedNotes = quoteData.notes 
      ? await smartTranslate(quoteData.notes, lang, 'it')
      : '';

    // Traduci testi footer e termini dalle impostazioni
    const footerTexts = {
      thanks: await smartTranslate(settings.footerText, lang, 'it'),
      terms: settings.showTerms ? await smartTranslate(settings.termsAndConditions.replace('{days}', settings.defaultValidityDays.toString()), lang, 'it') : '',
      legal: await smartTranslate(settings.legalNote, lang, 'it')
    };

    const validUntilDate = new Date(Date.now() + settings.defaultValidityDays * 24 * 60 * 60 * 1000).toLocaleDateString('it-IT');
    
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
                  <th>${translatedLabels.item}</th>
                  <th>${translatedLabels.description}</th>
                  <th>${translatedLabels.quantity}</th>
                  <th>${translatedLabels.unitPrice}</th>
                  <th>${translatedLabels.total}</th>
                </tr>
              </thead>
              <tbody>
                ${translatedItems.map((item: any) => `
                  <tr>
                    <td><strong>${item.translatedName || item.name}</strong></td>
                    <td style="font-size: 0.9em; color: #666;">${item.translatedDescription}</td>
                    <td>${item.quantity}</td>
                    <td>€${item.unitPrice.toFixed(2)}</td>
                    <td><strong>€${item.total.toFixed(2)}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="totals-row">
                <span>${translatedLabels.subtotal}:</span>
                <span>€${quoteData.subtotal.toFixed(2)}</span>
              </div>
              ${lang === 'it' ? `
                <div class="totals-row">
                  <span>${translatedLabels.tax} (22%):</span>
                  <span>€${quoteData.tax.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="totals-row final">
                <span>${translatedLabels.finalTotal}:</span>
                <span>€${quoteData.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="validity">
              <strong>${translatedLabels.validUntil}:</strong> ${validUntilDate}
            </div>
            
            ${translatedNotes ? `
              <div class="notes">
                <h3>${translatedLabels.notes}</h3>
                <p>${translatedNotes}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>${footerTexts.thanks}</p>
            <p>${footerTexts.info}: info@azienda.com | +39 123 456 7890</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Funzione per generare PDF con traduzione
  const generatePDF = async () => {
    try {
      setIsTranslating(true);
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
      
      // Salva il preventivo su Supabase
      try {
        setIsSavingQuote(true);
        const savedQuote = await quotesService.saveQuote({
          clientName: quoteData.clientName!,
          clientEmail: quoteData.clientEmail,
          clientAddress: quoteData.clientAddress,
          language: quoteData.language!,
          subtotal: quoteData.subtotal!,
          tax: quoteData.tax!,
          total: quoteData.total!,
          validUntil: quoteData.validUntil,
          notes: quoteData.notes,
          status: 'sent',
          items: quoteItems.map(item => ({
            itemId: item.itemId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total
          }))
        });

        console.log('✅ Preventivo salvato:', savedQuote);

        // Ricarica i preventivi
        await loadQuotes();

        // Reset form
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
        setShowQuoteEditor(false);
        
        alert(`✅ PDF generato e preventivo salvato!\n📄 Numero: ${savedQuote.quote_number}\n👤 Cliente: ${quoteData.clientName}\n💰 Totale: €${quoteData.total.toFixed(2)}\n🌍 Lingua: ${currentQuote.language?.toUpperCase()}`);
      } catch (saveError) {
        console.error('⚠️ Errore salvataggio preventivo:', saveError);
        alert('⚠️ PDF generato ma errore nel salvataggio del preventivo');
      } finally {
        setIsSavingQuote(false);
      }
    } catch (error) {
      console.error('Errore generazione PDF:', error);
      alert('Errore nella generazione del PDF');
    } finally {
      setIsTranslating(false);
    }
  };

  // Funzione per generare immagine del preventivo con traduzione
  const generateImage = async () => {
    try {
      setIsTranslating(true);
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
      
      alert(`✅ Immagine generata in ${currentQuote.language?.toUpperCase()}!\nCliente: ${quoteData.clientName}\nTotale: €${quoteData.total.toFixed(2)}`);
    } catch (error) {
      console.error('Errore generazione immagine:', error);
      alert('Errore nella generazione dell\'immagine');
    } finally {
      setIsTranslating(false);
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
              onClick={runTranslationTest}
              disabled={isTranslating}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium text-sm disabled:opacity-50"
            >
              {isTranslating ? '🔄 Test...' : '🧪 Test Traduttore'}
            </button>
            <button
              onClick={() => setShowNewItem(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium text-sm"
            >
              ➕ Nuovo Articolo
            </button>
            <button
              onClick={() => openQuoteEditor('new')}
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
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ⚙️ Impostazioni
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
                    className={`bg-white rounded-xl shadow-lg border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                      stockStatus === 'low' ? 'border-red-300' :
                      stockStatus === 'high' ? 'border-green-300' :
                      'border-gray-200'
                    }`}
                  >
                    {/* Immagine Prodotto */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl opacity-50">📦</span>
                      )}
                      {/* Badge Categoria */}
                      <div className="absolute top-2 left-2">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg">
                          {item.category}
                        </span>
                      </div>
                      {/* Badge Stock Status */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                          stockStatus === 'low' ? 'bg-red-500 text-white' :
                          stockStatus === 'high' ? 'bg-green-500 text-white' :
                          'bg-yellow-500 text-white'
                        }`}>
                          {getStockIcon(stockStatus)} {stockStatus === 'low' ? 'Scorte Basse' : stockStatus === 'high' ? 'Disponibile' : 'Normale'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Contenuto Card */}
                    <div className="p-4">
                      {/* Titolo e Descrizione */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">{item.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">{item.description}</p>
                        {/* Codice SKU prominente e ben visibile */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2.5 rounded-lg inline-block shadow-md">
                          <div className="text-xs text-gray-400 mb-0.5 font-semibold">SKU</div>
                          <span className="text-sm font-mono font-bold tracking-widest">{item.sku}</span>
                        </div>
                      </div>
                      
                      {/* Info Griglia */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 mb-1">Quantità</p>
                          <p className="text-xl font-bold text-gray-900">{item.quantity}</p>
                          <p className="text-xs text-gray-500">{item.unit}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 mb-1">Prezzo</p>
                          <p className="text-xl font-bold text-green-600">€{item.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">unitario</p>
                        </div>
                      </div>
                      
                      {/* Valore e Posizione */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
                          <span className="text-xs font-medium text-gray-700">💰 Valore Stock</span>
                          <span className="text-sm font-bold text-blue-600">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                          <span className="text-xs font-medium text-gray-700">📍 Posizione</span>
                          <span className="text-sm font-mono font-semibold text-purple-600">{item.location}</span>
                        </div>
                      </div>
                    
                      {/* Bottone Aggiungi */}
                      <button
                        onClick={() => handleAddQuoteItem(item)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 shadow-lg"
                      >
                        ➕ Aggiungi al Preventivo
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
            {isLoadingQuotes ? (
              <div className="text-center py-12">
                <div className="animate-spin text-6xl mb-4">⏳</div>
                <p className="text-gray-600">Caricamento preventivi...</p>
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📄</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun preventivo salvato</h3>
                <p className="text-gray-600 mb-6">Crea il tuo primo preventivo selezionando articoli dal magazzino</p>
                <button
                  onClick={() => openQuoteEditor('new')}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium"
                >
                  📄 Crea Preventivo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="bg-white/50 backdrop-blur rounded-xl p-6 shadow-lg border-2 border-gray-200 hover:border-orange-300 transition-all duration-200">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {quote.clientName}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            quote.language === 'it' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {quote.language?.toUpperCase() || 'IT'}
                          </span>
                        </div>
                        {quote.clientEmail && (
                          <p className="text-sm text-gray-600">📧 {quote.clientEmail}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          📅 {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('it-IT') : 'N/D'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">€{quote.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{quote.items?.length || 0} articoli</p>
                      </div>
                    </div>

                    {/* Articoli Preview */}
                    <div className="mb-4 bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                      {quote.items && quote.items.length > 0 ? (
                        <div className="space-y-1">
                          {quote.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span className="text-gray-700 truncate flex-1">{item.name}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                          ))}
                          {quote.items.length > 3 && (
                            <p className="text-xs text-gray-500 italic text-center pt-1">
                              ...e altri {quote.items.length - 3} articoli
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 text-center">Nessun articolo</p>
                      )}
                    </div>

                    {/* Azioni */}
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => {
                          // TODO: Visualizza dettagli preventivo
                          alert('Visualizza dettagli in arrivo!');
                        }}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                      >
                        👁️ Vedi
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            // Prepara dati per PDF
                            const quoteData = {
                              clientName: quote.clientName,
                              clientEmail: quote.clientEmail,
                              clientAddress: quote.clientAddress,
                              language: quote.language,
                              items: quote.items || [],
                              subtotal: quote.subtotal,
                              tax: quote.tax,
                              total: quote.total,
                              validUntil: quote.validUntil,
                              notes: quote.notes
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
                            
                            alert(`✅ PDF rigenerato!\n👤 Cliente: ${quote.clientName}\n💰 Totale: €${quote.total.toFixed(2)}\n🌍 Lingua: ${quote.language?.toUpperCase()}`);
                          } catch (error) {
                            console.error('Errore generazione PDF:', error);
                            alert('❌ Errore nella generazione del PDF');
                          }
                        }}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        📄 Inoltra
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm(`Eliminare il preventivo per ${quote.clientName}?`)) {
                            try {
                              await quotesService.deleteQuote(quote.id);
                              await loadQuotes();
                              alert('✅ Preventivo eliminato!');
                            } catch (error) {
                              console.error('Errore eliminazione:', error);
                              alert('❌ Errore nell\'eliminazione del preventivo');
                            }
                          }
                        }}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        🗑️ Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Impostazioni Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">⚙️</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Impostazioni Preventivo</h3>
                  <p className="text-sm text-gray-600">Personalizza l'aspetto e i contenuti dei tuoi preventivi</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informazioni Azienda */}
              <div className="bg-white/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🏢</span> Informazioni Azienda
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Azienda / Ragione Sociale</label>
                    <input
                      type="text"
                      value={quoteSettings.companyName}
                      onChange={(e) => setQuoteSettings({...quoteSettings, companyName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="La Tua Azienda S.r.l."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Indirizzo</label>
                    <input
                      type="text"
                      value={quoteSettings.companyAddress}
                      onChange={(e) => setQuoteSettings({...quoteSettings, companyAddress: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Via Esempio 123"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CAP</label>
                      <input
                        type="text"
                        value={quoteSettings.companyZip}
                        onChange={(e) => setQuoteSettings({...quoteSettings, companyZip: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="00100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Città</label>
                      <input
                        type="text"
                        value={quoteSettings.companyCity}
                        onChange={(e) => setQuoteSettings({...quoteSettings, companyCity: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Roma"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paese</label>
                      <input
                        type="text"
                        value={quoteSettings.companyCountry}
                        onChange={(e) => setQuoteSettings({...quoteSettings, companyCountry: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Italia"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                      <input
                        type="text"
                        value={quoteSettings.companyPhone}
                        onChange={(e) => setQuoteSettings({...quoteSettings, companyPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="+39 123 456 7890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={quoteSettings.companyEmail}
                        onChange={(e) => setQuoteSettings({...quoteSettings, companyEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="info@azienda.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sito Web</label>
                    <input
                      type="text"
                      value={quoteSettings.companyWebsite}
                      onChange={(e) => setQuoteSettings({...quoteSettings, companyWebsite: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="www.azienda.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo Azienda (URL)</label>
                    <input
                      type="text"
                      value={quoteSettings.companyLogo}
                      onChange={(e) => setQuoteSettings({...quoteSettings, companyLogo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="https://esempio.com/logo.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">Inserisci l'URL del tuo logo (es: da Imgur, Cloudinary, ecc.)</p>
                  </div>
                </div>
              </div>

              {/* Dati Fiscali */}
              <div className="bg-white/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📋</span> Dati Fiscali
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partita IVA</label>
                    <input
                      type="text"
                      value={quoteSettings.vatNumber}
                      onChange={(e) => setQuoteSettings({...quoteSettings, vatNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                      placeholder="IT12345678901"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Codice Fiscale</label>
                    <input
                      type="text"
                      value={quoteSettings.taxCode}
                      onChange={(e) => setQuoteSettings({...quoteSettings, taxCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                      placeholder="RSSMRA80A01H501U"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PEC (Posta Certificata)</label>
                    <input
                      type="email"
                      value={quoteSettings.pec}
                      onChange={(e) => setQuoteSettings({...quoteSettings, pec: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="azienda@pec.it"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Codice SDI (Fatturazione Elettronica)</label>
                    <input
                      type="text"
                      value={quoteSettings.sdi}
                      onChange={(e) => setQuoteSettings({...quoteSettings, sdi: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono uppercase"
                      placeholder="ABCDEFG"
                      maxLength={7}
                    />
                    <p className="text-xs text-gray-500 mt-1">Codice univoco a 7 caratteri per fattura elettronica</p>
                  </div>
                </div>
              </div>

              {/* Dati Bancari */}
              <div className="bg-white/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🏦</span> Dati Bancari
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Banca</label>
                    <input
                      type="text"
                      value={quoteSettings.bankName}
                      onChange={(e) => setQuoteSettings({...quoteSettings, bankName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Banca Esempio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
                    <input
                      type="text"
                      value={quoteSettings.iban}
                      onChange={(e) => setQuoteSettings({...quoteSettings, iban: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                      placeholder="IT60 X054 2811 1010 0000 0123 456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT/BIC (opzionale)</label>
                    <input
                      type="text"
                      value={quoteSettings.swift}
                      onChange={(e) => setQuoteSettings({...quoteSettings, swift: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono uppercase"
                      placeholder="BPMOIT22XXX"
                    />
                  </div>
                  <label className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      checked={quoteSettings.showBankDetails}
                      onChange={(e) => setQuoteSettings({...quoteSettings, showBankDetails: e.target.checked})}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Mostra dati bancari nei preventivi</span>
                  </label>
                </div>
              </div>

              {/* Personalizzazione */}
              <div className="bg-white/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🎨</span> Personalizzazione
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Colore Primario</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={quoteSettings.primaryColor}
                          onChange={(e) => setQuoteSettings({...quoteSettings, primaryColor: e.target.value})}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={quoteSettings.primaryColor}
                          onChange={(e) => setQuoteSettings({...quoteSettings, primaryColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Colore Secondario</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={quoteSettings.secondaryColor}
                          onChange={(e) => setQuoteSettings({...quoteSettings, secondaryColor: e.target.value})}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={quoteSettings.secondaryColor}
                          onChange={(e) => setQuoteSettings({...quoteSettings, secondaryColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Validità Preventivo (giorni)</label>
                    <input
                      type="number"
                      value={quoteSettings.defaultValidityDays}
                      onChange={(e) => setQuoteSettings({...quoteSettings, defaultValidityDays: parseInt(e.target.value) || 30})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="1"
                      max="365"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={quoteSettings.showLogo}
                        onChange={(e) => setQuoteSettings({...quoteSettings, showLogo: e.target.checked})}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Mostra Logo</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={quoteSettings.showFooter}
                        onChange={(e) => setQuoteSettings({...quoteSettings, showFooter: e.target.checked})}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Mostra Footer</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Testo Footer */}
              <div className="bg-white/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200 lg:col-span-2">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📝</span> Testo Footer
                </h4>
                <textarea
                  value={quoteSettings.footerText}
                  onChange={(e) => setQuoteSettings({...quoteSettings, footerText: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Grazie per la vostra fiducia! Per informazioni: info@azienda.com | +39 123 456 7890"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Questo testo apparirà in fondo a tutti i preventivi generati
                </p>
              </div>

              {/* Termini e Condizioni */}
              <div className="bg-white/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200 lg:col-span-2">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📜</span> Termini e Condizioni
                </h4>
                <textarea
                  value={quoteSettings.termsAndConditions}
                  onChange={(e) => setQuoteSettings({...quoteSettings, termsAndConditions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Il presente preventivo è valido per {days} giorni..."
                />
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-xs text-gray-500">
                    Usa {'{days}'} per inserire automaticamente i giorni di validità
                  </p>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quoteSettings.showTerms}
                      onChange={(e) => setQuoteSettings({...quoteSettings, showTerms: e.target.checked})}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Mostra nei preventivi</span>
                  </label>
                </div>
              </div>

              {/* Note Legali Privacy */}
              <div className="bg-white/50 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200 lg:col-span-2">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⚖️</span> Note Legali e Privacy
                </h4>
                <textarea
                  value={quoteSettings.legalNote}
                  onChange={(e) => setQuoteSettings({...quoteSettings, legalNote: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={2}
                  placeholder="Ai sensi del D.Lgs. 196/2003..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Informativa privacy e note legali (GDPR)
                </p>
              </div>
            </div>

            {/* Anteprima */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 shadow-lg border border-blue-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👁️</span> Anteprima Preventivo
              </h4>
              <div className="bg-white rounded-lg p-6 shadow-inner border-2 border-dashed border-gray-300">
                {/* Header Anteprima */}
                <div className="mb-6" style={{ borderBottomColor: quoteSettings.primaryColor, borderBottomWidth: '3px' }}>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: quoteSettings.primaryColor }}>
                    {quoteSettings.companyName}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">{quoteSettings.companyAddress}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 pb-3">
                    <span>📞 {quoteSettings.companyPhone}</span>
                    <span>📧 {quoteSettings.companyEmail}</span>
                  </div>
                </div>

                {/* Corpo Anteprima */}
                <div className="py-4">
                  <h3 className="text-xl font-bold mb-2" style={{ color: quoteSettings.secondaryColor }}>
                    PREVENTIVO
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-600">Cliente: <strong>Cliente Esempio</strong></p>
                      <p className="text-gray-600">Email: esempio@cliente.com</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Data: {new Date().toLocaleDateString('it-IT')}</p>
                      <p className="text-gray-600">Valido fino: {new Date(Date.now() + quoteSettings.defaultValidityDays * 24 * 60 * 60 * 1000).toLocaleDateString('it-IT')}</p>
                    </div>
                  </div>
                  
                  {/* Tabella Esempio */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                    <table className="w-full text-sm">
                      <thead style={{ backgroundColor: quoteSettings.primaryColor, color: 'white' }}>
                        <tr>
                          <th className="px-3 py-2 text-left">Articolo</th>
                          <th className="px-3 py-2 text-center">Qtà</th>
                          <th className="px-3 py-2 text-right">Prezzo</th>
                          <th className="px-3 py-2 text-right">Totale</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-3 py-2">Laptop Dell XPS 13</td>
                          <td className="px-3 py-2 text-center">1</td>
                          <td className="px-3 py-2 text-right">€1,299.00</td>
                          <td className="px-3 py-2 text-right font-semibold">€1,299.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Totali */}
                  <div className="flex justify-end">
                    <div className="w-64 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotale:</span>
                        <span className="font-semibold">€1,299.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (22%):</span>
                        <span className="font-semibold">€285.78</span>
                      </div>
                      <div className="flex justify-between border-t-2 pt-1" style={{ borderTopColor: quoteSettings.secondaryColor }}>
                        <span className="font-bold">Totale:</span>
                        <span className="font-bold text-lg" style={{ color: quoteSettings.secondaryColor }}>€1,584.78</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Anteprima */}
                {quoteSettings.showFooter && (
                  <div className="mt-6 pt-4 border-t-2 border-gray-200 text-center">
                    <p className="text-xs text-gray-600 italic">{quoteSettings.footerText}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Salva Impostazioni */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  // Reset to default
                  setQuoteSettings({
                    companyName: 'La Tua Azienda',
                    companyAddress: 'Via Esempio 123, 00100 Roma',
                    companyPhone: '+39 123 456 7890',
                    companyEmail: 'info@azienda.com',
                    companyLogo: '',
                    footerText: 'Grazie per la vostra fiducia! Per informazioni: info@azienda.com | +39 123 456 7890',
                    primaryColor: '#2563eb',
                    secondaryColor: '#16a34a',
                    showLogo: true,
                    showFooter: true,
                    defaultValidityDays: 30
                  });
                  alert('✅ Impostazioni ripristinate ai valori predefiniti');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                🔄 Ripristina Default
              </button>
              <button
                onClick={() => {
                  // TODO: Salvare in localStorage o Supabase
                  localStorage.setItem('quoteSettings', JSON.stringify(quoteSettings));
                  alert('✅ Impostazioni salvate con successo!');
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium"
              >
                💾 Salva Impostazioni
              </button>
            </div>
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

      {/* Modal Preventivo Unificato */}
      {showQuoteEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                📄 {editingQuote ? 'Modifica Preventivo' : 'Nuovo Preventivo'}
              </h3>
              <button
                onClick={() => setShowQuoteEditor(false)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lingua Preventivo</label>
                  <select 
                    value={currentQuote.language || 'it'}
                    onChange={(e) => setCurrentQuote({...currentQuote, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <optgroup label="🌍 Europee">
                      <option value="it">🇮🇹 Italiano</option>
                      <option value="en">🇬🇧 English</option>
                      <option value="fr">🇫🇷 Français</option>
                      <option value="de">🇩🇪 Deutsch</option>
                      <option value="es">🇪🇸 Español</option>
                      <option value="pt">🇵🇹 Português</option>
                      <option value="nl">🇳🇱 Nederlands</option>
                      <option value="pl">🇵🇱 Polski</option>
                      <option value="cs">🇨🇿 Čeština</option>
                      <option value="sv">🇸🇪 Svenska</option>
                      <option value="da">🇩🇰 Dansk</option>
                      <option value="fi">🇫🇮 Suomi</option>
                      <option value="el">🇬🇷 Ελληνικά</option>
                      <option value="ro">🇷🇴 Română</option>
                      <option value="hu">🇭🇺 Magyar</option>
                      <option value="sk">🇸🇰 Slovenčina</option>
                      <option value="bg">🇧🇬 Български</option>
                      <option value="uk">🇺🇦 Українська</option>
                    </optgroup>
                    <optgroup label="🌏 Asiatiche">
                      <option value="ru">🇷🇺 Русский</option>
                      <option value="zh">🇨🇳 中文</option>
                      <option value="ja">🇯🇵 日本語</option>
                      <option value="ko">🇰🇷 한국어</option>
                      <option value="hi">🇮🇳 हिन्दी</option>
                      <option value="id">🇮🇩 Indonesia</option>
                      <option value="th">🇹🇭 ไทย</option>
                      <option value="vi">🇻🇳 Tiếng Việt</option>
                    </optgroup>
                    <optgroup label="🌎 Americane">
                      <option value="en">🇺🇸 English (US)</option>
                    </optgroup>
                    <optgroup label="🌍 Altre">
                      <option value="ar">🇦🇪 العربية</option>
                      <option value="tr">🇹🇷 Türkçe</option>
                      <option value="he">🇮🇱 עברית</option>
                      <option value="fa">🇮🇷 فارسی</option>
                    </optgroup>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    ✨ Traduzione automatica via LibreTranslate (gratuita)
                  </p>
                </div>
              </div>
              
              {/* Articoli Selezionati */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-semibold text-gray-900">Articoli Selezionati</h4>
                    {currentQuote.language && (
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
                        currentQuote.language === 'it' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      }`}>
                        {currentQuote.language === 'it' ? '🇮🇹 Italiano' : `🌍 ${currentQuote.language.toUpperCase()}`}
                      </span>
                    )}
                  </div>
                  {quoteItems.length > 0 && currentQuote.language && currentQuote.language !== 'it' && (
                    <button
                      onClick={() => {
                        setShowTranslationPreview(!showTranslationPreview);
                      }}
                      className={`px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-semibold shadow-lg ${
                        showTranslationPreview
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'bg-white text-purple-600 border-2 border-purple-600'
                      }`}
                    >
                      {showTranslationPreview ? '✅ Traduzione Attiva' : '🌍 Visualizza Traduzione'}
                    </button>
                  )}
                </div>
                
                {/* Info Traduzione Attiva */}
                {showTranslationPreview && quoteItems.length > 0 && currentQuote.language !== 'it' && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-4 mb-4 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <span className="text-white text-lg">🌍</span>
                        </div>
                        <div>
                          <h5 className="font-bold text-purple-900">Modalità Traduzione Attiva</h5>
                          <p className="text-xs text-purple-600">Lingua: {currentQuote.language?.toUpperCase()}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-bold">
                        LIVE
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-1 text-purple-700">
                        <span>✅</span>
                        <span>Nomi prodotti</span>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-700">
                        <span>✅</span>
                        <span>Descrizioni</span>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-700">
                        <span>✅</span>
                        <span>Etichette PDF</span>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-700">
                        <span>✅</span>
                        <span>Note cliente</span>
                      </div>
                    </div>
                  </div>
                )}
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
                            <h5 className="font-medium text-gray-900">
                              {showTranslationPreview && currentQuote.language !== 'it' 
                                ? translateWithDictionary(item.name || '', currentQuote.language || 'it')
                                : item.name}
                            </h5>
                            <p className="text-xs text-gray-500 mb-1">
                              {showTranslationPreview && currentQuote.language !== 'it'
                                ? translateWithDictionary(item.description || '', currentQuote.language || 'it')
                                : item.description}
                            </p>
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
                      {currentQuote.language === 'it' && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">IVA (22%):</span>
                          <span className="font-medium">€{calculateQuoteTax().toFixed(2)}</span>
                        </div>
                      )}
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
                onClick={() => setShowQuoteEditor(false)}
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
                disabled={quoteItems.length === 0 || !currentQuote.clientName || isTranslating}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
              >
                {isTranslating ? '🔄 Traduzione in corso...' : '📄 Genera Preventivo PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anteprima Preventivo */}
      {false && showQuotePreview && (
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
                              <p className="text-xs text-gray-500 mb-1">{translateWithDictionary(item.description || '', currentQuote.language || 'it')}</p>
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
                      {currentQuote.language === 'it' && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">IVA (22%):</span>
                          <span className="font-medium">€{calculateQuoteTax().toFixed(2)}</span>
                        </div>
                      )}
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
                      openQuoteEditor('add');
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
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-semibold shadow-lg"
                    >
                      📄 Genera Preventivo PDF
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

      {/* Modal Test Traduttore */}
      {showTranslationTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <span className="text-xl">🧪</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Test Traduttore Multilingua</h3>
                    <p className="text-sm text-gray-600">Risultati test traduzione automatica</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTranslationTest(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Testo Originale */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">🇮🇹 Testo Originale (Italiano):</h4>
                <p className="text-gray-800 font-medium">
                  {testResults[0]?.original || 'Laptop con processore Intel i7, tecnologia wireless e design ergonomico'}
                </p>
              </div>

              {/* Risultati Traduzioni */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Traduzioni in 7 Lingue:</h4>
                {testResults.map((result, index) => (
                  <div key={index} className="rounded-lg p-4 border-2 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">
                          {result.lang === 'en' ? '🇬🇧' :
                           result.lang === 'es' ? '🇪🇸' :
                           result.lang === 'pt' ? '🇵🇹' :
                           result.lang === 'fr' ? '🇫🇷' :
                           result.lang === 'de' ? '🇩🇪' :
                           result.lang === 'ru' ? '🇷🇺' :
                           result.lang === 'zh' ? '🇨🇳' : '🌍'}
                        </span>
                        <div>
                          <h5 className="font-semibold text-gray-900">{result.lang.toUpperCase()}</h5>
                          <p className="text-xs text-gray-500">{result.method}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ⚡ Keyword Translation
                      </span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">{result.translated}</p>
                  </div>
                ))}
              </div>

              {/* Statistiche */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">📈 Statistiche Test:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{testResults.length}</p>
                    <p className="text-xs text-gray-600">Lingue Testate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {testResults.length}
                    </p>
                    <p className="text-xs text-gray-600">Keyword Translation</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ⚡
                    </p>
                    <p className="text-xs text-gray-600">Istantanea</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">100%</p>
                    <p className="text-xs text-gray-600">Successo</p>
                  </div>
                </div>
              </div>

              {/* Bottone Chiudi */}
              <div className="mt-6">
                <button
                  onClick={() => setShowTranslationTest(false)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
