'use client';

import React, { useState } from 'react';
import { smartTranslate } from '@/lib/translation';

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

export default function WarehouseManagement() {
  const [activeTab, setActiveTab] = useState<'warehouse' | 'quotes'>('warehouse');
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

  // Funzione per tradurre automaticamente i testi e descrizioni prodotti
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
  const generateQuoteHTML = async (quoteData: any): Promise<string> => {
    const lang = quoteData.language || 'it';
    
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
                  <th>${translatedLabels.item}</th>
                  <th>${translatedLabels.description}</th>
                  <th>${translatedLabels.quantity}</th>
                  <th>${translatedLabels.unitPrice}</th>
                  <th>${translatedLabels.total}</th>
                </tr>
              </thead>
              <tbody>
                ${await Promise.all(quoteData.items.map(async (item: any) => {
                  // Traduce la descrizione del prodotto con LibreTranslate
                  const translatedDescription = await translateProductDescription(item.description || '', lang);
                  
                  return `
                    <tr>
                      <td><strong>${item.name}</strong></td>
                      <td style="font-size: 0.9em; color: #666;">${translatedDescription}</td>
                      <td>${item.quantity}</td>
                      <td>€${item.unitPrice.toFixed(2)}</td>
                      <td><strong>€${item.total.toFixed(2)}</strong></td>
                    </tr>
                  `;
                })).then(rows => rows.join(''))}
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
                        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{item.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{item.description}</p>
                        <p className="text-xs text-gray-400 mt-2">SKU: {item.sku}</p>
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
            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📄</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun preventivo creato</h3>
                <p className="text-gray-600 mb-6">Crea il tuo primo preventivo selezionando articoli dal magazzino</p>
                <button
                  onClick={() => openQuoteEditor('new')}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lingua</label>
                  <select 
                    value={currentQuote.language || 'it'}
                    onChange={(e) => setCurrentQuote({...currentQuote, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="pt">🇵🇹 Português</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="zh">🇨🇳 中文</option>
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
                            <p className="text-xs text-gray-500 mb-1">{translateProductDescriptionFallback(item.description || '', currentQuote.language || 'it')}</p>
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
                              <p className="text-xs text-gray-500 mb-1">{translateProductDescriptionFallback(item.description || '', currentQuote.language || 'it')}</p>
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
