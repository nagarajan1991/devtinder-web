import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import axios from 'axios';
import { useTheme } from "../contexts/ThemeContext";

const NavBar = () => {
  const user = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();



  const handleLogout = async() => {
    try {
      const detailsElement = document.querySelector('.dropdown-end');
      if (detailsElement) {
        detailsElement.removeAttribute('open');
      }
      await axios.post(
        BASE_URL + "/auth/logout", 
        {},
        {withCredentials:true}
      );
      dispatch(removeUser());
      navigate("/login"); 
    }
    catch (error)
    {
      // Logout failed
    }
  }

  return (
    <div className="navbar sticky top-0 z-40 bg-base-100/70 backdrop-blur border-b border-base-300/70 px-4 md:px-6">
      <div className="navbar-start">
        {/* Logo - Always visible */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-primary via-secondary to-accent text-base-100">
            <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="2"/>
              <rect x="14" y="3" width="7" height="7" rx="2"/>
              <rect x="3" y="14" width="7" height="7" rx="2"/>
              <rect x="14" y="14" width="7" height="7" rx="2"/>
            </svg>
          </div>
          <span className="text-lg md:text-xl font-extrabold tracking-tight hidden sm:inline">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Social Network</span>
          </span>
        </Link>
      </div>

      {/* Hobby project - Always visible in navbar */}
      <div className="navbar-center flex-1 flex justify-center">
        <div className="text-[10px] sm:text-xs whitespace-nowrap py-1 px-2 rounded-lg bg-base-200/50 backdrop-blur shadow-sm border border-base-300/50">
          <span className="text-base-content/60">Hobby project by</span>
          <a
            href="https://www.linkedin.com/in/nagalakshmanan/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 font-medium text-primary hover:text-primary-focus transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              className="inline mr-1 transition-colors"
              style={{ fill: 'currentColor' }}>
              <path
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
            </svg>
            Nagalakshmanan
          </a>
        </div>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>


            {/* Welcome - Only on large screens */}
            <div className="hidden lg:flex items-center gap-2 text-base-content/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Hi, {user.firstName}</span>
            </div>


            {/* Hobby project - Mobile version */}
            <div className="sm:hidden">
              <div className="text-[8px] whitespace-nowrap py-1 px-1 rounded bg-base-200/50 backdrop-blur shadow-sm border border-base-300/50">
                <span className="text-base-content/60">by</span>
                <a
                  href="https://www.linkedin.com/in/nagalakshmanan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 font-medium text-primary hover:text-primary-focus transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    className="inline mr-1 transition-colors"
                    style={{ fill: 'currentColor' }}>
                    <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                  Naga
                </a>
              </div>
            </div>

            {/* Profile dropdown */}
            <details className="dropdown dropdown-end">
              <summary className="btn btn-ghost btn-circle avatar hover:shadow-md p-0.5">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40">
                  {user.photoUrl && user.photoUrl.trim() ? (
                    <img 
                      alt={`${user.firstName} ${user.lastName}`} 
                      src={user.photoUrl} 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full bg-primary/20 flex items-center justify-center rounded-full text-primary font-semibold text-sm"
                    style={{ display: user.photoUrl && user.photoUrl.trim() ? 'none' : 'flex' }}
                  >
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
              </summary>
              <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-box w-64 border border-base-300">
                <li className="menu-title mb-2">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-8 h-8 rounded-full ring-2 ring-primary/20 flex-shrink-0">
                      {user.photoUrl && user.photoUrl.trim() ? (
                        <img 
                          alt={`${user.firstName} ${user.lastName}`} 
                          src={user.photoUrl} 
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-full h-full bg-primary/20 flex items-center justify-center rounded-full text-primary font-semibold text-xs"
                        style={{ display: user.photoUrl && user.photoUrl.trim() ? 'none' : 'flex' }}
                      >
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold text-sm truncate">{user.firstName} {user.lastName}</span>
                      <span className="text-xs text-base-content/60 truncate">{user.emailId}</span>
                    </div>
                  </div>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button 
                    onClick={() => {
                      const detailsElement = document.querySelector('.dropdown-end');
                      if (detailsElement) {
                        detailsElement.removeAttribute('open');
                      }
                      navigate('/');
                    }}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-base-200 w-full text-left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Feed</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const detailsElement = document.querySelector('.dropdown-end');
                      if (detailsElement) {
                        detailsElement.removeAttribute('open');
                      }
                      navigate('/connections');
                    }}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-base-200 w-full text-left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Connections</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const detailsElement = document.querySelector('.dropdown-end');
                      if (detailsElement) {
                        detailsElement.removeAttribute('open');
                      }
                      navigate('/requests');
                    }}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-base-200 w-full text-left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Requests</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const detailsElement = document.querySelector('.dropdown-end');
                      if (detailsElement) {
                        detailsElement.removeAttribute('open');
                      }
                      navigate('/premium');
                    }}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-base-200 w-full text-left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Premium</span>
                  </button>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button 
                    onClick={() => {
                      const detailsElement = document.querySelector('.dropdown-end');
                      if (detailsElement) {
                        detailsElement.removeAttribute('open');
                      }
                      navigate('/profile');
                    }}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-base-200 w-full text-left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>Edit Profile</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const detailsElement = document.querySelector('.dropdown-end');
                      if (detailsElement) {
                        detailsElement.removeAttribute('open');
                      }
                      navigate('/change-password');
                    }}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-base-200 w-full text-left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2" /></svg>
                    <span>Change Password</span>
                  </button>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-error/10 text-error w-full text-left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </details>
          </div>
        ) : (
          <div className="w-8 h-8"></div>
        )}
      </div>
    </div>
  );
};

export default NavBar;