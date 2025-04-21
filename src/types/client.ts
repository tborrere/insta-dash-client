
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

export interface Client {
  id: string;
  name: string;
  email: string;
  password?: string; // Added as optional since it's only used during creation
  instagram_id: string;
  instagram_token: string;
  token_status: 'valid' | 'expired' | 'pending';
  created_at: string;
  drive_url?: string | null;
  notion_url?: string | null;
  anuncios_url?: string | null;
}
