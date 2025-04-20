
import { Client, Metric } from "../types/client";

// Mock clients data
export const mockClients: Client[] = [
  {
    id: "client1",
    name: "Roupa Fashion",
    email: "cliente1@exemplo.com",
    instagram_id: "client1_instagram",
    instagram_token: "IGQVJ...",
    token_status: "valid",
    created_at: "2023-12-15T10:00:00Z",
  },
  {
    id: "client2",
    name: "Café Especial",
    email: "cliente2@exemplo.com",
    instagram_id: "client2_instagram",
    instagram_token: "IGQVJ...",
    token_status: "valid",
    created_at: "2024-01-20T14:30:00Z",
  },
];

// Generate dates for the last 30 days
const generateDates = (count: number) => {
  const dates = [];
  const today = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

const dates = generateDates(30); // Last 30 days

// Random number generator with trend
const randomWithTrend = (min: number, max: number, day: number, trend: number = 0.05) => {
  const base = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.floor(base * (1 + trend * day));
};

// Generate metrics for each client
export const generateMetrics = (clientId: string): Metric[] => {
  const metrics: Metric[] = [];
  
  // Set base values depending on client
  const baseValues = clientId === 'client1' 
    ? { reach: 2000, impressions: 3500, likes: 120, comments: 25, followers: 1500, engagement: 5 }
    : { reach: 1500, impressions: 2500, likes: 80, comments: 15, followers: 900, engagement: 4 };
  
  dates.forEach((date, index) => {
    // Add some randomness to the data, but maintain an upward trend
    metrics.push({
      id: `${clientId}-${date}`,
      client_id: clientId,
      date,
      reach: randomWithTrend(baseValues.reach * 0.9, baseValues.reach * 1.1, index),
      impressions: randomWithTrend(baseValues.impressions * 0.9, baseValues.impressions * 1.1, index),
      likes: randomWithTrend(baseValues.likes * 0.9, baseValues.likes * 1.1, index),
      comments: randomWithTrend(baseValues.comments * 0.9, baseValues.comments * 1.1, index),
      followers: randomWithTrend(baseValues.followers, baseValues.followers * 1.01, index),
      engagement: randomWithTrend(baseValues.engagement * 0.9, baseValues.engagement * 1.1, index)
    });
  });
  
  return metrics;
};

// Generate metrics for all clients
export const mockMetrics: Record<string, Metric[]> = {
  client1: generateMetrics('client1'),
  client2: generateMetrics('client2'),
};

// Service functions
export const getClientById = (clientId: string): Client | undefined => {
  return mockClients.find(client => client.id === clientId);
};

export const getAllClients = (): Client[] => {
  return mockClients;
};

export const getMetricsForClient = (clientId: string): Metric[] => {
  return mockMetrics[clientId] || [];
};
