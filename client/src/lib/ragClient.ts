import { apiRequest } from "./queryClient";

// TypeScript interfaces for RAG responses
export interface RAGSection {
  content: string;
  sources: string[];
  metadata?: Record<string, any>;
}

export interface FailureStat {
  percentage: string;
  description: string;
  source: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  likelihood: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  risks: string[];
  mitigations: string[];
  description?: string;
}

export interface RootCause {
  id: string;
  title: string;
  description: string;
  source: string;
  order: number;
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  checkpoints: string[];
  kpis: string[];
  applicability: string;
}

export interface CaseStudy {
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  source: string;
}

export interface TimelinePhase {
  phase: string;
  duration: string;
  actions: string[];
  kpis: string[];
}

/**
 * Fetch content from RAG API for a specific section
 * @param promptKey - Unique identifier for caching
 * @param query - The question/prompt to send to RAG
 * @returns Parsed JSON response from RAG
 */
export async function fetchRAGSection<T = any>(
  promptKey: string,
  query: string
): Promise<T> {
  try {
    const response = await apiRequest("POST", "/api/rag/chat", {
      message: query,
      topK: 5,
    });

    // Read the streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No reader available from response");
    }

    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.chunk) {
              accumulated += data.chunk;
            }

            if (data.done) {
              // Try to parse as JSON first, otherwise return as text
              try {
                return JSON.parse(accumulated);
              } catch {
                // If not JSON, wrap in object
                return {
                  content: accumulated,
                  sources: ["ai-change-management-bpo.md"],
                } as T;
              }
            }

            if (data.error) {
              throw new Error(data.error);
            }
          } catch (parseError) {
            // Continue if line is not valid JSON
            continue;
          }
        }
      }
    }

    // Fallback if no done signal received
    try {
      return JSON.parse(accumulated);
    } catch {
      return {
        content: accumulated,
        sources: ["ai-change-management-bpo.md"],
      } as T;
    }
  } catch (error) {
    console.error(`RAG fetch error for ${promptKey}:`, error);
    throw error;
  }
}

/**
 * Parse a text response into structured JSON
 * Defensive parsing with fallback values
 */
export function parseRAGResponse<T>(
  content: string,
  fallback: T
): T {
  try {
    // Remove markdown code blocks if present
    const cleaned = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.warn("Failed to parse RAG response, using fallback:", error);
    return fallback;
  }
}
