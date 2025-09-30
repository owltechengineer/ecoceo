/**
 * Test con istanza alternativa di LibreTranslate
 */

const testText = "Laptop con processore Intel i7, tecnologia wireless";
const targetLang = 'en';

async function testAlternativeInstance() {
  console.log('\n🧪 TEST TRADUZIONE SINGOLA:\n');
  console.log(`📝 Testo IT: ${testText}`);
  
  try {
    const response = await fetch('https://translate.argosopentech.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: testText,
        source: 'it',
        target: targetLang,
        format: 'text'
      })
    });

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Errore: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log(`✅ Tradotto EN: ${data.translatedText}\n`);
    
  } catch (error) {
    console.error('❌ Errore:', error.message);
  }
}

testAlternativeInstance();
