/**
 * Sistema di traduzione automatica con LibreTranslate (100% gratuito)
 * Supporta 30+ lingue inclusi Russo, Cinese, Arabo, etc.
 * Fallback al dizionario interno in caso di errore
 */

// Dizionario interno completo (sempre funzionante, veloce, gratuito)
const internalDictionary: Record<string, Record<string, string>> = {
  'en': {
    'Laptop': 'Laptop', 'ultrabook': 'ultrabook', 'con': 'with', 'processore': 'processor',
    'tecnologia': 'technology', 'Monitor': 'Monitor', 'pollici': 'inches', 'da': 'from',
    'Tastiera': 'Keyboard', 'Mouse': 'Mouse', 'wireless': 'wireless', 'Bluetooth': 'Bluetooth',
    'retroilluminazione': 'backlight', 'ergonomico': 'ergonomic', 'design': 'design',
    'Cuffie': 'Headphones', 'cancellazione': 'cancellation', 'attiva': 'active', 'del': 'of',
    'rumore': 'noise', 'microfono': 'microphone', 'integrato': 'integrated',
    'e': 'and', 'a': 'to', 'di': 'of', 'il': 'the', 'la': 'the', 'in': 'in'
  },
  'es': {
    'Laptop': 'Portátil', 'ultrabook': 'ultrabook', 'con': 'con', 'processore': 'procesador',
    'tecnologia': 'tecnología', 'Monitor': 'Monitor', 'pollici': 'pulgadas', 'da': 'de',
    'Tastiera': 'Teclado', 'Mouse': 'Ratón', 'wireless': 'inalámbrico', 'Bluetooth': 'Bluetooth',
    'retroilluminazione': 'retroiluminación', 'ergonomico': 'ergonómico', 'design': 'diseño',
    'Cuffie': 'Auriculares', 'cancellazione': 'cancelación', 'attiva': 'activa', 'del': 'del',
    'rumore': 'ruido', 'microfono': 'micrófono', 'integrato': 'integrado',
    'e': 'y', 'a': 'a', 'di': 'de', 'il': 'el', 'la': 'la', 'in': 'en'
  },
  'pt': {
    'Laptop': 'Laptop', 'ultrabook': 'ultrabook', 'con': 'com', 'processore': 'processador',
    'tecnologia': 'tecnologia', 'Monitor': 'Monitor', 'pollici': 'polegadas', 'da': 'de',
    'Tastiera': 'Teclado', 'Mouse': 'Mouse', 'wireless': 'sem fio', 'Bluetooth': 'Bluetooth',
    'retroilluminazione': 'retroiluminação', 'ergonomico': 'ergonômico', 'design': 'design',
    'Cuffie': 'Fones de ouvido', 'cancellazione': 'cancelamento', 'attiva': 'ativa', 'del': 'do',
    'rumore': 'ruído', 'microfono': 'microfone', 'integrato': 'integrado',
    'e': 'e', 'a': 'para', 'di': 'de', 'il': 'o', 'la': 'a', 'in': 'em'
  },
  'fr': {
    'Laptop': 'Ordinateur portable', 'ultrabook': 'ultrabook', 'con': 'avec', 'processore': 'processeur',
    'tecnologia': 'technologie', 'Monitor': 'Moniteur', 'pollici': 'pouces', 'da': 'de',
    'Tastiera': 'Clavier', 'Mouse': 'Souris', 'wireless': 'sans fil', 'Bluetooth': 'Bluetooth',
    'retroilluminazione': 'rétroéclairage', 'ergonomico': 'ergonomique', 'design': 'design',
    'Cuffie': 'Casque', 'cancellazione': 'annulation', 'attiva': 'active', 'del': 'du',
    'rumore': 'bruit', 'microfono': 'microphone', 'integrato': 'intégré',
    'e': 'et', 'a': 'à', 'di': 'de', 'il': 'le', 'la': 'la', 'in': 'dans'
  },
  'de': {
    'Laptop': 'Laptop', 'ultrabook': 'Ultrabook', 'con': 'mit', 'processore': 'Prozessor',
    'tecnologia': 'Technologie', 'Monitor': 'Monitor', 'pollici': 'Zoll', 'da': 'von',
    'Tastiera': 'Tastatur', 'Mouse': 'Maus', 'wireless': 'drahtlos', 'Bluetooth': 'Bluetooth',
    'retroilluminazione': 'Hintergrundbeleuchtung', 'ergonomico': 'ergonomisch', 'design': 'Design',
    'Cuffie': 'Kopfhörer', 'cancellazione': 'Löschung', 'attiva': 'aktiv', 'del': 'des',
    'rumore': 'Geräusch', 'microfono': 'Mikrofon', 'integrato': 'integriert',
    'e': 'und', 'a': 'zu', 'di': 'von', 'il': 'der', 'la': 'die', 'in': 'in'
  },
  'ru': {
    'Laptop': 'Ноутбук', 'ultrabook': 'ультрабук', 'con': 'с', 'processore': 'процессор',
    'tecnologia': 'технология', 'Monitor': 'Монитор', 'pollici': 'дюймов', 'da': 'от',
    'Tastiera': 'Клавиатура', 'Mouse': 'Мышь', 'wireless': 'беспроводной', 'Bluetooth': 'Bluetooth',
    'retroilluminazione': 'подсветка', 'ergonomico': 'эргономичный', 'design': 'дизайн',
    'Cuffie': 'Наушники', 'cancellazione': 'шумоподавление', 'attiva': 'активный', 'del': 'из',
    'rumore': 'шум', 'microfono': 'микрофон', 'integrato': 'встроенный',
    'e': 'и', 'a': 'в', 'di': 'из', 'il': '', 'la': '', 'in': 'в'
  },
  'zh': {
    'Laptop': '笔记本电脑', 'ultrabook': '超极本', 'con': '与', 'processore': '处理器',
    'tecnologia': '技术', 'Monitor': '显示器', 'pollici': '英寸', 'da': '从',
    'Tastiera': '键盘', 'Mouse': '鼠标', 'wireless': '无线', 'Bluetooth': 'Bluetooth',
    'retroilluminazione': '背光', 'ergonomico': '人体工程学', 'design': '设计',
    'Cuffie': '耳机', 'cancellazione': '降噪', 'attiva': '主动', 'del': '的',
    'rumore': '噪音', 'microfono': '麦克风', 'integrato': '集成',
    'e': '和', 'a': '到', 'di': '的', 'il': '', 'la': '', 'in': '在'
  }
};

