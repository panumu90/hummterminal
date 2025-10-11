# Zapier Agent Integration - Implementation Plan

**Projekti**: Humm Group Oy Tech Lead Demo - AI Agent Orchestration
**Päivitetty**: 2025-10-11
**Status**: Suunnitteluvaihe

---

## 📋 Executive Summary

Tämä dokumentti kuvaa, miten AI-Panu (Claude-pohjainen co-pilot) voi delegoida tehtäviä Zapier Agentille, joka hoitaa monimutkaisia workflow-tehtäviä yli 8000+ applikaation kanssa. Tämä demonstroi modernia **agentti-orkestraatiota** ja ymmärrystä AI-ekosysteemeistä.

### Liiketoiminta-arvo
- **Skaalautuvuus**: Yksi AI voi delegoida satoja eri tehtäviä ilman custom-koodia
- **Kustannustehokkuus**: No-code integraatiot säästävät dev-aikaa
- **Demonstraatio-arvo**: Näyttää modernin AI-arkkitehtuurin ymmärrystä
- **Käytännön hyöty**: Aidosti toimiva ratkaisu, ei vain demo

---

## 🏗️ Arkkitehtuuri

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         KÄYTTÄJÄ                                 │
│  "Lähetä Panulle ehdotus tapaamisesta ensi viikolla"            │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AI-PANU (Claude)                            │
│  • Tunnistaa intention: "schedule_meeting"                       │
│  • Parsii parametrit: recipient, timeframe, purpose             │
│  • Päättää: Tämä vaatii Zapier Agentin (Calendar + Email)      │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND API ENDPOINT                           │
│  POST /api/agent/delegate                                        │
│  {                                                               │
│    "agentType": "executive_assistant",                           │
│    "task": "schedule_meeting",                                   │
│    "params": {                                                   │
│      "recipient": "panu@humm.fi",                                │
│      "timeframe": "next_week",                                   │
│      "purpose": "AI strategy discussion"                         │
│    }                                                             │
│  }                                                               │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                  ZAPIER WEBHOOK TRIGGER                          │
│  POST https://hooks.zapier.com/hooks/catch/[id]/[key]           │
│  • Vastaanottaa tehtävän                                         │
│  • Reitittää oikealle Zapier Agentille                          │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              ZAPIER AGENT: "Executive Assistant"                 │
│  1. Tarkistaa Panun Google Calendar vapaiden aikojen löytämiseksi│
│  2. Valitsee sopivan ajan                                        │
│  3. Lähettää sähköpostin Panulle ehdotuksineen                  │
│  4. (Optional) Varaa ajan kalenteriin kun Panu hyväksyy         │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CALLBACK WEBHOOK                              │
│  POST /api/agent/callback                                        │
│  {                                                               │
│    "taskId": "uuid",                                             │
│    "status": "completed",                                        │
│    "result": {                                                   │
│      "message": "Lähetin Panulle ehdotukset: Ti 15.10 klo 14,  │
│                  Ke 16.10 klo 10, Pe 18.10 klo 15",            │
│      "emailSent": true                                          │
│    }                                                             │
│  }                                                               │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AI-PANU RESPONSE                            │
│  "✅ Lähetin Panulle ehdotukset tapaamisesta:                   │
│   • Tiistai 15.10 klo 14:00                                     │
│   • Keskiviikko 16.10 klo 10:00                                 │
│   • Perjantai 18.10 klo 15:00                                   │
│                                                                  │
│   Hän vastaa pian ja valitsee sopivimman ajan."                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Zapier Agents - Määrittelyt

### Agent #1: "Executive Assistant"
**Rooli**: Panun henkilökohtainen assistentti (kalenteri, email, muistutukset)

