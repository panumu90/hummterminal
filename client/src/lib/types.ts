export interface CaseMetric {
  label: string;
  value: string;
  type: 'success' | 'efficiency' | 'savings' | 'metric';
}

export interface Case {
  id: string;
  company: string;
  country: string;
  industry: string;
  solution_name: string;
  description: string;
  key_metrics: CaseMetric[];
  learning_points: string[];
  category: string;
  icon: string;
  full_text: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: number;
}
