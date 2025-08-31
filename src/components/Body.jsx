import { Outlet, useNavigate} from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const userData = useSelector((store) => store.user);

    const fetchUser = async () => {
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
          console.error("Error fetching user:", err);
        }
      }
    };

    useEffect(() => {
      if (!userData) {
        fetchUser();
      }
    }, [userData]);

      // Show nothing while checking authentication
  if (!userData) {
    return null;
  }

  return (
    <div>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </div>
  );
}; 

export default Body;