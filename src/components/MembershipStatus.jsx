import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const MembershipStatus = () => {
  const [membershipDetails, setMembershipDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector(store => store.user);

  // Function to check membership status
  const checkMembership = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });
      setMembershipDetails(res.data);
    } catch (err) {
      // Error checking membership - user might not be premium
      setMembershipDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for payment success event
  useEffect(() => {
    const handlePaymentSuccess = () => {
      checkMembership();
    };
    window.addEventListener('paymentSuccess', handlePaymentSuccess);
    return () => {
      window.removeEventListener('paymentSuccess', handlePaymentSuccess);
    };
  }, []);

  // Initial membership check
  useEffect(() => {
    checkMembership();
  }, [user]);

  // Don't show anything if loading or no user
  if (isLoading || !user) {
    return null;
  }

  // Don't show anything if user is not premium
  if (!membershipDetails || !membershipDetails.isPremium) {
    return null;
  }

  return (
    <div className="fixed top-20 right-2 sm:right-4 z-30">
      <div className={`text-xs font-medium px-2 py-1.5 sm:px-3 sm:py-2 rounded-full shadow-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
        membershipDetails.membershipType === 'gold' 
          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-400 dark:border-yellow-600' 
          : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-300 dark:from-slate-800/30 dark:to-slate-700/30 dark:text-slate-300 dark:border-slate-600'
      }`}>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm">
            {membershipDetails.membershipType === 'gold' ? '🥇' : '🥈'}
          </span>
          <span className="font-semibold text-xs sm:text-sm">
            {membershipDetails.membershipType.charAt(0).toUpperCase() + membershipDetails.membershipType.slice(1)} Member
          </span>
          {membershipDetails.daysUntilExpiry !== null && (
            <span className="opacity-75 text-xs sm:text-sm">
              • {membershipDetails.daysUntilExpiry}d
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipStatus;
