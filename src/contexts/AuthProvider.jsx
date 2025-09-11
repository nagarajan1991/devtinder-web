import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import appStore from "../utils/appStore";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);
  const hasAttemptedAuth = useRef(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const fetchUser = async () => {
    if (hasAttemptedAuth.current) {
      return; // Don't attempt auth again if we already tried
    }
    
    hasAttemptedAuth.current = true;
    setIsAuthLoading(true);
    
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      // Clear any existing user data
      dispatch(addUser(null));
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    // Only try to fetch user if we haven't attempted auth yet
    if (!userData && !hasAttemptedAuth.current) {
      fetchUser();
    }
  }, [userData]);

  // Show loading spinner while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