**Behaviors**:
```
You are Panu's Executive Assistant at Humm Group Oy.

Your responsibilities:
1. Manage Panu's calendar (check availability, suggest meeting times)
2. Send emails on Panu's behalf (professional, concise, Finnish)
3. Create reminders for important deadlines
4. Coordinate with external contacts

Guidelines:
- Always check calendar before suggesting times
- Prefer morning meetings (9-12) for important discussions
- Use professional Finnish in all communications
- Include Zoom link for virtual meetings
- CC: relevant stakeholders when appropriate

When scheduling meetings:
- Suggest 3 alternative times
- Include meeting purpose and agenda
- Send calendar invite once confirmed

Connected apps:
- Google Calendar (read/write)
- Gmail (send)
- Slack (notifications)
```

**Trigger-esimerkit**:
- `schedule_meeting`: "Varaa tapaaminen X:n kanssa"
- `send_email`: "Lähetä sähköposti Y:lle"
- `check_availability`: "Onko Panu vapaa ensi tiistaina?"
- `set_reminder`: "Muistuta Z:sta huomenna"

---

### Agent #2: "Data Analyst"
**Rooli**: Datan keräys, analysointi, raportointi

**Behaviors**:
```
You are a Data Analyst specializing in AI transformation metrics for BPO companies.

Your responsibilities:
1. Gather market data about AI adoption in BPO industry
2. Calculate ROI and cost-benefit analyses
3. Create reports in Google Sheets with visualizations
4. Summarize findings in Finnish

Data sources:
- Web scraping (latest AI/BPO news)
- Competitor analysis
- Industry benchmarks

When creating reports:
- Use clear, executive-friendly formatting
- Include charts (bar, line, pie as appropriate)
- Highlight key insights at the top
- Provide data sources

Output format:
- Google Sheets for detailed data
- Slack summary for quick updates
- Email report for executives

Connected apps:
- Google Sheets (create, edit)
- Web Browser (research)
- Slack (notifications)
- Email (reports)
```

**Trigger-esimerkit**:
- `research_topic`: "Etsi dataa X:stä"
- `calculate_roi`: "Laske ROI Y:lle"
- `create_report`: "Luo raportti Z:sta Sheetsiin"
- `benchmark_analysis`: "Vertaa kilpailijoiden metriikoita"

---

### Agent #3: "CRM Manager"
**Rooli**: CRM-päivitykset, liidien hallinta

**Behaviors**:
```
You are a CRM Manager maintaining Humm Group Oy's customer relationships.

Your responsibilities:
1. Add new leads to Salesforce/HubSpot
2. Update deal stages and probabilities
3. Create follow-up tasks for sales team
4. Enrich contact data with web research

Lead qualification criteria:
- Company size: 50+ employees (BPO focus)
- Decision maker identified
- Budget indication available
- Timeline: within 6 months

When adding leads:
- Full contact details (name, email, phone, title)
- Company info (industry, size, location)
- Source and context
- Next action date

Connected apps:
- Salesforce / HubSpot
- LinkedIn (enrichment)
- Google Sheets (lead lists)
- Slack (notifications to sales team)
```

**Trigger-esimerkit**:
- `add_lead`: "Lisää uusi liidi: [tiedot]"
- `update_deal`: "Päivitä deal-status: X → Y"
- `create_task`: "Luo seurantatehtävä Z:lle"
- `enrich_contact`: "Etsi lisätietoja yhteyshenkilöstä"

---

## 💻 Backend Implementation

### 1. New API Endpoint: `/api/agent/delegate`

**Tiedosto**: `client/server/agent-delegation.ts`

