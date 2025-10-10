/**
 * AI Orchestrator for Humm-Desk
 *
 * Handles intelligent ticket classification, priority assignment,
 * team routing, and auto-response generation
 */

import Anthropic from '@anthropic-ai/sdk';
import { safeCreate } from './anthropic-utils';
import { ChatwootClient } from './chatwoot-client';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

interface ClassificationResult {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  suggestedTeam?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number; // 0-100
  reasoning: string;
}

interface DraftResponse {
  content: string;
  confidence: number; // 0-100
  shouldAutoSend: boolean;
  reasoning: string;
}

export class AIOrchestrator {
  private chatwoot: ChatwootClient;

  constructor(chatwootClient: ChatwootClient) {
    this.chatwoot = chatwootClient;
  }

  /**
   * Classify incoming message using Claude AI
   */
  async classifyMessage(messageContent: string, conversationContext?: string): Promise<ClassificationResult> {
    console.log('🤖 AI Classification starting...');

    const systemPrompt = `You are an AI assistant for Humm-Desk, a BPO customer support platform.
Your task is to classify incoming customer messages and determine:
1. Priority level (low, medium, high, urgent)
2. Category (technical, billing, general inquiry, complaint, feature request, etc.)
3. Suggested team assignment (Enterprise Support, SMB Support, VIP Client Team)
4. Customer sentiment (positive, neutral, negative)
5. Confidence score (0-100)

Respond ONLY with valid JSON in this exact format:
{
  "priority": "low|medium|high|urgent",
  "category": "category name",
  "suggestedTeam": "team name",
  "sentiment": "positive|neutral|negative",
  "confidence": 85,
  "reasoning": "brief explanation"
}

Priority guidelines:
- urgent: System down, data loss, security breach, VIP client critical issue
- high: Service degraded, payment issues, angry customer
- medium: Feature not working, questions about billing, general complaints
- low: General questions, feature requests, positive feedback

Team guidelines:
- Enterprise Support Team: Large corporate clients, complex technical issues
- SMB Support Team: Small/medium business clients, standard support
- VIP Client Team: High-value clients regardless of issue complexity`;

    const userPrompt = conversationContext
      ? `Previous conversation:\n${conversationContext}\n\nNew message:\n${messageContent}`
      : `Customer message:\n${messageContent}`;

    try {
      const response = await safeCreate(anthropic, {
        model: DEFAULT_MODEL,
        max_tokens: 500,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      }, undefined);

      const textContent = response.content.find(c => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from AI');
      }

      // Parse JSON response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const classification: ClassificationResult = JSON.parse(jsonMatch[0]);
      console.log('✅ Classification complete:', classification);

      return classification;
    } catch (error) {
      console.error('❌ Classification error:', error);
      // Fallback to safe defaults
      return {
        priority: 'medium',
        category: 'general',
        suggestedTeam: 'SMB Support Team',
        sentiment: 'neutral',
        confidence: 50,
        reasoning: 'AI classification failed, using default values',
      };
    }
  }

  /**
   * Generate draft response using Claude AI
   */
  async generateDraftResponse(
    messageContent: string,
    classification: ClassificationResult,
    conversationHistory?: string
  ): Promise<DraftResponse> {
    console.log('✍️ AI Draft generation starting...');

    const systemPrompt = `You are a professional customer support agent for Humm-Desk.
Generate a helpful, empathetic, and professional response to customer messages.

Guidelines:
- Be concise but complete (2-4 paragraphs max)
- Match the urgency to the priority level
- Show empathy for frustrated customers
- Provide clear next steps
- Use professional but friendly tone
- Sign off with "Best regards, Humm-Desk Support Team"

Also determine:
- Confidence score (0-100) for your response quality
- Whether the response should be auto-sent (only if confidence > 90 AND priority is low)

Respond with JSON in this format:
{
  "content": "the response message",
  "confidence": 85,
  "shouldAutoSend": false,
  "reasoning": "brief explanation of confidence and auto-send decision"
}`;

    const userPrompt = `Priority: ${classification.priority}
Category: ${classification.category}
Sentiment: ${classification.sentiment}

${conversationHistory ? `Conversation history:\n${conversationHistory}\n\n` : ''}Customer message:\n${messageContent}`;

    try {
      const response = await safeCreate(anthropic, {
        model: DEFAULT_MODEL,
        max_tokens: 1000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      }, undefined);

      const textContent = response.content.find(c => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from AI');
      }

      // Parse JSON response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const draft: DraftResponse = JSON.parse(jsonMatch[0]);

      // Override auto-send if priority is not low
      if (classification.priority !== 'low') {
        draft.shouldAutoSend = false;
        draft.reasoning += ' (auto-send disabled for non-low priority)';
      }

      console.log('✅ Draft generated:', {
        confidence: draft.confidence,
        shouldAutoSend: draft.shouldAutoSend
      });

      return draft;
    } catch (error) {
      console.error('❌ Draft generation error:', error);
      // Fallback response
      return {
        content: `Thank you for contacting Humm-Desk support. We have received your message and our team will review it shortly. We aim to respond within 24 hours.\n\nBest regards,\nHumm-Desk Support Team`,
        confidence: 60,
        shouldAutoSend: false,
        reasoning: 'AI draft generation failed, using fallback template',
      };
    }
  }

