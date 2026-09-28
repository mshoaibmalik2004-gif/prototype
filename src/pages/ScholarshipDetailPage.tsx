import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, ExternalLink } from 'lucide-react';
import { getScholarshipById } from '../lib/api';
import { formatPlainDate } from '../lib/match';
import { Scholarship } from '../types';

interface ScholarshipDetailPageProps {
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export function ScholarshipDetailPage({
  savedIds,
  onToggleSave,
}: ScholarshipDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    getScholarshipById(id)
      .then((item) => {
        if (active) {
          setScholarship(item);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <p className="text-sm text-[#555550] py-6">Loading...</p>;
  }

  if (!scholarship) {
    return (
      <div className="bg-white border border-[#D8D8D2] rounded-[6px] p-6">
        <h1 className="text-lg font-bold text-[#232323]">
          Scholarship not found
        </h1>
        <p className="text-sm text-[#555550] mt-1">
          The scholarship ID you requested does not exist in the sample dataset.
        </p>
        <Link
          to="/browse"
          className="inline-block mt-4 px-4 py-2 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px]"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  const isSaved = savedIds.includes(scholarship.id);

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0B4F4A] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Browse
        </Link>
      </div>

      <article className="bg-white border border-[#D8D8D2] rounded-[6px] p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-[#555550]">{scholarship.provider}</p>
            <h1 className="text-xl sm:text-2xl font-bold text-[#232323] mt-1">
              {scholarship.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => onToggleSave(scholarship.id)}
            aria-pressed={isSaved}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[6px] border whitespace-nowrap cursor-pointer ${
              isSaved
                ? 'bg-[#E8734A] text-white border-[#E8734A]'
                : 'bg-white text-[#232323] border-[#D8D8D2] hover:border-[#0B4F4A] hover:text-[#0B4F4A]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {isSaved ? 'Saved to List' : 'Save Scholarship'}
          </button>
        </div>

        {/* Structured Details List */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#E6E6E0] text-sm">
          <div>
            <dt className="text-xs text-[#555550]">Country</dt>
            <dd className="font-medium text-[#232323] mt-0.5">
              {scholarship.country}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#555550]">Study Level</dt>
            <dd className="font-medium text-[#232323] mt-0.5">
              {scholarship.level}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#555550]">Minimum GPA</dt>
            <dd className="font-medium text-[#232323] tabular-nums mt-0.5">
              {scholarship.minGpa.toFixed(1)} / 4.0
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#555550]">Application Deadline</dt>
            <dd className="font-medium text-[#232323] tabular-nums mt-0.5">
              {formatPlainDate(scholarship.deadline)}
            </dd>
          </div>
        </dl>

        <div>
          <h2 className="text-sm font-semibold text-[#232323]">
            Academic Field
          </h2>
          <p className="text-sm text-[#444440] mt-1">{scholarship.field}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#232323]">
            Program Overview
          </h2>
          <p className="text-sm text-[#232323] mt-1 leading-relaxed">
            {scholarship.description}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E6E6E0]">
          <p className="text-xs text-[#555550]">
            Sample listing — verify deadlines and criteria on the official provider page.
          </p>
          <a
            href={scholarship.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px] hover:opacity-90 whitespace-nowrap"
          >
            Official Scholarship Website
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </article>
    </div>
  );
}
