import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import axios from 'axios';

const NavBar = () => {
  const user = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <img
                    alt={`${user.firstName} ${user.lastName}`}
                    src={user.photoUrl}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-box w-64 border border-base-300 right-0">
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
                  <Link to="/profile" className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-base-200 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                    <span className="badge badge-primary badge-xs ml-auto">New</span>
                  </Link>
                </li>
                
                <li>
                  <Link to="/connections" className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-base-200 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Connections</span>
                  </Link>
                </li>
                
                <li>
                  <Link to="/requests" className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-base-200 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Requests</span>
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