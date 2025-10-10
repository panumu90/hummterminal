/**
 * Helper utilities for Anthropic request validation and safe creation.
 */
export function validateToolPairs(messages: any[], requestId?: string) {
  if (!Array.isArray(messages)) return;

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];

    // Normalize type detection - message may be object with `type` or nested content
    const type = m && (m.type || (m.content && m.content.type));

    if (type === 'tool_use') {
      const toolId = m.tool_id || (m.content && m.content.tool_id);
      const next = messages[i + 1];
      const nextType = next && (next.type || (next.content && next.content.type));
      const nextToolId = next && (next.tool_id || (next.content && next.content.tool_id));

      if (!next || nextType !== 'tool_result' || nextToolId !== toolId) {
        const rid = requestId ? ` request_id=${requestId}` : '';
        console.error(`Anthropic payload validation failed:${rid} - tool_use at index ${i} missing immediate matching tool_result for tool_id=${toolId}`);
        console.error('Offending messages snippet:', JSON.stringify(messages.slice(Math.max(0, i - 2), i + 3), null, 2));
        throw new Error(`Invalid tool_use/tool_result pairing for tool_id=${toolId}`);
      }

      // Skip the next message since it's the matched tool_result
      i++;
    }
  }
}

export async function safeCreate(anthropicClient: any, params: any, requestId?: string) {
  try {
    validateToolPairs(params && params.messages, requestId);
  } catch (err) {
    // Re-throw after logging to prevent sending invalid payloads
    throw err;
  }

  // If validation passed, forward to Anthropic SDK
  return anthropicClient.messages.create(params);
}
