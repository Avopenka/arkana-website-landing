// Creator component types

export interface MasterSuggestion {
  name: string;
  description: string;
  expertise: string[];
  role?: string;
  personality?: string;
}

export interface CouncilData {
  name: string;
  description: string;
  masters: Master[];
  philosophy?: string;
  decisionProcess?: string;
}

export interface Master {
  id: string;
  name: string;
  expertise: string[];
  personality?: string;
  role?: string;
}

export interface CreatorProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  creator_tier: string;
  verification_status: string;
  total_projects: number;
  total_revenue: number;
  follower_count: number;
}
