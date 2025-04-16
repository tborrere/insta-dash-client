
export interface Client {
  id: string;
  name: string;
  email: string;
  instagram_id: string;
  instagram_token: string;
  token_status: 'valid' | 'expired';
  created_at: string;
  logo_url?: string;
}

export interface Metric {
  id: string;
  client_id: string;
  date: string;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  followers: number;
  engagement: number;
}

export interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}
