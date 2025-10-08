# CS Portal - Integration Guide

## Tehdyt muutokset

### 1. Backend API -laajennukset (✅ Valmis)
**Tiedosto:** `client/server/routes.ts`

Uudet endpointit lisätty:
- `GET /api/cs-portal/agents/:agentId/metrics` - Agent performance data
- `PATCH /api/cs-portal/teams/:teamId` - Update team info
- `PATCH /api/cs-portal/accounts/:accountId` - Update account info
- `DELETE /api/cs-portal/accounts/:accountId` - Delete account

### 2. Uudet komponentit (✅ Valmis)

#### AgentDetailDrawer.tsx
**Sijainti:** `client/src/components/AgentDetailDrawer.tsx`

Parannettu agent detail drawer joka näyttää:
- Agent profiilin ja statuksen
- Roolin muokkaus (dropdown)
- Performance metriikat:
  - Total Conversations
  - CSAT Score
  - FCR Rate
  - Avg Handle Time
  - Active Chats
- "View Full Analytics" -nappi

#### TeamEditModal.tsx
**Sijainti:** `client/src/components/TeamEditModal.tsx`

Tiimin muokkausmodaali:
- Tiimin nimi
- Kuvaus
- SLA-tavoite (slider 50-100%)
- Värillinen SLA-indikaattori

### 3. Integrointi cs-portal-modal.tsx:ään

**VAIHE 1: Lisää importit**
Lisää tiedoston alkuun (rivi ~9):
```typescript
import { AgentDetailDrawer } from "@/components/AgentDetailDrawer";
import { TeamEditModal } from "@/components/TeamEditModal";
```

**VAIHE 2: Lisää state team edit modalille**
Lisää muiden modal state-muuttujien kanssa (rivi ~25):
```typescript
const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
const [showTeamEditModal, setShowTeamEditModal] = useState(false);
```

**VAIHE 3: Korvaa vanha Agent Detail Drawer**
Etsi rivi ~652: `{/* Agent Detail Drawer`
Korvaa koko drawer (rivit 652-727) tällä:
```typescript
{/* Agent Detail Drawer (Slide-in from right) - Only in workspace mode */}
{viewMode === 'workspace' && selectedAgent && (
  <AgentDetailDrawer
    agent={selectedAgent}
    onClose={() => setSelectedAgent(null)}
    onRoleUpdate={async (agentId, newRole) => {
      await fetch(`/api/cs-portal/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      refetchAgents();
    }}
    showToast={setToast}
    setViewMode={setViewMode}
  />
)}
```

**VAIHE 4: Lisää "Edit Team" -painike team-kortteihin**
Etsi team-kortin renderöinti (rivi ~520+) ja lisää header-osioon:
```typescript
<div className="flex items-start justify-between mb-2">
  <div className="flex items-start gap-2.5 flex-1">
    {/* ...existing team info... */}
  </div>
  <button
    onClick={() => {
      setSelectedTeam(team);
      setShowTeamEditModal(true);
    }}
    className="text-white/60 hover:text-white transition-colors"
  >
    <MoreVertical className="h-4 w-4" />
  </button>
</div>
```

**VAIHE 5: Lisää TeamEditModal ennen closing DialogContent**
Etsi kohta missä on `<ClientOnboardingModal ...` (rivi ~740+) ja lisää:
```typescript
<TeamEditModal
  isOpen={showTeamEditModal}
  onClose={() => {
    setShowTeamEditModal(false);
    setSelectedTeam(null);
  }}
  team={selectedTeam}
  onUpdated={() => {
    refetchTeams();
    setShowTeamEditModal(false);
    setSelectedTeam(null);
  }}
  showToast={setToast}
/>
```

## Testaus

### 1. Agent Detail Drawer
1. Avaa CS Portal
2. Mene Workspace-näkymään
3. Klikkaa agentin nimeä
4. Tarkista että näet:
   - Agent-profiilin
   - Performance-metriikat (lataa API:sta)
   - Roolin muokkaus toimii
   - "View Full Analytics" vie dashboardiin

### 2. Team Edit Modal
1. Team-kortissa klikkaa kolmea pistettä (MoreVertical)
2. Muokkaa tiimin nimeä, kuvausta ja SLA-tavoitetta
3. Tallenna
4. Tarkista että muutokset näkyvät

### 3. Drag & Drop (jo olemassa)
1. Raahaa agent team-korttiin
2. Tarkista että siirto toimii
3. API-kutsu: POST `/api/cs-portal/teams/:teamId/members`

## Ominaisuudet joiden toteutus on valmis

✅ Backend API endpointit (agents metrics, team/account update)
✅ AgentDetailDrawer komponentti
✅ TeamEditModal komponentti
✅ Drag & drop teams/agents
✅ Multi-select agents
✅ Bulk-toiminnot (role, team assignment)

## Seuraavat vaiheet (jos halutaan laajentaa)

- [ ] Client Management -sivu (asiakkuuksien hallinta)
- [ ] Agent metrics -trendikaaviot (recharts)
- [ ] Team analytics dashboard
- [ ] Real-time notifications
- [ ] Export team performance reports
