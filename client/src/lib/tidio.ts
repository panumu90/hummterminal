// Live Chat Integration Utilities

export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
  agent?: string;
}

/**
 * Check if live chat integration is available
 */
export function isLiveChatAvailable(): boolean {
  // Live chat is always available in this implementation
  return true;
}

/**
 * Format chat history for handoff
 */
export function formatChatHistoryForHandoff(messages: ChatMessage[]): string {
  const historyText = messages
    .map(msg => {
      const role = msg.isUser ? 'Käyttäjä' : 'AI-Panu';
      const time = new Date(msg.timestamp).toLocaleTimeString('fi-FI');
      return `[${time}] ${role}: ${msg.content}`;
    })
    .join('\n\n');

  return `📋 KESKUSTELUHISTORIA AI-PANUSTA:

${historyText}

---
Käyttäjä siirretty live chattiin Tech Lead -keskustelusta.`;
}

/**
 * Send a live chat message (for human operator)
 */
export async function sendLiveChatMessage(
  message: string, 
  sessionId: string, 
  isHuman: boolean = false
): Promise<any> {
  try {
    const response = await fetch('/api/live-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        is_human: isHuman
      })
    });

    if (!response.ok) {
      throw new Error(`Live chat API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send live chat message:', error);
    throw error;
  }
}