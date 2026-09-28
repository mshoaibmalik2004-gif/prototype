import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedScholarships } from '../lib/api';
import { Scholarship, UserProfile } from '../types';
import { ScholarshipCard } from '../components/ScholarshipCard';

interface HomePageProps {
  user: UserProfile | null;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export function HomePage({ user, savedIds, onToggleSave }: HomePageProps) {
  const [featured, setFeatured] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getFeaturedScholarships()
      .then((data) => {
        if (active) {
          setFeatured(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero section */}
      <section className="bg-white border border-[#D8D8D2] rounded-[6px] p-6 sm:p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232323] tracking-tight">
            Find scholarships you actually qualify for.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#444440] leading-relaxed">
            Filter international scholarships by study level, GPA threshold, academic field, and destination country—without marketing clutter.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/matches"
              className="px-4 py-2.5 text-sm font-medium bg-[#0B4F4A] text-white rounded-[6px] hover:opacity-90 whitespace-nowrap"
            >
              See My Matches
            </Link>
            <Link
              to="/browse"
              className="px-4 py-2.5 text-sm font-medium border border-[#0B4F4A] text-[#0B4F4A] bg-white rounded-[6px] hover:bg-[#F2F2EE] whitespace-nowrap"
            >
              Browse All
            </Link>
          </div>

          {user && (
            <p className="mt-4 text-xs text-[#555550] tabular-nums">
              Signed in as <span className="font-medium text-[#232323]">{user.name}</span> · {user.level} · {user.field} · GPA {user.gpa.toFixed(2)} · Target: {user.targetCountry}
            </p>
          )}
        </div>
      </section>

      {/* 3-Step How It Works list */}
      <section aria-labelledby="how-it-works-heading">
        <h2
          id="how-it-works-heading"
          className="text-lg font-semibold text-[#232323] mb-3"
        >
          How it works
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <li className="bg-white border border-[#D8D8D2] rounded-[6px] p-4">
            <p className="text-xs font-semibold text-[#0B4F4A] tabular-nums">
              01. Enter Your Profile
            </p>
            <p className="mt-1 text-sm text-[#232323]">
              Set your cumulative GPA, degree level, academic field, and target destination country in under a minute.
            </p>
          </li>
          <li className="bg-white border border-[#D8D8D2] rounded-[6px] p-4">
            <p className="text-xs font-semibold text-[#0B4F4A] tabular-nums">
              02. Review Ranked Matches
            </p>
            <p className="mt-1 text-sm text-[#232323]">
              Our eligibility filter excludes programs where you miss the GPA or degree threshold and ranks the rest by score.
            </p>
          </li>
          <li className="bg-white border border-[#D8D8D2] rounded-[6px] p-4">
            <p className="text-xs font-semibold text-[#0B4F4A] tabular-nums">
              03. Save & Track Deadlines
            </p>
            <p className="mt-1 text-sm text-[#232323]">
              Bookmark promising scholarships to your saved list and go straight to official provider links to apply.
            </p>
          </li>
        </ol>
      </section>

      {/* Featured Scholarships Grid (6 items) */}
      <section aria-labelledby="featured-heading">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2
            id="featured-heading"
            className="text-lg font-semibold text-[#232323]"
          >
            Featured Scholarships
          </h2>
          <Link
            to="/browse"
            className="text-xs font-medium text-[#0B4F4A] hover:underline whitespace-nowrap"
          >
            View all scholarships →
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-[#555550] py-6">Loading...</p>
        ) : featured.length === 0 ? (
          <div className="bg-white border border-[#D8D8D2] rounded-[6px] p-6 text-sm text-[#555550]">
            No featured scholarships available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((item) => (
              <ScholarshipCard
                key={item.id}
                scholarship={item}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
