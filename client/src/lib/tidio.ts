// Tidio Chat Integration Utilities

// Declare global Tidio types for TypeScript
declare global {
  interface Window {
    tidioChatApi: {
      isReady: boolean;
      open: () => void;
      sendMessage: (message: string) => void;
      hide: () => void;
      show?: () => void;
      messageToOperator?: (message: string) => void;
    };
    tidioChat?: {
      show: () => void;
      hide: () => void;
      messageToOperator: (message: string) => void;
    };
    initTidio: () => void;
  }
}

export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
}

/**
 * Check if Tidio is available and ready
 */
export function isTidioReady(): boolean {
  return !!(window.tidioChatApi && window.tidioChatApi.isReady);
}

/**
 * Open Tidio chat widget
 */
export function openTidioChat(): void {
  if (isTidioReady()) {
    window.tidioChatApi.open();
  } else {
    console.warn('Tidio chat is not ready yet');
  }
}

/**
 * Hide Tidio chat widget
 */
export function hideTidioChat(): void {
  if (isTidioReady()) {
    window.tidioChatApi.hide();
  }
}

/**
 * Send a message to Tidio operator
 */
export function sendMessageToTidio(message: string): void {
  if (isTidioReady()) {
    window.tidioChatApi.sendMessage(message);
  } else {
    console.warn('Tidio chat is not ready - message not sent:', message);
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
 * Handle handoff to Tidio with conversation context
 */
export async function handoffToTidio(
  messages: ChatMessage[], 
  userMessage?: string
): Promise<boolean> {
  try {
    if (!isTidioReady()) {
      console.error('Tidio is not ready for handoff');
      return false;
    }

    // Format and send conversation history
    const historyMessage = formatChatHistoryForTidio(messages);
    
    // Add current user message if provided
    const fullContext = userMessage 
      ? `${historyMessage}\n\n📝 VIIMEISIN VIESTI:\n"${userMessage}"`
      : historyMessage;

    // Send context to Tidio via backend (if API token is available)
    try {
      const response = await fetch('/api/tidio/send-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: fullContext,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        console.warn('Failed to send context via API, sending directly to widget');
        // Fallback: send via widget
        sendMessageToTidio(fullContext);
      }
    } catch (error) {
      console.warn('API context sending failed, using widget fallback:', error);
      // Fallback: send directly to widget
      sendMessageToTidio(fullContext);
    }

    // Open Tidio chat widget
    openTidioChat();
    
    return true;
  } catch (error) {
    console.error('Failed to handoff to Tidio:', error);
    return false;
  }
}

/**
 * Check if Tidio integration is configured
 */
export async function isTidioConfigured(): Promise<boolean> {
  try {
    const response = await fetch('/api/config');
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