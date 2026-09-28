import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { Scholarship } from '../types';
import { formatPlainDate } from '../lib/match';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  matchScore?: number;
  matchReasons?: string[];
}

export function ScholarshipCard({
  scholarship,
  isSaved,
  onToggleSave,
  matchScore,
  matchReasons,
}: ScholarshipCardProps) {
  return (
    <article className="bg-white border border-[#D8D8D2] rounded-[6px] p-4 sm:p-5 flex flex-col justify-between">
      <div>
        {/* Clean unboxed metadata kicker with typographic separators */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#555550] tabular-nums mb-1.5">
          <span>{scholarship.country}</span>
          <span aria-hidden="true">·</span>
          <span>{scholarship.level}</span>
          <span aria-hidden="true">·</span>
          <span>{scholarship.field}</span>
          <span aria-hidden="true">·</span>
          <span>Min GPA {scholarship.minGpa.toFixed(1)}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-[#232323] leading-snug">
            <Link
              to={`/scholarships/${scholarship.id}`}
              className="hover:text-[#0B4F4A] hover:underline"
            >
              {scholarship.title}
            </Link>
          </h3>

          {typeof matchScore === 'number' && (
            <span className="text-sm font-bold text-[#0B4F4A] tabular-nums whitespace-nowrap shrink-0">
              {matchScore}% Match
            </span>
          )}
        </div>

        <p className="text-xs text-[#555550] mt-1">{scholarship.provider}</p>

        <p className="text-sm text-[#232323] mt-2.5 line-clamp-2 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Match reasons shown as plain text under the card content when on Matches page */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#E6E6E0]">
            <p className="text-xs font-semibold text-[#232323] mb-1">
              Why this matches your profile:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-[#444440] tabular-nums">
              {matchReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E6E6E0] flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-[#555550] tabular-nums">
          Deadline: {formatPlainDate(scholarship.deadline)}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSave(scholarship.id)}
            aria-pressed={isSaved}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] border whitespace-nowrap cursor-pointer ${
              isSaved
                ? 'bg-[#E8734A] text-white border-[#E8734A]'
                : 'bg-white text-[#232323] border-[#D8D8D2] hover:border-[#0B4F4A] hover:text-[#0B4F4A]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <Link
            to={`/scholarships/${scholarship.id}`}
            className="px-3 py-1.5 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px] hover:opacity-90 whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