```typescript
import { Request, Response } from "express";
import type { Express } from "express";

interface AgentTask {
  agentType: 'executive_assistant' | 'data_analyst' | 'crm_manager';
  task: string;
  params: Record<string, any>;
  conversationContext?: string;
  userId?: string;
}

interface ZapierAgentWebhook {
  url: string;
  agentType: string;
}

// Webhook URLs for different agents
const AGENT_WEBHOOKS: Record<string, string> = {
  executive_assistant: process.env.ZAPIER_AGENT_EXECUTIVE_URL || '',
  data_analyst: process.env.ZAPIER_AGENT_DATA_URL || '',
  crm_manager: process.env.ZAPIER_AGENT_CRM_URL || ''
};

export function registerAgentRoutes(app: Express) {
  // Delegate task to Zapier Agent
  app.post("/api/agent/delegate", async (req: Request, res: Response) => {
    try {
      const { agentType, task, params, conversationContext, userId }: AgentTask = req.body;

      // Validation
      if (!agentType || !task) {
        return res.status(400).json({
          error: "Missing required fields: agentType, task"
        });
      }

      const webhookUrl = AGENT_WEBHOOKS[agentType];

      if (!webhookUrl) {
        if (process.env.NODE_ENV === 'development') {
          console.log("🤖 Agent delegation (dev mode):", {
            agentType,
            task,
            params,
            conversationContext
          });

          // Simulate agent response for dev
          return res.json({
            success: true,
            devMode: true,
            taskId: `dev-${Date.now()}`,
            message: `[DEV] Agent '${agentType}' would handle task '${task}'`
          });
        }

        return res.status(500).json({
          error: `Agent webhook not configured for: ${agentType}`
        });
      }

      // Create task ID for tracking
      const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Send to Zapier Agent
      const zapierResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          agentType,
          task,
          params,
          conversationContext,
          userId,
          timestamp: new Date().toISOString(),
          callbackUrl: `${process.env.APP_URL || 'http://localhost:5000'}/api/agent/callback`
        })
      });

      if (!zapierResponse.ok) {
        throw new Error(`Zapier webhook failed: ${zapierResponse.statusText}`);
      }

      return res.json({
        success: true,
        taskId,
        agentType,
        message: "Task delegated to agent successfully"
      });

    } catch (error) {
      console.error("Agent delegation error:", error);
      return res.status(500).json({
        error: "Failed to delegate task to agent",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Callback endpoint for agent responses
  app.post("/api/agent/callback", async (req: Request, res: Response) => {
    try {
      const { taskId, status, result, error } = req.body;

      console.log("📨 Agent callback received:", {
        taskId,
        status,
        result: result ? JSON.stringify(result).substring(0, 100) + "..." : null,
        error
      });

      // TODO: Store result in database or in-memory cache
      // TODO: Notify frontend via WebSocket/SSE if needed
      // For now, just log it

      return res.json({
        success: true,
        message: "Callback received"
      });

    } catch (error) {
      console.error("Agent callback error:", error);
      return res.status(500).json({
        error: "Failed to process callback"
      });
    }
  });

  // Get agent task status (for polling)
  app.get("/api/agent/status/:taskId", async (req: Request, res: Response) => {
    const { taskId } = req.params;

    // TODO: Query database or cache for task status
    // For now, return mock data

    if (process.env.NODE_ENV === 'development') {
      return res.json({
        taskId,
        status: "pending",
        message: "Task is being processed by agent"
      });
    }

    return res.status(404).json({
      error: "Task not found"
    });
  });
}
```

---

### 2. Intent Detection in AI-Panu

**Tiedosto**: `client/src/components/chat-interface.tsx` (lisäys handleSend-funktioon)

