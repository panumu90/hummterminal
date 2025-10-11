# Zapier Feedback Integration - Setup Guide

This guide shows how to set up the Zapier integration for the feedback system, allowing users to send feedback from the Co-Pilot chat directly to your email.

## 🎯 What This Does

When a user sends feedback from the Co-Pilot chat, it:
1. **AI-Panu detects** "Lähetä palaute: ..." or user clicks feedback button
2. **Backend sends** data to Zapier webhook
3. **Zapier processes** the webhook and routes to email
4. **You receive** professional email with feedback details
5. **(Optional)** Logs to Google Sheets/Slack/Notion

**Three ways to send feedback:**
- 💬 **Natural language**: Type "Lähetä palaute: [message]" in chat
- 🏷️ **Badge shortcut**: Click "📨 Lähetä palaute" badge in chat footer
- 📝 **Modal form**: Click 💬 button in Co-Pilot header

---

## ⚡ Quick Start (5 minutes)

**Don't want to read the full guide?** Here's the fastest setup:

1. **Create Zap**: [zapier.com/app/editor](https://zapier.com/app/editor)
2. **Trigger**: Webhooks by Zapier → Catch Hook → Copy URL
3. **Action**: Gmail → Send Email → Configure (see templates below)
4. **Publish**: Turn Zap ON
5. **Configure**: Add webhook URL to `.env` file:
   ```bash
   ZAPIER_FEEDBACK_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ID/
   ```
6. **Test**: Restart dev server, open app, send test feedback
7. **Done!** Check your email 📧

**Need details?** Continue reading below ⬇️

---

## 📋 Prerequisites

- A Zapier account (free tier works fine)
- Email account (Gmail, Outlook, etc.)
- (Optional) Google Sheets, Slack, or Notion for logging

---

## 🔧 Step-by-Step Setup

### Step 1: Create a New Zap

1. Go to [Zapier Dashboard](https://zapier.com/app/dashboard)
2. Click **"Create Zap"**
3. Name it: `Humm Feedback System`

### Step 2: Configure Trigger (Webhooks by Zapier)

**Trigger Setup:**
1. Search for **"Webhooks by Zapier"**
2. Choose **"Catch Hook"** event
3. Click **Continue**
4. Copy the **Webhook URL** (looks like: `https://hooks.zapier.com/hooks/catch/12345/abcdef/`)
5. **Save this URL** - you'll need it for `.env`

**Test Trigger:**
1. Keep the Zapier tab open
2. In your terminal, test the webhook:

```bash
curl -X POST https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/ \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Test feedback from setup",
    "category": "other",
    "priority": "MEDIUM",
    "userContext": "/strategy",
    "timestamp": "2025-01-15T12:00:00.000Z",
    "appVersion": "1.0.0",
    "source": "Humm Tech Lead Demo"
  }'
```

3. Go back to Zapier and click **"Test trigger"**
4. You should see the test data appear
5. Click **Continue**

### Step 3: Configure Action (Send Email)

**Action Setup:**
1. Search for your email provider (Gmail, Outlook, etc.)
2. Choose **"Send Email"** action
3. Connect your email account (authorize Zapier)
4. Click **Continue**

**Email Configuration:**
Configure the email template with these fields:

- **To**: `panu@humm.fi` (tai oma sähköpostisi)
- **From Name**: `Humm AI Demo` (optional, makes emails recognizable)
- **Reply To**: `noreply@humm-demo.local` (optional)
- **Subject**: `🔔 Palaute: {{1__category}} [{{1__priority}}]`

- **Body Type**: Choose **"HTML"** for better formatting, or **"Plain Text"** for simplicity

**Plain Text Template** (yksinkertainen):
```
📨 UUSI PALAUTE HUMM-APPISTA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 PALAUTE:
{{1__feedback}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏷️  KATEGORIA:  {{1__category}}
⚡  PRIORITEETTI: {{1__priority}}
📍  SIJAINTI:    {{1__userContext__page}}
🔧  LÄHDE:       {{1__userContext__source}}
⏰  AIKALEIMA:   {{1__userContext__timestamp}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tämä palaute lähetettiin automaattisesti Humm Tech Lead -sovelluksesta
käyttämällä AI-Panu co-pilotin Zapier-integraatiota.

Demo-arvo:
✅ AI tunnistaa intention ("lähetä palaute")
✅ Laukaisee todellisen toimenpiteen (webhook → email)
✅ Skaalautuva pattern (sama toimii CRM, Slack, Sheets, etc.)
```

**HTML Template** (parempi muotoilu):
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
    .feedback-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
    .meta-item { background: white; padding: 10px; border-radius: 4px; }
    .meta-label { font-size: 12px; color: #6c757d; text-transform: uppercase; font-weight: 600; }
    .meta-value { font-size: 14px; color: #212529; margin-top: 5px; }
    .footer { background: #212529; color: #adb5bd; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; text-align: center; }
    .priority-high { color: #dc3545; font-weight: bold; }
    .priority-medium { color: #fd7e14; font-weight: bold; }
    .priority-low { color: #28a745; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🤖 Uusi palaute AI-Panulta</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9;">Humm Group Oy Tech Lead Demo</p>
  </div>

  <div class="content">
    <h2 style="margin-top: 0;">📝 Palaute</h2>
    <div class="feedback-box">
      {{1__feedback}}
    </div>

    <div class="meta">
      <div class="meta-item">
        <div class="meta-label">🏷️ Kategoria</div>
        <div class="meta-value">{{1__category}}</div>
      </div>

      <div class="meta-item">
        <div class="meta-label">⚡ Prioriteetti</div>
        <div class="meta-value priority-{{1__priority}}">{{1__priority}}</div>
      </div>

      <div class="meta-item">
        <div class="meta-label">📍 Sijainti</div>
        <div class="meta-value">{{1__userContext__page}}</div>
      </div>

      <div class="meta-item">
        <div class="meta-label">🔧 Lähde</div>
        <div class="meta-value">{{1__userContext__source}}</div>
      </div>

      <div class="meta-item">
        <div class="meta-label">⏰ Aikaleima</div>
        <div class="meta-value">{{1__userContext__timestamp}}</div>
      </div>

      <div class="meta-item">
        <div class="meta-label">💬 Viesti-ID</div>
        <div class="meta-value" style="font-family: monospace; font-size: 11px;">{{1__timestamp}}</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p style="margin: 0 0 10px 0;">
      <strong>Tämä on esimerkki agentti-orkestraatiosta</strong>
    </p>
    <p style="margin: 0;">
      AI-Panu (Claude) → Zapier Webhook → Gmail<br>
      Sama pattern toimii: CRM, Slack, Sheets, Salesforce, etc.
    </p>
  </div>
</body>
</html>
```

**Zapier Field Mapping Tips:**
- Click on the field → it shows available data from webhook
- Look for fields like: `1. Feedback`, `1. Category`, `1. Priority`
- For nested objects: `1. User Context Page`, `1. User Context Source`
- You can add custom text + variables together

5. Click **Continue**
6. Click **Test Action** (you should receive a test email)
7. Check your email inbox

### Step 4: Turn On the Zap

1. If the test email arrived successfully, click **"Publish"**
2. Turn the Zap **ON**
3. Done! 🎉

---

## 🔐 Configure Your Application

### Add Webhook URL to Environment Variables

1. Copy the Webhook URL from Step 2
2. Create/edit `.env` file in the project root:

```bash
# Zapier Feedback Integration
ZAPIER_FEEDBACK_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/12345/abcdef/
```

3. Restart your dev server:

```bash
npm run dev
```

---

## 🧪 Test the Integration

### Test from UI (3 different ways):

**Method 1: Natural Language (recommended)**
1. Open `http://localhost:5000`
2. Go to **Co-Pilot Chat** (Johdon Co-Pilot tab)
3. Type in chat: `Lähetä palaute: Zapier integraatio toimii loistavasti!`
4. Press Enter
5. Wait for success message: ✅ "Lähetin palautteesi Panulle sähköpostiin"
6. Check your email! 📧

**Method 2: Badge Shortcut**
1. Open Co-Pilot Chat
2. Scroll to footer (below input box)
3. Click **"📨 Lähetä palaute"** badge
4. Input field auto-fills with "Lähetä palaute: "
5. Type your message and press Enter
6. Check email!

**Method 3: Modal Form**
1. Open Co-Pilot Chat
2. Click **💬 icon** in header (next to expand button)
3. Fill in the feedback form:
   - **Category**: UI/UX
   - **Priority**: Medium
   - **Feedback**: "Testing Zapier integration - works great!"
4. Click **"Lähetä palaute"**
5. Wait for success animation
6. Check your email!

### Test from API:

```bash
curl -X POST http://localhost:5000/api/feedback/send \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "API test - feedback system working!",
    "category": "other",
    "priority": "low",
    "userContext": "/test"
  }'
```

---

## 📊 Optional: Add More Actions

### Log to Google Sheets

1. In your Zap, click **"+"** to add another action
2. Search for **"Google Sheets"**
3. Choose **"Create Spreadsheet Row"**
4. Select your spreadsheet (or create one: "Humm Feedback Log")
5. Map columns:
   - **A**: `{{1__timestamp}}`
   - **B**: `{{1__category}}`
   - **C**: `{{1__priority}}`
   - **D**: `{{1__feedback}}`
   - **E**: `{{1__userContext}}`
6. Test and publish

### Send to Slack

1. Add another action: **Slack → Send Channel Message**
2. Choose channel: `#humm-feedback`
3. Message template:

```
:bell: *New Feedback*

*Category:* {{1__category}} | *Priority:* {{1__priority}}

*Feedback:*
> {{1__feedback}}

*Context:* {{1__userContext}} | *Time:* {{1__timestamp}}
```

---

## 🐛 Troubleshooting

### "Feedback system not configured" error

**Problem**: `.env` file doesn't have `ZAPIER_FEEDBACK_WEBHOOK_URL`

**Solution**:
1. Check `.env` file exists in project root
2. Verify the webhook URL is correct
3. Restart dev server

### Feedback sent but no email received

**Problem**: Zap is off or email action failed

**Solution**:
1. Check Zapier dashboard → Zap history
2. Look for errors in the logs
3. Verify email account is still connected
4. Check spam folder

### Dev mode (no webhook configured)

If `ZAPIER_FEEDBACK_WEBHOOK_URL` is not set, the system runs in **dev mode**:
- Feedback is logged to console
- No email is sent
- Returns success message with `devMode: true`

This is useful for development without Zapier costs.

---

## 💰 Cost Estimate

**Zapier Free Tier:**
- 100 tasks/month
- 1 Zap with 2 steps = 2 tasks per feedback
- **50 feedback submissions/month** (free)

**Zapier Starter ($19.99/month):**
- 750 tasks/month
- **375 feedback submissions/month**

For a demo/internal tool, free tier is plenty!

---

## 🎉 Demo Value for Humm

### What This Demonstrates:

1. ✅ **MCP-Style Integration** - Modern webhook-based architecture
2. ✅ **AI → External System** - Co-Pilot can trigger real-world actions
3. ✅ **No-Code + Code** - Zapier (no-code) orchestrated via code
4. ✅ **Scalability** - Same pattern works for: CRM updates, ticketing, notifications
5. ✅ **Business Value** - Feedback loop automation = faster iteration

### Pitch to Humm:

> "This is a simple example of agentic AI orchestration. The Co-Pilot doesn't just answer questions—it can **take actions**.
>
> In production, this same pattern could:
> - Create CRM entries when a customer shows interest
> - Escalate high-priority support tickets to Slack
> - Update internal dashboards with AI insights
> - Trigger workflows in customer's existing systems
>
> All without writing custom integrations for every service. This is the power of modern AI agents + no-code automation."

---

## 📚 Next Steps

Once Zapier is working:
1. Test thoroughly with different feedback types
2. Monitor Zapier task usage
3. Consider adding more actions (Slack, Sheets, etc.)
4. Document for Humm team
5. Show live in demo! 🚀

**Questions?** Check Zapier docs or ask Panu!
