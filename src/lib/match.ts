import { MatchResult, Scholarship, UserProfile } from '../types';

const RELATED_FIELD_GROUPS: string[][] = [
  ['Computer Science', 'Data Science', 'Engineering'],
  ['Public Policy', 'Business & Economics', 'Environmental Science'],
  ['Medicine & Health', 'Environmental Science', 'Data Science'],
];

function areFieldsRelated(fieldA: string, fieldB: string): boolean {
  if (fieldA === fieldB) return true;
  return RELATED_FIELD_GROUPS.some(
    (group) => group.includes(fieldA) && group.includes(fieldB)
  );
}

export function formatPlainDate(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return isoDate;
  const [year, month, day] = parts;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthName = months[month - 1] || '';
  return `${day} ${monthName} ${year}`;
}

/**
 * Pure eligibility filter + weighted arithmetic scoring function.
 * No TF-IDF or ML library used — uses plain if/else and arithmetic:
 * - Eligibility filter: study level must match, and user GPA >= scholarship minGpa.
 * - Score breakdown (100 points max):
 *   1. Field match: up to 35 points
 *   2. GPA margin above minimum: up to 30 points
 *   3. Country match: up to 25 points
 *   4. Deadline urgency: up to 10 points
 */
export function scoreScholarship(
  scholarship: Scholarship,
  user: UserProfile,
  referenceDate: Date = new Date('2026-09-28T12:00:00Z')
): MatchResult | null {
  // 1. Hard eligibility filter
  if (scholarship.level !== user.level) {
    return null;
  }
  if (user.gpa < scholarship.minGpa) {
    return null;
  }

  let score = 0;
  const reasons: string[] = [];

  // 2. Field match (up to 35 pts)
  if (scholarship.field.toLowerCase() === user.field.toLowerCase()) {
    score += 35;
    reasons.push(`Exact field match for ${scholarship.field}`);
  } else if (scholarship.field === 'All Fields') {
    score += 26;
    reasons.push(`Open to all fields including ${user.field}`);
  } else if (areFieldsRelated(scholarship.field, user.field)) {
    score += 20;
    reasons.push(`Related academic discipline (${scholarship.field})`);
  } else {
    score += 8;
  }

  // 3. GPA margin (up to 30 pts)
  const gpaMargin = Number((user.gpa - scholarship.minGpa).toFixed(2));
  if (gpaMargin >= 0.4) {
    score += 30;
    reasons.push(
      `Your GPA (${user.gpa.toFixed(2)}) is +${gpaMargin.toFixed(2)} above the ${scholarship.minGpa.toFixed(1)} minimum`
    );
  } else if (gpaMargin >= 0.2) {
    score += 25;
    reasons.push(
      `Your GPA (${user.gpa.toFixed(2)}) clears the ${scholarship.minGpa.toFixed(1)} requirement by +${gpaMargin.toFixed(2)}`
    );
  } else {
    score += 20;
    reasons.push(
      `Meets the ${scholarship.minGpa.toFixed(1)} minimum GPA requirement (yours: ${user.gpa.toFixed(2)})`
    );
  }

  // 4. Country match (up to 25 pts)
  if (
    !user.targetCountry ||
    user.targetCountry === 'Any' ||
    scholarship.country.toLowerCase() === user.targetCountry.toLowerCase()
  ) {
    score += 25;
    reasons.push(`Matches your target country (${scholarship.country})`);
  } else {
    score += 10;
  }

  // 5. Deadline urgency (up to 10 pts)
  const deadlineTime = new Date(`${scholarship.deadline}T23:59:59Z`).getTime();
  const daysLeft = Math.ceil(
    (deadlineTime - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft >= 0 && daysLeft <= 45) {
    score += 10;
    reasons.push(
      `Priority deadline in ${daysLeft} days (${formatPlainDate(scholarship.deadline)})`
    );
  } else if (daysLeft > 45 && daysLeft <= 120) {
    score += 8;
    if (reasons.length < 3) {
      reasons.push(
        `Upcoming deadline on ${formatPlainDate(scholarship.deadline)}`
      );
    }
  } else if (daysLeft > 120) {
    score += 6;
    if (reasons.length < 3) {
      reasons.push(
        `Open until ${formatPlainDate(scholarship.deadline)} for ${scholarship.level} applicants`
      );
    }
  } else {
    score += 2;
  }

  const finalScore = Math.min(100, Math.max(1, Math.round(score)));

  return {
    scholarship,
    score: finalScore,
    reasons: reasons.slice(0, 3),
  };
}

export function getMatchedScholarships(
  scholarships: Scholarship[],
  user: UserProfile,
  referenceDate?: Date
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const item of scholarships) {
    const match = scoreScholarship(item, user, referenceDate);
    if (match !== null) {
      results.push(match);
    }
  }

  return results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.scholarship.deadline.localeCompare(b.scholarship.deadline);
  });
}
