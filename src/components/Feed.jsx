import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = ()  => { 
    const dispatch = useDispatch();
    const feed = useSelector(store => store.feed);

    const getFeed = async () => {
        if (feed) {
            return;
        }
        try {
            const response = await axios.get(BASE_URL + "/feed", { withCredentials: true });
            dispatch(addFeed(response.data));
            // Process the feed data as needed
        } catch (error) {
            console.error("Error fetching feed:", error);
        }
    };


useEffect(() => {
    getFeed();
}, []);
return (
    feed && feed.data && (
        <div className="flex justify-center my-10">
            <UserCard user={feed.data[0]} />
        </div>
    )
);
};

export default Feed;