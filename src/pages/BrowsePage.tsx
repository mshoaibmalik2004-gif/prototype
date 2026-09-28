import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getFilterOptions, getScholarships } from '../lib/api';
import { Scholarship } from '../types';
import { ScholarshipCard } from '../components/ScholarshipCard';

interface BrowsePageProps {
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

const PAGE_SIZE = 6;

export function BrowsePage({ savedIds, onToggleSave }: BrowsePageProps) {
  const { countries, levels } = getFilterOptions();

  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('All');
  const [level, setLevel] = useState('All');
  const [gpaInput, setGpaInput] = useState('');
  const [gpaError, setGpaError] = useState('');

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let parsedGpa: number | null = null;
    if (gpaInput.trim() !== '') {
      const num = Number(gpaInput);
      if (Number.isNaN(num) || num < 0 || num > 4.0) {
        setGpaError('Enter a valid GPA between 0.0 and 4.0.');
        return;
      }
      parsedGpa = num;
    }
    setGpaError('');

    let active = true;
    setLoading(true);

    getScholarships({
      query,
      country,
      level,
      userGpa: parsedGpa,
    })
      .then((results) => {
        if (active) {
          setScholarships(results);
          setPage(1);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, country, level, gpaInput]);

  const totalPages = Math.max(1, Math.ceil(scholarships.length / PAGE_SIZE));
  const paginatedItems = scholarships.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleResetFilters = () => {
    setQuery('');
    setCountry('All');
    setLevel('All');
    setGpaInput('');
    setGpaError('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#232323]">
          Browse Scholarships
        </h1>
        <p className="text-sm text-[#555550] mt-1">
          Search and filter all sample scholarships by destination country, study level, or your GPA.
        </p>
      </div>

      {/* Filter Bar */}
      <section
        aria-label="Scholarship Filters"
        className="bg-white border border-[#D8D8D2] rounded-[6px] p-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Text Search */}
          <div>
            <label
              htmlFor="search-query"
              className="block text-xs font-medium text-[#232323] mb-1"
            >
              Search keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#555550] absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                id="search-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, field, provider..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-[#D8D8D2] rounded-[6px] bg-[#FAFAF8] text-[#232323] focus:outline-2 focus:outline-[#0B4F4A]"
              />
            </div>
          </div>

          {/* Country Dropdown */}
          <div>
            <label
              htmlFor="filter-country"
              className="block text-xs font-medium text-[#232323] mb-1"
            >
              Country
            </label>
            <select
              id="filter-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-[#D8D8D2] rounded-[6px] bg-[#FAFAF8] text-[#232323] focus:outline-2 focus:outline-[#0B4F4A]"
            >
              <option value="All">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Study Level Dropdown */}
          <div>
            <label
              htmlFor="filter-level"
              className="block text-xs font-medium text-[#232323] mb-1"
            >
              Study Level
            </label>
            <select
              id="filter-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-[#D8D8D2] rounded-[6px] bg-[#FAFAF8] text-[#232323] focus:outline-2 focus:outline-[#0B4F4A]"
            >
              <option value="All">All Levels</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Max Min GPA Input (shows scholarships where minGpa <= entered GPA) */}
          <div>
            <label
              htmlFor="filter-gpa"
              className="block text-xs font-medium text-[#232323] mb-1"
            >
              Your GPA (shows eligible min GPA)
            </label>
            <input
              id="filter-gpa"
              type="number"
              step="0.1"
              min="0"
              max="4.0"
              value={gpaInput}
              onChange={(e) => setGpaInput(e.target.value)}
              placeholder="e.g. 3.5"
              className="w-full px-3 py-1.5 text-sm border border-[#D8D8D2] rounded-[6px] bg-[#FAFAF8] text-[#232323] tabular-nums focus:outline-2 focus:outline-[#0B4F4A]"
            />
            {gpaError && (
              <p role="alert" className="text-xs text-[#C93B2B] mt-1">
                {gpaError}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E6E6E0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#555550]">
          <span className="tabular-nums">
            Showing {scholarships.length} scholarship
            {scholarships.length === 1 ? '' : 's'}
          </span>
          {(query || country !== 'All' || level !== 'All' || gpaInput) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#0B4F4A] font-medium hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </section>

      {/* Results Area */}
      {loading ? (
        <p className="text-sm text-[#555550] py-6">Loading...</p>
      ) : scholarships.length === 0 ? (
        <div className="bg-white border border-[#D8D8D2] rounded-[6px] p-6 text-center">
          <p className="text-sm text-[#232323] font-medium">
            No scholarships match your filters.
          </p>
          <p className="text-xs text-[#555550] mt-1">
            Try clearing your keyword search or raising the GPA filter.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-3 px-4 py-2 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px] cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedItems.map((item) => (
              <ScholarshipCard
                key={item.id}
                scholarship={item}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>

          {/* Simple Prev / Next Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#D8D8D2]">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-medium border border-[#0B4F4A] text-[#0B4F4A] bg-white rounded-[6px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>

              <span className="text-xs text-[#555550] tabular-nums">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 text-xs font-medium border border-[#0B4F4A] text-[#0B4F4A] bg-white rounded-[6px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
