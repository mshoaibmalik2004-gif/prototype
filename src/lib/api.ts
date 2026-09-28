import {
  COUNTRIES,
  FIELDS_OF_STUDY,
  SCHOLARSHIPS,
  STUDY_LEVELS,
} from '../data/scholarships';
import { DEMO_USER } from '../data/users';
import {
  MatchResult,
  Scholarship,
  ScholarshipFilters,
  StudyLevel,
  UserProfile,
} from '../types';
import { getMatchedScholarships } from './match';

const USER_STORAGE_KEY = 'scholarmatch_lite_user';
const SAVED_STORAGE_KEY = 'scholarmatch_lite_saved_ids';

function delay(ms = 120): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getFilterOptions(): {
  countries: string[];
  levels: StudyLevel[];
  fields: string[];
} {
  return {
    countries: COUNTRIES,
    levels: STUDY_LEVELS,
    fields: FIELDS_OF_STUDY,
  };
}

export async function getFeaturedScholarships(): Promise<Scholarship[]> {
  await delay(100);
  return SCHOLARSHIPS.filter((s) => s.featured).slice(0, 6);
}

export async function getScholarships(
  filters?: ScholarshipFilters
): Promise<Scholarship[]> {
  await delay(120);
  let list = [...SCHOLARSHIPS];

  if (filters) {
    const q = filters.query?.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.field.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    if (filters.country && filters.country !== 'All') {
      list = list.filter((s) => s.country === filters.country);
    }

    if (filters.level && filters.level !== 'All') {
      list = list.filter((s) => s.level === filters.level);
    }

    if (
      typeof filters.userGpa === 'number' &&
      !Number.isNaN(filters.userGpa)
    ) {
      list = list.filter((s) => s.minGpa <= filters.userGpa!);
    }
  }

  return list;
}

export async function getScholarshipById(
  id: string
): Promise<Scholarship | null> {
  await delay(100);
  const found = SCHOLARSHIPS.find((s) => s.id === id);
  return found ?? null;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  await delay(60);
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function loginWithDemo(): Promise<UserProfile> {
  await delay(100);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEMO_USER));
  // Seed a couple of saved scholarships if saved list is empty
  const existingSaved = localStorage.getItem(SAVED_STORAGE_KEY);
  if (!existingSaved) {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(['sch-02', 'sch-06']));
  }
  return DEMO_USER;
}

export async function loginOrSignup(input: {
  email: string;
  name: string;
  gpa: number;
  level: StudyLevel;
  field: string;
  targetCountry: string;
}): Promise<UserProfile> {
  await delay(120);
  const user: UserProfile = {
    id: `user-${Date.now()}`,
    email: input.email.trim(),
    name: input.name.trim(),
    gpa: Number(input.gpa),
    level: input.level,
    field: input.field,
    targetCountry: input.targetCountry,
  };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function updateUserProfile(
  profile: UserProfile
): Promise<UserProfile> {
  await delay(120);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export async function logoutUser(): Promise<void> {
  await delay(60);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export async function getSavedScholarshipIds(): Promise<string[]> {
  await delay(60);
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function toggleSaveScholarship(
  scholarshipId: string
): Promise<{ saved: boolean; ids: string[] }> {
  const current = await getSavedScholarshipIds();
  let next: string[];
  let saved: boolean;

  if (current.includes(scholarshipId)) {
    next = current.filter((id) => id !== scholarshipId);
    saved = false;
  } else {
    next = [...current, scholarshipId];
    saved = true;
  }

  localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
  return { saved, ids: next };
}

export async function removeSavedScholarship(
  scholarshipId: string
): Promise<string[]> {
  const current = await getSavedScholarshipIds();
  const next = current.filter((id) => id !== scholarshipId);
  localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function getSavedScholarships(): Promise<Scholarship[]> {
  await delay(100);
  const ids = await getSavedScholarshipIds();
  return SCHOLARSHIPS.filter((s) => ids.includes(s.id));
}

export async function getUserMatches(): Promise<{
  user: UserProfile | null;
  matches: MatchResult[];
}> {
  await delay(120);
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, matches: [] };
  }
  const matches = getMatchedScholarships(SCHOLARSHIPS, user);
  return { user, matches };
}
