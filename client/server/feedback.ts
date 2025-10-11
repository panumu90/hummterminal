import type { Express, Request, Response } from "express";

interface FeedbackPayload {
  feedback: string;
  category: 'bug' | 'feature' | 'ui' | 'other';
  priority: 'low' | 'medium' | 'high';
  userContext?: string;
  timestamp: string;
}

export function registerFeedbackRoutes(app: Express) {
  // Send feedback to Zapier webhook
  app.post("/api/feedback/send", async (req: Request, res: Response) => {
    try {
      const { feedback, category, priority, userContext }: FeedbackPayload = req.body;

      // Validation
      if (!feedback || feedback.trim().length === 0) {
        return res.status(400).json({ error: "Feedback cannot be empty" });
      }

      if (!['bug', 'feature', 'ui', 'other'].includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: "Invalid priority" });
      }

      // Get Zapier webhook URL from environment variable
      const zapierWebhookUrl = process.env.ZAPIER_FEEDBACK_WEBHOOK_URL;

      if (!zapierWebhookUrl) {
        console.warn("⚠️  ZAPIER_FEEDBACK_WEBHOOK_URL not configured");

        // In development: log to console instead
        if (process.env.NODE_ENV === 'development') {
          console.log("📨 Feedback received (dev mode):");
          console.log({
            feedback,
            category,
            priority,
            userContext,
            timestamp: new Date().toISOString()
          });

          return res.json({
            success: true,
            message: "Feedback logged (dev mode - no email sent)",
            devMode: true
          });
        }

        return res.status(500).json({
          error: "Feedback system not configured. Please set ZAPIER_FEEDBACK_WEBHOOK_URL"
        });
      }

      // Send to Zapier
      const zapierPayload = {
        feedback,
        category,
        priority: priority.toUpperCase(),
        userContext: userContext || "Not specified",
        timestamp: new Date().toISOString(),
        appVersion: "1.0.0",
        source: "Humm Tech Lead Demo"
      };

      const response = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zapierPayload),
      });

      if (!response.ok) {
        throw new Error(`Zapier webhook failed: ${response.statusText}`);
      }

      console.log("✅ Feedback sent to Zapier successfully");

      return res.json({
        success: true,
        message: "Palaute lähetetty onnistuneesti! Panu vastaa pian.",
      });

    } catch (error: any) {
      console.error("❌ Feedback error:", error);
      return res.status(500).json({
        error: "Failed to send feedback",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Get feedback statistics (optional - for admin dashboard)
  app.get("/api/feedback/stats", async (req: Request, res: Response) => {
    // This could integrate with Google Sheets or database to show feedback stats
    // For now, return mock data
    res.json({
      total: 0,
      byCategory: {
        bug: 0,
        feature: 0,
        ui: 0,
        other: 0
      },
      byPriority: {
        low: 0,
        medium: 0,
        high: 0
      }
    });
  });

  console.log("📨 Feedback routes registered:");
  console.log("   POST   /api/feedback/send");
  console.log("   GET    /api/feedback/stats");
}
