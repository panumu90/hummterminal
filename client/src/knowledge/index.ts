/**
 * Knowledge Base Index
 *
 * This file provides programmatic access to the knowledge base
 * for the Co-Pilot when PDF parsing fails.
 */

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  filePath: string;
}

export const knowledgeBase: KnowledgeDocument[] = [
  {
    id: 'cx-ai-trends-2025',
    title: 'CX AI -trendit 2025',
    category: 'AI Trends',
    tags: ['AI', 'customer-experience', 'trends', '2025', 'automation', 'autonomiset-agentit'],
    summary: 'Asiantuntijanäkemykset CX AI -trendeistä vuodelle 2025: autonomiset AI-agentit, ROI-odotukset, hyperhenkilökohtaistaminen, ennakoiva asiakaspalvelu, ihmisen ja AI:n yhteistyö.',
    filePath: '/src/knowledge/cx-ai-trends-2025.md'
  },
  {
    id: 'humm-financial-analysis',
    title: 'Humm Group Oy - Financial Analysis & AI Implementation Potential',
    category: 'Company Analysis',
    tags: ['Humm', 'financial-analysis', 'AI-potential', 'BPO', 'strategy', '10M-goal'],
    summary: 'Kattava analyysi Humm Group Oy:n taloudellisesta tilanteesta, kilpailija-analyysistä, AI-transformaation potentiaalista ja suosituksista 10M€ liikevaihdon saavuttamiseksi.',
    filePath: '/src/knowledge/humm-financial-analysis.md'
  },
  {
    id: 'model-context-protocol',
    title: 'Model Context Protocol (MCP)',
    category: 'Technology',
    tags: ['MCP', 'AI-security', 'integration', 'context-management', 'tietoturva'],
    summary: 'MCP-protokollan kuvaus: standardoitu rajapinta AI-mallien turvalliseen yhdistämiseen ulkoisiin järjestelmiin. Tietoturvaedut, käyttötapaukset ja implementointisuositukset.',
    filePath: '/src/knowledge/model-context-protocol.md'
  }
];

/**
 * Search knowledge base by keywords
 */
export function searchKnowledge(query: string): KnowledgeDocument[] {
  const lowerQuery = query.toLowerCase();
  return knowledgeBase.filter(doc =>
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.summary.toLowerCase().includes(lowerQuery) ||
    doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get knowledge document by ID
 */
export function getKnowledgeById(id: string): KnowledgeDocument | undefined {
  return knowledgeBase.find(doc => doc.id === id);
}

/**
 * Get all documents by category
 */
export function getKnowledgeByCategory(category: string): KnowledgeDocument[] {
  return knowledgeBase.filter(doc => doc.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(knowledgeBase.map(doc => doc.category)));
}

/**
 * Get all unique tags
 */
export function getTags(): string[] {
  return Array.from(new Set(knowledgeBase.flatMap(doc => doc.tags)));
}
