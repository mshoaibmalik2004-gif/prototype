export type StudyLevel = 'Undergraduate' | 'Masters' | 'PhD';

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  country: string;
  level: StudyLevel;
  field: string;
  minGpa: number;
  deadline: string; // YYYY-MM-DD format
  link: string;
  description: string;
  featured?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  gpa: number;
  level: StudyLevel;
  field: string;
  targetCountry: string;
}

export interface MatchResult {
  scholarship: Scholarship;
  score: number; // 0 to 100 percentage
  reasons: string[]; // 2-3 plain-text explanation points
}

export interface ScholarshipFilters {
  query?: string;
  country?: string;
  level?: string;
  userGpa?: number | null;
}
