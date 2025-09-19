# Configurazione Sanity per Produzione

## Problema
Dopo il deploy, Sanity non riesce a caricare i dati a causa di variabili d'ambiente non configurate correttamente.

## Soluzione

### 1. Variabili d'Ambiente Richieste

Configura queste variabili d'ambiente nel tuo provider di hosting (Vercel, Netlify, etc.):

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-08-17
```

### 2. Come Ottenere i Valori

#### Project ID
1. Vai su [sanity.io](https://sanity.io)
2. Accedi al tuo progetto
3. Vai su Settings → API
4. Copia il "Project ID"

#### Dataset
- Solitamente `production` per produzione
- Oppure `development` per sviluppo

#### API Version
- Usa la versione più recente: `2025-08-17`

### 3. Configurazione per Vercel

1. Vai al tuo progetto su Vercel
2. Settings → Environment Variables
3. Aggiungi le variabili:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = il tuo project ID
   - `NEXT_PUBLIC_SANITY_DATASET` = production
   - `NEXT_PUBLIC_SANITY_API_VERSION` = 2025-08-17

### 4. Configurazione per Netlify

1. Vai al tuo progetto su Netlify
2. Site settings → Environment variables
3. Aggiungi le stesse variabili

### 5. Verifica

Dopo aver configurato le variabili:

1. Riavvia l'applicazione
2. Vai alla sezione "Diagnostica Sanity" nella dashboard
3. Verifica che tutte le variabili siano configurate correttamente
4. Controlla che la connessione sia attiva

### 6. Troubleshooting

#### Se Sanity non si connette:
- Verifica che il Project ID sia corretto
- Controlla che il dataset esista
- Assicurati che il progetto Sanity sia pubblicato
- Verifica che le variabili d'ambiente siano configurate correttamente

#### Se i dati non si caricano:
- Controlla la console del browser per errori
- Verifica che i contenuti siano pubblicati su Sanity
- Controlla che le query GROQ siano corrette

### 7. Fallback

Se Sanity non è configurato, l'applicazione:
- Non si bloccherà
- Mostrerà dati vuoti invece di errori
- Logga gli errori nella console per debugging

## Note

- Le variabili `NEXT_PUBLIC_*` sono visibili nel browser
- Non includere mai token segreti in queste variabili
- Riavvia sempre l'applicazione dopo aver modificato le variabili d'ambiente