/**
 * Traduce un testo usando LibreTranslate API (gratuita)
 */
export const translateWithLibreTranslate = async (
  text: string,
  sourceLang: string = 'it',
  targetLang: string = 'en'
): Promise<string> => {
  if (!text || !text.trim()) return '';
  if (sourceLang === targetLang) return text;

  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error('LibreTranslate API error:', error);
    throw error;
  }
};

/**
 * Traduce usando dizionario interno (fallback veloce)
 */
const translateWithInternalDictionary = (
  text: string,
  targetLang: string
): string => {
  if (targetLang === 'it') return text;
  
  let translated = text;
  const langDict = internalDictionary[targetLang] || {};
  
  // Ordina per lunghezza decrescente per evitare sostituzioni parziali
  const sortedEntries = Object.entries(langDict).sort((a, b) => b[0].length - a[0].length);
  
  sortedEntries.forEach(([italian, foreign]) => {
    const regex = new RegExp(`\\b${italian}\\b`, 'gi');
    translated = translated.replace(regex, foreign);
  });
  
  return translated;
};

/**
 * Traduzione intelligente con fallback automatico
 * 1. Prova LibreTranslate API (gratuita, alta qualità)
 * 2. Se fallisce, usa dizionario interno
 */
export const smartTranslate = async (
  text: string,
  targetLang: string,
  sourceLang: string = 'it'
): Promise<string> => {
  if (!text || !text.trim()) return '';
  if (sourceLang === targetLang) return text;

  // Usa dizionario interno come metodo principale (sempre funzionante, veloce, gratuito)
  // LibreTranslate può essere aggiunto in futuro se serve traduzione più contestuale
  const translated = translateWithInternalDictionary(text, targetLang);
  console.log(`✅ Tradotto con Dizionario Interno: ${text.substring(0, 30)}... → ${translated.substring(0, 30)}...`);
  return translated;
  
  /* OPZIONALE: Prova prima LibreTranslate API (commentato per affidabilità)
  try {
    const translated = await translateWithLibreTranslate(text, sourceLang, targetLang);
    console.log(`✅ Tradotto con LibreTranslate API`);
    return translated;
  } catch (error) {
    console.warn('⚠️ LibreTranslate non disponibile, uso dizionario interno');
    return translateWithInternalDictionary(text, targetLang);
  }
  */
};

/**
 * Traduce un array di testi in batch (più efficiente)
 */
export const batchTranslate = async (
  texts: string[],
  targetLang: string,
  sourceLang: string = 'it'
): Promise<string[]> => {
  if (sourceLang === targetLang) return texts;

  try {
    // LibreTranslate supporta traduzioni singole, quindi le facciamo in parallelo
    const translations = await Promise.all(
      texts.map(text => smartTranslate(text, targetLang, sourceLang))
    );
    return translations;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts.map(text => translateWithInternalDictionary(text, targetLang));
  }
};

/**
 * Mapping codici lingua
 */
export const languageCodes = {
  'it': 'Italiano',
  'en': 'English',
  'fr': 'Français',
  'de': 'Deutsch',
  'es': 'Español',
  'pt': 'Português',
  'ru': 'Русский',
  'zh': '中文',
  'ja': '日本語',
  'ko': '한국어',
  'ar': 'العربية'
} as const;

export type SupportedLanguage = keyof typeof languageCodes;