```typescript
const handleSend = async () => {
  const message = inputValue.trim();
  if (!message || chatMutation.isPending) return;

  // 1. Check for feedback pattern (existing)
  const feedbackPattern = /^lähetä palaute:?\s*/i;
  if (feedbackPattern.test(message)) {
    // ... existing feedback logic ...
    return;
  }

  // 2. Check for agent delegation patterns
  const agentPatterns = [
    {
      pattern: /(?:lähetä|kirjoita)\s+(?:panulle|sähköposti)/i,
      agent: 'executive_assistant',
      task: 'send_email'
    },
    {
      pattern: /(?:varaa|sopii|tapaaminen|kokous|kalenteri)/i,
      agent: 'executive_assistant',
      task: 'schedule_meeting'
    },
    {
      pattern: /(?:tallenna|sheetsiin|laskelma|raportti|excel)/i,
      agent: 'data_analyst',
      task: 'create_report'
    },
    {
      pattern: /(?:lisää|crm|asiakas|liidi|salesforce)/i,
      agent: 'crm_manager',
      task: 'add_lead'
    }
  ];

  for (const { pattern, agent, task } of agentPatterns) {
    if (pattern.test(message)) {
      // Show user message
      setMessages(prev => [...prev, {
        content: message,
        isUser: true,
        timestamp: Date.now()
      }]);

      setInputValue("");

      // Show "agent is working" message
      setMessages(prev => [...prev, {
        content: `🤖 Delegoin tämän tehtävän ${agent}-agentille. Hetki...`,
        isUser: false,
        timestamp: Date.now()
      }]);

      try {
        const response = await fetch("/api/agent/delegate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentType: agent,
            task: task,
            params: {
              originalMessage: message,
              // TODO: Extract more structured params with Claude
            },
            conversationContext: messages.slice(-5).map(m => m.content).join("\n")
          })
        });

        if (response.ok) {
          const data = await response.json();

          setMessages(prev => [...prev, {
            content: data.devMode
              ? `✅ [DEV MODE] Tehtävä delegoitu agentille '${agent}'. Tuotannossa tämä laukaisisi Zapier Agentin, joka hoitaisi tehtävän automaattisesti.`
              : `✅ Tehtävä delegoitu agentille. Saat ilmoituksen kun valmis. (Task ID: ${data.taskId})`,
            isUser: false,
            timestamp: Date.now()
          }]);
        } else {
          throw new Error("Agent delegation failed");
        }
      } catch (error) {
        setMessages(prev => [...prev, {
          content: "❌ Agentin delegointi epäonnistui. Yritä uudelleen.",
          isUser: false,
          timestamp: Date.now()
        }]);
      }

      return;
    }
  }

  // 3. Continue with normal chat flow
  // ... existing chat logic ...
};
```

---

## 🔧 Environment Variables

**Tiedosto**: `.env.example` (päivitys)

```bash
# Zapier Integration - Feedback System
ZAPIER_FEEDBACK_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your_hook_id/

# Zapier Agents - AI Orchestration
ZAPIER_AGENT_EXECUTIVE_URL=https://hooks.zapier.com/hooks/catch/[agent1_id]/
ZAPIER_AGENT_DATA_URL=https://hooks.zapier.com/hooks/catch/[agent2_id]/
ZAPIER_AGENT_CRM_URL=https://hooks.zapier.com/hooks/catch/[agent3_id]/

# Application URL (for callbacks)
APP_URL=http://localhost:5000
```

---

## 📝 Zapier Zap Configuration

### Zap Template: "Agent Orchestrator"

**Trigger**: Webhooks by Zapier → Catch Hook
- URL: `https://hooks.zapier.com/hooks/catch/[id]/[key]`
- Method: POST
- Expected fields:
  - `taskId` (string)
  - `agentType` (string)
  - `task` (string)
  - `params` (object)
  - `conversationContext` (string)
  - `callbackUrl` (string)
  - `timestamp` (string)

**Filter**: Only continue if...
- `agentType` matches specific agent

**Action 1**: Paths by Zapier
- **Path A**: Executive Assistant tasks
  - Filter: `agentType = executive_assistant`
  - Actions: Google Calendar, Gmail, Slack

- **Path B**: Data Analyst tasks
  - Filter: `agentType = data_analyst`
  - Actions: Google Sheets, Web Parser, Slack

- **Path C**: CRM Manager tasks
  - Filter: `agentType = crm_manager`
  - Actions: Salesforce, LinkedIn, Slack

**Action 2**: Webhooks by Zapier → POST (callback)
- URL: `{{callbackUrl}}`
- Method: POST
- Data:
  ```json
  {
    "taskId": "{{taskId}}",
    "status": "completed",
    "result": {
      "message": "Task completed successfully",
      "details": "..."
    }
  }
  ```

---

## 🧪 Testing Scenarios

### Scenario 1: Schedule Meeting
**User input**: "Lähetä Panulle ehdotus tapaamisesta ensi viikolla AI-strategian käsittelyyn"

