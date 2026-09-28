import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFilterOptions } from '../lib/api';
import { StudyLevel, UserProfile } from '../types';

interface AuthPageProps {
  user: UserProfile | null;
  onLoginSubmit: (input: {
    email: string;
    name: string;
    gpa: number;
    level: StudyLevel;
    field: string;
    targetCountry: string;
  }) => Promise<void>;
  onDemoLogin: () => Promise<void>;
}

export function AuthPage({
  user,
  onLoginSubmit,
  onDemoLogin,
}: AuthPageProps) {
  const navigate = useNavigate();
  const { countries, levels, fields } = getFilterOptions();
  const selectableFields = fields.filter((f) => f !== 'All Fields');

  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [gpa, setGpa] = useState(user ? String(user.gpa) : '3.5');
  const [level, setLevel] = useState<StudyLevel>(user?.level || 'Masters');
  const [field, setField] = useState(user?.field || selectableFields[0]);
  const [targetCountry, setTargetCountry] = useState(
    user?.targetCountry || countries[0]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = 'Name is required.';
    }
    if (!email.trim() || !email.includes('@')) {
      nextErrors.email = 'Enter a valid email address.';
    }
    const parsedGpa = Number(gpa);
    if (gpa.trim() === '' || Number.isNaN(parsedGpa) || parsedGpa <= 0 || parsedGpa > 4.0) {
      nextErrors.gpa = 'GPA must be a number between 0.1 and 4.0.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onLoginSubmit({
        email,
        name,
        gpa: Number(gpa),
        level,
        field,
        targetCountry,
      });
      navigate('/matches');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setSubmitting(true);
    try {
      await onDemoLogin();
      navigate('/matches');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-white border border-[#D8D8D2] rounded-[6px] p-5 sm:p-6">
        <div className="pb-4 mb-4 border-b border-[#E6E6E0]">
          <p className="text-xs font-semibold text-[#E8734A]">
            DEMO AUTHENTICATION (LOCALSTORAGE)
          </p>
          <h1 className="text-xl font-bold text-[#232323] mt-1">
            Log In or Create a Demo Profile
          </h1>
          <p className="text-xs text-[#555550] mt-1">
            This prototype stores your session and academic profile locally in your browser so you can immediately test scholarship matching.
          </p>
        </div>

        {/* One-click Demo User shortcut */}
        <div className="mb-6 p-3.5 bg-[#FAFAF8] border border-[#D8D8D2] rounded-[6px] flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#232323]">
              Want to test right away?
            </p>
            <p className="text-xs text-[#555550] tabular-nums">
              Seeded user: Alex Rivera (Masters · CS · 3.65 GPA · Germany)
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={handleQuickDemo}
            className="px-3.5 py-2 text-xs font-medium bg-[#E8734A] text-white rounded-[6px] hover:opacity-90 whitespace-nowrap cursor-pointer"
          >
            Use Demo Account
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="auth-name"
              className="block text-xs font-medium text-[#232323] mb-1"
            >
              Full Name *
            </label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Samira Khan"
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
              htmlFor="auth-email"
              className="block text-xs font-medium text-[#232323] mb-1"
            >
              Email Address *
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full px-3 py-2 text-sm border border-[#D8D8D2] rounded-[6px] bg-white text-[#232323]"
            />
            {errors.email && (
              <p role="alert" className="text-xs text-[#C93B2B] mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="auth-gpa"
                className="block text-xs font-medium text-[#232323] mb-1"
              >
                Cumulative GPA (4.0 scale) *
              </label>
              <input
                id="auth-gpa"
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
                htmlFor="auth-level"
                className="block text-xs font-medium text-[#232323] mb-1"
              >
                Study Level *
              </label>
              <select
                id="auth-level"
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="auth-field"
                className="block text-xs font-medium text-[#232323] mb-1"
              >
                Field of Study *
              </label>
              <select
                id="auth-field"
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
                htmlFor="auth-country"
                className="block text-xs font-medium text-[#232323] mb-1"
              >
                Target Country *
              </label>
              <select
                id="auth-country"
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
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 text-sm font-medium bg-[#0B4F4A] text-white rounded-[6px] hover:opacity-90 cursor-pointer"
            >
              {submitting ? 'Saving...' : 'Save Profile & View Matches'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
