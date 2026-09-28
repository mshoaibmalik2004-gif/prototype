import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getUserMatches } from '../lib/api';
import { MatchResult, UserProfile } from '../types';
import { ScholarshipCard } from '../components/ScholarshipCard';

interface MatchesPageProps {
  user: UserProfile | null;
  authLoading: boolean;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export function MatchesPage({
  user,
  authLoading,
  savedIds,
  onToggleSave,
}: MatchesPageProps) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getUserMatches()
      .then(({ matches: matchedList }) => {
        if (active) {
          setMatches(matchedList);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <p className="text-sm text-[#555550] py-6">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#232323]">
            Your Scholarship Matches
          </h1>
          <p className="text-sm text-[#555550] mt-1 tabular-nums">
            Filtered for <span className="font-medium text-[#232323]">{user.level}</span> programs with min GPA ≤ <span className="font-medium text-[#232323]">{user.gpa.toFixed(2)}</span>, ranked by field ({user.field}), country ({user.targetCountry}), and deadline urgency.
          </p>
        </div>

        <Link
          to="/profile"
          className="px-3.5 py-2 text-xs font-medium border border-[#0B4F4A] text-[#0B4F4A] bg-white rounded-[6px] hover:bg-[#F2F2EE] whitespace-nowrap"
        >
          Edit Profile Criteria
        </Link>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white border border-[#D8D8D2] rounded-[6px] p-6 text-center">
          <p className="text-sm font-medium text-[#232323]">
            No eligible scholarships match your current GPA ({user.gpa.toFixed(2)}) and study level ({user.level}).
          </p>
          <p className="text-xs text-[#555550] mt-1">
            Try updating your profile GPA or study level, or browse all scholarships directly.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              to="/profile"
              className="px-4 py-2 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px]"
            >
              Update Profile
            </Link>
            <Link
              to="/browse"
              className="px-4 py-2 text-xs font-medium border border-[#0B4F4A] text-[#0B4F4A] rounded-[6px]"
            >
              Browse All
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((item) => (
            <ScholarshipCard
              key={item.scholarship.id}
              scholarship={item.scholarship}
              isSaved={savedIds.includes(item.scholarship.id)}
              onToggleSave={onToggleSave}
              matchScore={item.score}
              matchReasons={item.reasons}
            />
          ))}
        </div>
      )}
    </div>
  );
}