**Expected flow**:
1. ✅ AI-Panu detects `schedule_meeting` intent
2. ✅ Delegates to `executive_assistant` agent via `/api/agent/delegate`
3. ✅ Zapier Zap receives webhook
4. ✅ Agent checks Google Calendar for Panu's availability
5. ✅ Agent sends email to Panu with 3 meeting suggestions
6. ✅ Callback sent to `/api/agent/callback`
7. ✅ User sees confirmation in chat

### Scenario 2: Create Report
**User input**: "Tallenna ROI-laskelma Sheetsiin: alkuinvestointi 500k, säästö 200k/vuosi, 3 vuoden aikajänne"

**Expected flow**:
1. ✅ AI-Panu detects `create_report` intent
2. ✅ Delegates to `data_analyst` agent
3. ✅ Agent creates Google Sheet with ROI calculation
4. ✅ Agent adds chart (ROI over time)
5. ✅ Callback with Sheet URL
6. ✅ User gets link in chat

### Scenario 3: Add CRM Lead
**User input**: "Lisää CRM:ään: TechCorp Oy, CEO Matti Virtanen, matti@techcorp.fi, kiinnostunut AI-asiakaspalvelusta"

**Expected flow**:
1. ✅ AI-Panu detects `add_lead` intent
2. ✅ Extracts structured data (company, name, email, interest)
3. ✅ Delegates to `crm_manager` agent
4. ✅ Agent adds lead to Salesforce with enriched data
5. ✅ Agent notifies sales team via Slack
6. ✅ Callback confirms lead created
7. ✅ User sees confirmation with CRM link

---

## 🚀 Implementation Phases

### Phase 1: Foundation (1-2h)
- [ ] Create `client/server/agent-delegation.ts`
- [ ] Register routes in `client/server/routes.ts`
- [ ] Add env variables to `.env.example`
- [ ] Update `AI_FEATURES.md` with agent orchestration section

### Phase 2: Intent Detection (1h)
- [ ] Add pattern matching to `chat-interface.tsx`
- [ ] Implement basic agent delegation logic
- [ ] Test dev-mode fallback

### Phase 3: Zapier Configuration (2-3h)
- [ ] Create 3 Zapier Agents (Executive, Data, CRM)
- [ ] Set up webhook triggers for each
- [ ] Configure Paths by Zapier for routing
- [ ] Test callback flow

### Phase 4: Integration & Testing (1-2h)
- [ ] Test all 3 scenarios end-to-end
- [ ] Add error handling and edge cases
- [ ] Create demo video/screenshots
- [ ] Update documentation

**Total estimated time**: 5-8 hours

---

## 💡 Demo Value for Humm

### Technical Excellence
✅ **Modern AI Architecture**: Multi-agent orchestration (ei monolittiset chatbotit)
✅ **Scalable Pattern**: Yksi pattern → sata integraatiota
✅ **Production-Ready**: Error handling, fallbacks, logging
✅ **API Design**: RESTful, clear contracts, documentation

### Business Acumen
✅ **No-Code Integration**: Zapier = nopea time-to-market
✅ **Cost-Effective**: Ei custom-koodia jokaiseen integraatioon
✅ **Flexibility**: Uusia agentteja ja taskeja helppo lisätä
✅ **Real Value**: Ei vain demo, vaan käyttökelpoinen työkalu

### Leadership Qualities
✅ **Strategic Vision**: Ymmärrys mihin AI-ekosysteemit kehittyvät
✅ **Pragmatic Approach**: Hybrid-ratkaisu (Claude + Zapier)
✅ **Clear Communication**: Dokumentaatio, diagrammit, esimerkit
✅ **Execution Focus**: Konkreettinen implementation plan

---

## 📚 References

- [Zapier Agents Documentation](https://zapier.com/agents)
- [Zapier MCP Integration](https://zapier.com/mcp)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [Anthropic Claude API](https://docs.anthropic.com/)

---

**Next Steps**:
1. Review ja hyväksy suunnitelma
2. Aloita Phase 1 (backend foundation)
3. Viimeistele email-Zap samalla
