import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";
import createSocketConnection from "../utils/socket";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [userLimits, setUserLimits] = useState(null);
  const [userCounts, setUserCounts] = useState({ availableToConnect: 0, onlineCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const getFeed = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserLimits = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/limits", {
        withCredentials: true,
      });
      setUserLimits(res.data);
      
      // If user has reached limit and is not premium, show modal
      if (res.data.dailyDecisionCount >= 3 && !res.data.isPremium) {
        setShowPremiumModal(true);
      }
    } catch (err) {
      console.error("Error checking limits:", err);
    }
  };

  const getUserCounts = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/counts", {
        withCredentials: true,
      });
      console.log('Fetched user counts from API:', res.data);
      setUserCounts(res.data);
    } catch (err) {
      console.error("Error fetching user counts:", err);
    }
  };

  // Create custom event handlers for updating counts and limits
  useEffect(() => {
    const handleUpdateCounts = () => {
      console.log('Custom event: updateCounts triggered');
      getUserCounts();
    };
    const handleUpdateLimits = () => {
      console.log('Custom event: updateLimits triggered');
      checkUserLimits();
    };
    const handleFeedUpdate = async () => {
      console.log('Custom event: feedUpdate triggered');
      // Auto-refresh feed when user makes a decision
      await Promise.all([
        getFeed(),
        getUserCounts(),
        checkUserLimits()
      ]);
    };
    
    window.addEventListener('updateCounts', handleUpdateCounts);
    window.addEventListener('updateLimits', handleUpdateLimits);
    window.addEventListener('feedUpdate', handleFeedUpdate);
    
    return () => {
      window.removeEventListener('updateCounts', handleUpdateCounts);
      window.removeEventListener('updateLimits', handleUpdateLimits);
      window.removeEventListener('feedUpdate', handleFeedUpdate);
    };
  }, []);

  // Real-time Socket.IO event listeners for online status updates
  useEffect(() => {
    if (!user) return;

    const socket = createSocketConnection();
    
    // Listen for user online events
    socket.on('userOnline', (userId) => {
      console.log('User came online:', userId);
      // Update online count when a user comes online
      setUserCounts(prev => {
        const newCount = prev.onlineCount + 1;
        console.log('Updating online count:', prev.onlineCount, '->', newCount);
        return {
          ...prev,
          onlineCount: newCount
        };
      });
    });

    // Listen for user offline events
    socket.on('userOffline', (userId) => {
      console.log('User went offline:', userId);
      // Update online count when a user goes offline
      setUserCounts(prev => {
        const newCount = Math.max(0, prev.onlineCount - 1);
        console.log('Updating online count:', prev.onlineCount, '->', newCount);
        return {
          ...prev,
          onlineCount: newCount
        };
      });
    });

    // Listen for initial online users list
    socket.on('onlineUsers', (users) => {
      console.log('Received online users list:', users);
      setUserCounts(prev => ({
        ...prev,
        onlineCount: users.length
      }));
    });

    // Cleanup
    return () => {
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('onlineUsers');
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const initializeFeed = async () => {
      setIsLoading(true);
      try {
        // Fetch feed and limits first
        await Promise.all([
          getFeed(),
          checkUserLimits()
        ]);
        
        // Fetch user counts after a small delay to let Socket.IO initialize
        setTimeout(() => {
          getUserCounts();
        }, 1000);
      } catch (error) {
        console.error("Error initializing feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFeed();

    // Listen for premium modal event
    const handlePremiumModal = () => {
      setShowPremiumModal(true);
    };
    window.addEventListener('showPremiumModal', handlePremiumModal);
    
    return () => {
      window.removeEventListener('showPremiumModal', handlePremiumModal);
    };
  }, []);

  // Automatic feed refresh functionality
  useEffect(() => {
    if (!user) return;

    // Auto-refresh feed every 30 seconds when feed is empty or stale
    const autoRefreshInterval = setInterval(async () => {
      try {
        // Only auto-refresh if we don't have feed data or if it's been a while
        if (!feed || feed.length === 0) {
          console.log('Auto-refreshing feed - no users available');
          await Promise.all([
            getFeed(),
            getUserCounts(),
            checkUserLimits()
          ]);
        }
      } catch (error) {
        console.error('Error during auto-refresh:', error);
      }
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(autoRefreshInterval);
    };
  }, [user, feed]);
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-full py-8 bg-base-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 bg-base-300 rounded-full flex items-center justify-center animate-spin">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-base-content mb-2">Loading Feed...</h2>
            <p className="text-base-content opacity-70">Finding new connections for you</p>
          </div>
        </div>
      </div>
    );
  }

  if (!feed || feed.length <= 0)
    return (
      <div className="min-h-full py-8 bg-base-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-base-300 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-base-content opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-base-content mb-3">
              No New Users Found
            </h1>
            <p className="text-base-content opacity-70 mb-6">You've seen all available users! We'll automatically check for new connections.</p>
          </div>
        </div>
      </div>
    );

  return (
    feed && (
      <div className="min-h-full py-8 bg-base-200">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-4">
              Discover New Connections
            </h1>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-base-100 shadow-sm border border-base-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-sm font-medium">{userCounts.onlineCount} online</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-base-300"></div>
              <span className="text-sm text-base-content/70">
                {userCounts.availableToConnect} available to connect
              </span>
              {userLimits && !userLimits.isPremium && (
                <>
                  <div className="w-1 h-1 rounded-full bg-base-300"></div>
                  <span className="text-sm text-warning font-medium">
                    {3 - userLimits.dailyDecisionCount} decisions left today
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Main User Card */}
          <div className="flex justify-center">
            <UserCard user={feed[0]} />
          </div>

          {/* Premium Modal */}
          {showPremiumModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-base-100 rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Daily Limit Reached</h3>
                  <p className="text-base-content/70 mb-6">
                    You've reached your daily limit of 3 decisions. Upgrade to premium for unlimited decisions and more features!
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate('/premium')} 
                      className="btn btn-warning flex-1"
                    >
                      Upgrade Now
                    </button>
                    <button 
                      onClick={() => setShowPremiumModal(false)} 
                      className="btn btn-ghost flex-1"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};
export default Feed;