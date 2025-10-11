# Zapier Feedback Integration - Setup Guide

This guide shows how to set up the Zapier integration for the feedback system, allowing users to send feedback from the Co-Pilot chat directly to your email.

## 🎯 What This Does

When a user clicks the feedback button in the Co-Pilot chat and submits feedback, it:
1. Sends data to a Zapier webhook
2. Zapier processes the webhook
3. Sends an email to you with the feedback details
4. (Optional) Logs to Google Sheets/Notion/Slack

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
Configure the email template:

- **To**: `your-email@example.com` (your email)
- **Subject**: `🔔 Palaute Humm-apista: {{1__category}}`
- **Body**: Use this template:

```
📨 UUSI PALAUTE HUMM-APPISTA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 PALAUTE:
{{1__feedback}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏷️  KATEGORIA:  {{1__category}}
⚡  PRIORITEETTI: {{1__priority}}
📍  SIJAINTI:    {{1__userContext}}
⏰  AIKALEIMA:   {{1__timestamp}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧  Lähde:    {{1__source}}
📦  Versio:   {{1__appVersion}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tämä palaute lähetettiin automaattisesti Humm Tech Lead -sovelluksesta käyttämällä Zapier-integraatiota.
```

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

### Test from UI:

1. Open `http://localhost:5000`
2. Look at the **Co-Pilot Chat** (left panel)
3. Click the **💬 Message icon** in the header
4. Fill in the feedback form:
   - **Category**: UI/UX
   - **Priority**: Medium
   - **Feedback**: "Testing Zapier integration - works great!"
5. Click **"Lähetä palaute"**
6. Check your email - you should receive the feedback!

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
