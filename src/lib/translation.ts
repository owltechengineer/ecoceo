/**
 * Sistema di traduzione automatica con LibreTranslate (100% gratuito)
 * Supporta 30+ lingue inclusi Russo, Cinese, Arabo, etc.
 * Fallback al dizionario interno in caso di errore
 */

// Dizionario interno come fallback (già implementato)
const internalDictionary: Record<string, Record<string, string>> = {
  'en': {
    'Laptop': 'Laptop', 'ultrabook': 'ultrabook', 'con': 'with', 'processore': 'processor',
    'tecnologia': 'technology', 'Monitor': 'Monitor', 'pollici': 'inches',
    'Tastiera': 'Keyboard', 'Mouse': 'Mouse', 'wireless': 'wireless',
    'retroilluminazione': 'backlight', 'ergonomico': 'ergonomic', 'design': 'design',
    'e': 'and', 'da': 'from', 'a': 'to', 'di': 'of', 'il': 'the', 'la': 'the'
  },
  'es': {
    'Laptop': 'Portátil', 'con': 'con', 'processore': 'procesador',
    'tecnologia': 'tecnología', 'wireless': 'inalámbrico', 'e': 'y'
  },
  'pt': {
    'Laptop': 'Laptop', 'con': 'com', 'processore': 'processador',
    'tecnologia': 'tecnologia', 'wireless': 'sem fio', 'e': 'e'
  },
  'ru': {
    'Laptop': 'Ноутбук', 'con': 'с', 'processore': 'процессор',
    'tecnologia': 'технология', 'wireless': 'беспроводной', 'e': 'и'
  },
  'zh': {
    'Laptop': '笔记本电脑', 'con': '与', 'processore': '处理器',
    'tecnologia': '技术', 'wireless': '无线', 'e': '和'
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

  try {
    // Prova con LibreTranslate (gratuito e illimitato)
    const translated = await translateWithLibreTranslate(text, sourceLang, targetLang);
    console.log(`✅ Tradotto con LibreTranslate: ${text.substring(0, 50)}... → ${translated.substring(0, 50)}...`);
    return translated;
  } catch (error) {
    // Fallback al dizionario interno
    console.warn('⚠️ LibreTranslate non disponibile, uso dizionario interno');
    return translateWithInternalDictionary(text, targetLang);
  }
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
