/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import {
  getCurrentUser,
  getSavedScholarshipIds,
  loginOrSignup,
  loginWithDemo,
  logoutUser,
  removeSavedScholarship,
  toggleSaveScholarship,
  updateUserProfile,
} from './lib/api';
import { AuthPage } from './pages/AuthPage';
import { BrowsePage } from './pages/BrowsePage';
import { HomePage } from './pages/HomePage';
import { MatchesPage } from './pages/MatchesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SavedPage } from './pages/SavedPage';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';
import { StudyLevel, UserProfile } from './types';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getCurrentUser(), getSavedScholarshipIds()])
      .then(([currentUser, currentSavedIds]) => {
        if (active) {
          setUser(currentUser);
          setSavedIds(currentSavedIds);
          setAuthLoading(false);
        }
      })
      .catch(() => {
        if (active) setAuthLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleToggleSave = async (id: string) => {
    const { ids } = await toggleSaveScholarship(id);
    setSavedIds(ids);
  };

  const handleRemoveSaved = async (id: string) => {
    const next = await removeSavedScholarship(id);
    setSavedIds(next);
  };

  const handleDemoLogin = async () => {
    const demoUser = await loginWithDemo();
    const updatedSaved = await getSavedScholarshipIds();
    setUser(demoUser);
    setSavedIds(updatedSaved);
  };

  const handleLoginSubmit = async (input: {
    email: string;
    name: string;
    gpa: number;
    level: StudyLevel;
    field: string;
    targetCountry: string;
  }) => {
    const created = await loginOrSignup(input);
    setUser(created);
  };

  const handleUpdateProfile = async (profile: UserProfile) => {
    const updated = await updateUserProfile(profile);
    setUser(updated);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#232323] font-sans">
        <Navbar
          user={user}
          savedCount={savedIds.length}
          onLogout={handleLogout}
          onDemoLogin={handleDemoLogin}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  user={user}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              }
            />
            <Route
              path="/browse"
              element={
                <BrowsePage
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              }
            />
            <Route
              path="/scholarships/:id"
              element={
                <ScholarshipDetailPage
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              }
            />
            <Route
              path="/login"
              element={
                <AuthPage
                  user={user}
                  onLoginSubmit={handleLoginSubmit}
                  onDemoLogin={handleDemoLogin}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  user={user}
                  authLoading={authLoading}
                  onUpdateProfile={handleUpdateProfile}
                />
              }
            />
            <Route
              path="/matches"
              element={
                <MatchesPage
                  user={user}
                  authLoading={authLoading}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              }
            />
            <Route
              path="/saved"
              element={
                <SavedPage
                  savedIds={savedIds}
                  onRemoveSaved={handleRemoveSaved}
                />
              }
            />
          </Routes>
        </main>

        <footer className="border-t border-[#D8D8D2] bg-white mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#555550]">
            <span>
              ScholarMatch Lite Prototype — Sample scholarship data for demonstration only.
            </span>
            <div className="flex items-center gap-4">
              <Link to="/browse" className="hover:text-[#0B4F4A] hover:underline">
                Browse All
              </Link>
              <Link to="/matches" className="hover:text-[#0B4F4A] hover:underline">
                Matches
              </Link>
              <Link to="/saved" className="hover:text-[#0B4F4A] hover:underline">
                Saved List
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
