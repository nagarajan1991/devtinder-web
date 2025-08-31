import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import axios from 'axios';
import { useState, useEffect } from "react";

const NavBar = () => {
  const user = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = async() => {
    try {
      await axios.post(
        BASE_URL + "/logout", 
        {},
        {withCredentials:true}
      );
      dispatch(removeUser());
      navigate("/login"); 
    }
    catch (error)
    {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="navbar bg-base-100 shadow-lg border-b border-base-300 px-6">
      <div className="navbar-start">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🫰🏼</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CommitHub
          </span>
        </Link>
        {/* LinkedIn Link */}
        <a
          href="https://www.linkedin.com/in/nagalakshmanan/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 flex items-center gap-1 text-[#0274e5] hover:text-[rgb(255,255,255)] transition-colors duration-200"
          title="My LinkedIn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z"/>
          </svg>
          <span className="text-sm font-medium">Nagalakshmanan</span>
        </a>
      </div>

      {user && (
        <div className="navbar-end">
          <div className="flex items-center gap-4">
            {/* Welcome Message */}
            <div className="hidden md:flex items-center gap-2 text-base-content/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Welcome, {user.firstName}</span>
            </div>

            {/* User Profile Dropdown */}
            <div className={`dropdown dropdown-end ${dropdownOpen ? "dropdown-open" : ""}`}>
              <button
                type="button"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((v) => !v)}
                className="btn btn-ghost btn-circle avatar hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <img
                    alt={`${user.firstName} ${user.lastName}`}
                    src={user.photoUrl}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </button>
              
              {/* close dropdown when any item inside is clicked */}
              <ul onClick={() => setDropdownOpen(false)} tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-box w-64 border border-base-300 right-0"> 
                {/* User Info Header */}
                <li className="menu-title mb-2">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-8 h-8 rounded-full ring-2 ring-primary/20 flex-shrink-0">
                      <img
                        alt={`${user.firstName} ${user.lastName}`}
                        src={user.photoUrl}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold text-sm truncate">{user.firstName} {user.lastName}</span>
                      <span className="text-xs text-base-content/60 truncate">{user.emailId}</span>
                    </div>
                  </div>
                </li>
                
                <div className="divider my-1"></div>
                
                {/* Navigation Links */}
                <li>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-base-200 transition-colors">
                     <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                     <span>Profile</span>
                   </Link>
                 </li>
                
                <li>
                  <Link to="/connections" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-base-200 transition-colors">
                     <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                     </svg>
                     <span>Connections</span>
                   </Link>
                 </li>
                
                <li>
                  <Link to="/requests" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-base-200 transition-colors">
                     <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     <span>Requests</span>
                   </Link>
                 </li>

                <li>
                  <Link to="/premium" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-base-200 transition-colors">
                     <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     <span>Premium</span>
                     <span className="badge badge-primary badge-xs ml-auto">For More Features!</span>
                   </Link>
                 </li>
                
                <div className="divider my-1"></div>
                
                {/* Logout */}
                <li>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-error/10 text-error hover:text-error transition-colors w-full text-left"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;