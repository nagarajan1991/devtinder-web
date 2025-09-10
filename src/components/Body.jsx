import { Outlet, useNavigate, useLocation} from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const location = useLocation();
    const userData = useSelector((store) => store.user);
    const hasAttemptedAuth = useRef(false);

    const fetchUser = async () => {
      if (hasAttemptedAuth.current) {
        return; // Don't attempt auth again if we already tried
      }
      
      hasAttemptedAuth.current = true;
      
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // User is not authenticated, redirect to login
          dispatch(addUser(null));
          navigate("/login");
        } else {
          // For other errors, also redirect to login as a fallback
          dispatch(addUser(null));
          navigate("/login");
        }
      }
    };

    useEffect(() => {
      // Only try to fetch user if we haven't attempted auth yet
      if (!userData && !hasAttemptedAuth.current) {
        fetchUser();
      }
    }, [userData]);

    // Show nothing while checking authentication
    if (!userData && !hasAttemptedAuth.current) {
      return null;
    }

    // If user is not authenticated and we've attempted auth, show login page
    if (!userData && hasAttemptedAuth.current) {
      return null; // This will be handled by the redirect in fetchUser
    }

  return (
    <div className="min-h-screen flex flex-col">
        <NavBar/>
        <main className="flex-1">
          <Outlet/>
        </main>
        <Footer/>
    </div>
  );
}; 

export default Body;