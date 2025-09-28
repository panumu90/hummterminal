// Tidio Live Chat Integration Utilities

// Declare global Tidio types for TypeScript
declare global {
  interface Window {
    tidioChatApi: {
      isReady: boolean;
      isHidden: boolean;
      open: () => void;
      hide: () => void;
      sendMessage: (message: string) => void;
      onMessage: (callback: (data: any) => void) => void;
      messageCallback?: (data: any) => void;
    };
    tidioChat?: {
      show: () => void;
      hide: () => void;
      messageFromVisitor: (message: string) => void;
      on: (event: string, callback: (data: any) => void) => void;
    };
    initTidio: () => void;
  }
}

export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
  agent?: string;
}

/**
 * Check if Tidio is available and ready
 */
export function isTidioReady(): boolean {
  return !!(window.tidioChatApi && window.tidioChatApi.isReady);
}

/**
 * Check if Tidio integration is configured
 */
export async function isTidioConfigured(): Promise<boolean> {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) return false;
    const config = await response.json();
    return config.tidio?.configured || false;
  } catch (error) {
    console.error('Failed to check Tidio configuration:', error);
    return false;
  }
}

/**
 * Initialize Tidio (call this when component mounts)
 */
export function initializeTidio(): void {
  if (typeof window !== 'undefined' && window.initTidio) {
    window.initTidio();
  }
}

/**
 * Format chat history for Tidio handoff
 */
export function formatChatHistoryForTidio(messages: ChatMessage[]): string {
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
Käyttäjä siirretty live chattiin Tech Lead -keskustelusta. Tarvitsee lisätietoja tai teknistä apua.`;
}

/**
 * Send message to Tidio (from user in modal)
 */
export function sendMessageToTidio(message: string): void {
  if (isTidioReady()) {
    window.tidioChatApi.sendMessage(message);
    console.log('Message sent to Tidio:', message.substring(0, 50) + '...');
  } else {
    console.warn('Tidio is not ready - message not sent:', message);
  }
}

/**
 * Set up listener for Tidio operator messages
 */
export function onTidioMessage(callback: (data: { content: string; isFromOperator: boolean; timestamp: number }) => void): void {
  if (isTidioReady()) {
    window.tidioChatApi.onMessage(callback);
  } else {
    console.warn('Tidio is not ready - cannot set up message listener');
  }
}

/**
 * Handle handoff to Tidio with conversation context
 */
export async function handoffToTidio(
  messages: ChatMessage[], 
  userMessage?: string,
  sessionId?: string
): Promise<boolean> {
  try {
    if (!isTidioReady()) {
      console.error('Tidio is not ready for handoff');
      return false;
    }

    // Format and send conversation history to backend first
    const historyMessage = formatChatHistoryForTidio(messages);
    const fullContext = userMessage 
      ? `${historyMessage}\n\n📝 VIIMEISIN VIESTI:\n"${userMessage}"`
      : historyMessage;

    // Send context to Tidio via backend
    try {
      const response = await fetch('/api/tidio/send-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: fullContext,
          userMessage: userMessage || '',
          sessionId: sessionId || 'unknown'
        })
      });

      if (!response.ok) {
        console.warn('Failed to send context via API');
      }
    } catch (error) {
      console.warn('API context sending failed:', error);
    }

    // Send the user message to Tidio if provided
    if (userMessage) {
      sendMessageToTidio(userMessage);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to handoff to Tidio:', error);
    return false;
  }
}

/**
 * Check if live chat integration is available
 */
export function isLiveChatAvailable(): boolean {
  return isTidioReady();
}

/**
 * Format chat history for handoff (backward compatibility)
 */
export function formatChatHistoryForHandoff(messages: ChatMessage[]): string {
  return formatChatHistoryForTidio(messages);
}

/**
 * Send a live chat message (backward compatibility for modal)
 */
export async function sendLiveChatMessage(
  message: string, 
  sessionId: string, 
  isHuman: boolean = false
): Promise<any> {
  if (isHuman) {
    // This would be used by operators - not implemented in Tidio bridge
    throw new Error('Human messages should be sent through Tidio dashboard');
  }
  
  // User message - send to Tidio
  sendMessageToTidio(message);
  
  return {
    response: '💬 **Viesti lähetetty asiakaspalveluun**\n\nAsiakaspalvelijasi vastaa hetken kuluttua Tidio-järjestelmän kautta.',
    agent: 'system',
    session_id: sessionId,
    timestamp: Date.now()
  };
}