  /**
   * Process incoming webhook from Chatwoot
   */
  async processWebhook(webhookData: any): Promise<{
    success: boolean;
    action: string;
    details: any;
  }> {
    console.log('🔔 Processing webhook:', webhookData.event);

    try {
      // Only process incoming messages (not agent replies)
      if (webhookData.event !== 'message_created') {
        return {
          success: true,
          action: 'ignored',
          details: { reason: 'Not a message_created event' },
        };
      }

      const message = webhookData.message;
      if (!message || message.message_type !== 'incoming') {
        return {
          success: true,
          action: 'ignored',
          details: { reason: 'Not an incoming message' },
        };
      }

      const accountId = webhookData.account?.id;
      const conversationId = webhookData.conversation?.id;

      if (!accountId || !conversationId) {
        throw new Error('Missing account or conversation ID in webhook');
      }

      console.log(`📧 Processing message #${message.id} in conversation #${conversationId}`);

      // Step 1: Classify the message
      const classification = await this.classifyMessage(
        message.content,
        webhookData.conversation?.messages?.slice(-5).map((m: any) => m.content).join('\n')
      );

      // Step 2: Update conversation with classification
      await this.chatwoot.updateConversation(accountId, conversationId, {
        priority: classification.priority,
        custom_attributes: {
          ai_category: classification.category,
          ai_sentiment: classification.sentiment,
          ai_confidence: classification.confidence,
        },
      });

      // Step 3: Assign to suggested team (if available)
      if (classification.suggestedTeam) {
        const teams = await this.chatwoot.listTeams(accountId);
        const matchingTeam = teams.find(t =>
          t.name.toLowerCase().includes(classification.suggestedTeam!.toLowerCase())
        );

        if (matchingTeam) {
          await this.chatwoot.assignConversation(accountId, conversationId, {
            team_id: matchingTeam.id,
          });
          console.log(`👥 Assigned to team: ${matchingTeam.name}`);
        }
      }

      // Step 4: Generate draft response
      const draft = await this.generateDraftResponse(
        message.content,
        classification,
        webhookData.conversation?.messages?.slice(-5).map((m: any) => `[${m.sender?.name}]: ${m.content}`).join('\n\n')
      );

      // Step 5: Create private note with AI draft
      await this.chatwoot.createMessage(accountId, conversationId, {
        content: `🤖 **AI Draft Response** (Confidence: ${draft.confidence}%)\n\n${draft.content}\n\n---\n*${draft.reasoning}*`,
        private: true,
      });

      console.log('📝 AI draft saved as private note');

      // Step 6: Auto-send if confidence is high and priority is low
      if (draft.shouldAutoSend && draft.confidence >= 90 && classification.priority === 'low') {
        await this.chatwoot.createMessage(accountId, conversationId, {
          content: draft.content,
          message_type: 'outgoing',
        });

        console.log('⚡ Response auto-sent (high confidence + low priority)');

        return {
          success: true,
          action: 'auto_sent',
          details: {
            classification,
            draft,
            conversationId,
          },
        };
      }

      return {
        success: true,
        action: 'draft_created',
        details: {
          classification,
          draft,
          conversationId,
        },
      };
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      return {
        success: false,
        action: 'error',
        details: { error: error instanceof Error ? error.message : String(error) },
      };
    }
  }
}
