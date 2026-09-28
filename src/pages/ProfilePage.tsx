import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getFilterOptions } from '../lib/api';
import { StudyLevel, UserProfile } from '../types';

interface ProfilePageProps {
  user: UserProfile | null;
  authLoading: boolean;
  onUpdateProfile: (profile: UserProfile) => Promise<void>;
}

export function ProfilePage({
  user,
  authLoading,
  onUpdateProfile,
}: ProfilePageProps) {
  const { countries, levels, fields } = getFilterOptions();
  const selectableFields = fields.filter((f) => f !== 'All Fields');

  const [name, setName] = useState('');
  const [gpa, setGpa] = useState('');
  const [level, setLevel] = useState<StudyLevel>('Masters');
  const [field, setField] = useState(selectableFields[0]);
  const [targetCountry, setTargetCountry] = useState(countries[0]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setGpa(String(user.gpa));
      setLevel(user.level);
      setField(user.field);
      setTargetCountry(user.targetCountry);
    }
  }, [user]);

  if (authLoading) {
    return <p className="text-sm text-[#555550] py-6">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = 'Name is required.';
    }
    const parsedGpa = Number(gpa);
    if (
      gpa.trim() === '' ||
      Number.isNaN(parsedGpa) ||
      parsedGpa <= 0 ||
      parsedGpa > 4.0
    ) {
      nextErrors.gpa = 'GPA must be a number between 0.1 and 4.0.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(false);
    if (!validate()) return;

    setSaving(true);
    try {
      await onUpdateProfile({
        ...user,
        name: name.trim(),
        gpa: Number(gpa),
        level,
        field,
        targetCountry,
      });
      setSavedNotice(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#232323]">
          Academic Profile
        </h1>
        <p className="text-sm text-[#555550] mt-1">
          Update your GPA, study level, field, or target country to recalculate your scholarship matches.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-[#D8D8D2] rounded-[6px] p-5 sm:p-6 space-y-4"
      >
        <div>
          <label
            htmlFor="profile-name"
            className="block text-xs font-medium text-[#232323] mb-1"
          >
            Name *
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#D8D8D2] rounded-[6px] bg-white text-[#232323]"
          />
          {errors.name && (
            <p role="alert" className="text-xs text-[#C93B2B] mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="profile-gpa"
            className="block text-xs font-medium text-[#232323] mb-1"
          >
            Cumulative GPA (4.0 scale) *
          </label>
          <input
            id="profile-gpa"
            type="number"
            step="0.05"
            min="0.1"
            max="4.0"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#D8D8D2] rounded-[6px] bg-white text-[#232323] tabular-nums"
          />
          {errors.gpa && (
            <p role="alert" className="text-xs text-[#C93B2B] mt-1">
              {errors.gpa}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="profile-level"
            className="block text-xs font-medium text-[#232323] mb-1"
          >
            Study Level *
          </label>
          <select
            id="profile-level"
            value={level}
            onChange={(e) => setLevel(e.target.value as StudyLevel)}
            className="w-full px-3 py-2 text-sm border border-[#D8D8D2] rounded-[6px] bg-white text-[#232323]"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="profile-field"
            className="block text-xs font-medium text-[#232323] mb-1"
          >
            Field of Study *
          </label>
          <select
            id="profile-field"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#D8D8D2] rounded-[6px] bg-white text-[#232323]"
          >
            {selectableFields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="profile-country"
            className="block text-xs font-medium text-[#232323] mb-1"
          >
            Target Country *
          </label>
          <select
            id="profile-country"
            value={targetCountry}
            onChange={(e) => setTargetCountry(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#D8D8D2] rounded-[6px] bg-white text-[#232323]"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="Any">Any Country</option>
          </select>
        </div>

        {savedNotice && (
          <p role="status" className="text-xs font-medium text-[#0B4F4A]">
            Profile saved. Your scholarship matches have been updated.
          </p>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-[#0B4F4A] text-white rounded-[6px] hover:opacity-90 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <Link
            to="/matches"
            className="px-4 py-2 text-sm font-medium border border-[#0B4F4A] text-[#0B4F4A] rounded-[6px] hover:bg-[#F2F2EE]"
          >
            View My Matches →
          </Link>
        </div>
      </form>
    </div>
  );
}
