# Parannusehdotukset ja Kehityssuunnitelma

## PRIORITEETTI 1: TEE HUOMENNA

### 1. README.md
Lisaa perus dokumentaatio projektin juureen.

### 2. package.json predev-skripti
```json
{
  "scripts": {
    "predev": "mkdir -p test/data && touch test/data/05-versions-space.pdf"
  }
}
```

### 3. TypeScript types
Luo client/src/lib/types.ts ja maarittele Agent, Team, ChatMessage interfacet.

### 4. AI-Command Endpoint
Toteuta /api/cs-portal/ai-command client/server/routes.ts:aan.

### 5. Error Boundary
Lisaa ErrorBoundary-komponentti ja kayta App.tsx:ssa.

## PRIORITEETTI 2: VIIKKO 2

### 6. Chat-historian tallennus
Kayta localStorage-hookia tallentamaan chat-viestit.

### 7. Rate Limiting
Asenna express-rate-limit ja lisaa API-suojaus.

### 8. Input Validation
Kayta zod-skeemoja kaikkiin API-kutsuihin.

### 9. Lazy Loading
Lataa raskaat komponentit lazy():lla.

## PRIORITEETTI 3: KUUKAUSI 1-3

### 10. Neon PostgreSQL
Migroi mock data oikeaan tietokantaan.

### 11. Automaattitestit
Vitest + React Testing Library.

### 12. WebSocket Real-time
Korvaa 5s polling WebSocketeilla.

### 13. Analytics
Lisaa Vercel Analytics tai Plausible.

## Deployment

- Replit: Lisaa ANTHROPIC_API_KEY Secret
- Vercel: npm run build && vercel deploy
- Railway: railway up

