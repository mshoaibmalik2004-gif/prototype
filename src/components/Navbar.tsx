import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  savedCount: number;
  onLogout: () => Promise<void>;
  onDemoLogin: () => Promise<void>;
}

export function Navbar({
  user,
  savedCount,
  onLogout,
  onDemoLogin,
}: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-[#0B4F4A] font-semibold underline underline-offset-4'
      : 'text-[#232323] hover:text-[#0B4F4A] hover:underline hover:underline-offset-4';

  const handleLogoutClick = async () => {
    await onLogout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleDemoClick = async () => {
    await onDemoLogin();
    setMobileMenuOpen(false);
    navigate('/matches');
  };

  return (
    <header className="bg-white border-b border-[#D8D8D2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-[#0B4F4A] whitespace-nowrap shrink-0"
        >
          ScholarMatch Lite
        </Link>

        {/* Zone 2: Clean text navigation links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-6 text-sm"
        >
          <Link to="/" className={`whitespace-nowrap ${isActive('/')}`}>
            Home
          </Link>
          <Link
            to="/browse"
            className={`whitespace-nowrap ${isActive('/browse')}`}
          >
            Browse
          </Link>
          <Link
            to="/matches"
            className={`whitespace-nowrap ${isActive('/matches')}`}
          >
            Matches
          </Link>
          <Link
            to="/saved"
            className={`whitespace-nowrap tabular-nums ${isActive('/saved')}`}
          >
            Saved ({savedCount})
          </Link>
          {user && (
            <Link
              to="/profile"
              className={`whitespace-nowrap ${isActive('/profile')}`}
            >
              Profile
            </Link>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link
                to="/profile"
                className="px-3 py-1.5 text-xs font-medium border border-[#0B4F4A] text-[#0B4F4A] rounded-[6px] hover:bg-[#F2F2EE] whitespace-nowrap truncate max-w-[160px]"
              >
                {user.name}
              </Link>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="px-3 py-1.5 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px] hover:opacity-90 whitespace-nowrap cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDemoClick}
                className="px-3 py-1.5 text-xs font-medium border border-[#0B4F4A] text-[#0B4F4A] rounded-[6px] hover:bg-[#F2F2EE] whitespace-nowrap cursor-pointer"
              >
                Demo Login
              </button>
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px] hover:opacity-90 whitespace-nowrap"
              >
                Log In / Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-[#232323] border border-[#D8D8D2] rounded-[6px]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D8D8D2] bg-white px-4 py-3 space-y-3">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2 text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1 ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1 ${isActive('/browse')}`}
            >
              Browse
            </Link>
            <Link
              to="/matches"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1 ${isActive('/matches')}`}
            >
              Matches
            </Link>
            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1 tabular-nums ${isActive('/saved')}`}
            >
              Saved ({savedCount})
            </Link>
            {user && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 ${isActive('/profile')}`}
              >
                Profile ({user.name})
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-[#E6E6E0] flex flex-wrap gap-2">
            {user ? (
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full py-2 px-3 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px] text-center cursor-pointer"
              >
                Log Out ({user.name})
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDemoClick}
                  className="flex-1 py-2 px-3 text-xs font-medium border border-[#0B4F4A] text-[#0B4F4A] rounded-[6px] text-center whitespace-nowrap cursor-pointer"
                >
                  Demo Login
                </button>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 px-3 text-xs font-medium bg-[#0B4F4A] text-white rounded-[6px] text-center whitespace-nowrap"
                >
                  Log In / Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
