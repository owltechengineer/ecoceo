/**
 * Script di test per LibreTranslate API
 * Testa la traduzione delle descrizioni prodotti in tutte le lingue
 */

// Testi di test (descrizioni prodotti reali)
const testTexts = [
  "Laptop ultrabook con processore Intel i7, 16GB RAM, SSD 512GB",
  "Monitor 4K da 27 pollici con tecnologia IPS e HDR",
  "Tastiera wireless con retroilluminazione e design ergonomico",
  "Mouse wireless con tecnologia Bluetooth e design ergonomico",
  "Cuffie con cancellazione attiva del rumore e microfono integrato",
  "Consulenza IT personalizzata per strategia digitale e sicurezza"
];

// Lingue da testare
const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' }
];

// Funzione per testare LibreTranslate
async function testLibreTranslate(text, targetLang) {
  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'it',
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    return `ERROR: ${error.message}`;
  }
}

// Funzione principale di test
async function runTests() {
  console.log('\n🌍 TEST LIBRETRANSLATE API - PREVENTIVI MULTILINGUA\n');
  console.log('=' .repeat(80));
  
  for (const testText of testTexts) {
    console.log(`\n📝 TESTO ORIGINALE (IT):\n   ${testText}\n`);
    
    for (const lang of languages) {
      try {
        const translated = await testLibreTranslate(testText, lang.code);
        console.log(`   🇺🇳 ${lang.name.padEnd(15)} [${lang.code}]: ${translated}`);
        
        // Piccola pausa per non sovraccaricare l'API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.log(`   ❌ ${lang.name.padEnd(15)} [${lang.code}]: ERRORE - ${error.message}`);
      }
    }
    
    console.log('\n' + '-'.repeat(80));
  }
  
  console.log('\n✅ TEST COMPLETATI!\n');
  console.log('📊 RIEPILOGO:');
  console.log(`   - Testi testati: ${testTexts.length}`);
  console.log(`   - Lingue testate: ${languages.length}`);
  console.log(`   - Traduzioni totali: ${testTexts.length * languages.length}`);
  console.log(`   - API utilizzata: LibreTranslate (gratuita)\n`);
}

// Esegui i test
runTests().catch(console.error);
