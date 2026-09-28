import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Trash2 } from 'lucide-react';
import { getSavedScholarships } from '../lib/api';
import { formatPlainDate } from '../lib/match';
import { Scholarship } from '../types';

interface SavedPageProps {
  savedIds: string[];
  onRemoveSaved: (id: string) => Promise<void>;
}

export function SavedPage({ savedIds, onRemoveSaved }: SavedPageProps) {
  const [savedItems, setSavedItems] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getSavedScholarships()
      .then((items) => {
        if (active) {
          setSavedItems(items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [savedIds]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#232323]">
          Saved Scholarships
        </h1>
        <p className="text-sm text-[#555550] mt-1">
          Bookmarked scholarships stored in your browser with application deadlines.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-[#555550] py-6">Loading...</p>
      ) : savedItems.length === 0 ? (
        <div className="bg-white border border-[#D8D8D2] rounded-[6px] p-6 text-center">
          <p className="text-sm font-medium text-[#232323]">
            You have no saved scholarships yet.
          </p>
          <p className="text-xs text-[#555550] mt-1">
            Click the "Save" button on any scholarship card to bookmark it here.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              to="/browse"
              className="px-4 py-2 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px]"
            >
              Browse Scholarships
            </Link>
            <Link
              to="/matches"
              className="px-4 py-2 text-xs font-medium border border-[#0B4F4A] text-[#0B4F4A] rounded-[6px]"
            >
              See My Matches
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {savedItems.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-[#D8D8D2] rounded-[6px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#555550] tabular-nums">
                  <span>{item.country}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.level}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.field}</span>
                  <span aria-hidden="true">·</span>
                  <span>Min GPA {item.minGpa.toFixed(1)}</span>
                </div>

                <h2 className="text-base font-semibold text-[#232323]">
                  <Link
                    to={`/scholarships/${item.id}`}
                    className="hover:text-[#0B4F4A] hover:underline"
                  >
                    {item.title}
                  </Link>
                </h2>

                <p className="text-xs text-[#555550]">{item.provider}</p>

                <p className="text-xs font-semibold text-[#232323] tabular-nums pt-1">
                  Deadline: {formatPlainDate(item.deadline)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  to={`/scholarships/${item.id}`}
                  className="px-3 py-1.5 text-xs font-medium border border-[#0B4F4A] text-[#0B4F4A] rounded-[6px] hover:bg-[#F2F2EE] whitespace-nowrap"
                >
                  Details
                </Link>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px] hover:opacity-90 whitespace-nowrap"
                >
                  Official Link
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => onRemoveSaved(item.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[#C93B2B] text-[#C93B2B] bg-white rounded-[6px] hover:bg-[#FDF3F2] whitespace-nowrap cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
