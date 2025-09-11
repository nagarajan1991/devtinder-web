import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [membershipDetails, setMembershipDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  // Auto-fix expiry when membership details are loaded
  useEffect(() => {
    if (membershipDetails?.isPremium && !membershipDetails?.membershipExpiry) {
      fixMembershipExpiry();
    }
  }, [membershipDetails]);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      
      // Always set membership details
      let daysUntilExpiry = res.data.daysUntilExpiry;
      
      // If daysUntilExpiry is null, undefined, or 0, but we have membershipExpiry, calculate it
      if ((daysUntilExpiry === null || daysUntilExpiry === undefined || daysUntilExpiry === 0) && res.data.membershipExpiry) {
        const now = new Date();
        const expiry = new Date(res.data.membershipExpiry);
        const timeDiff = expiry.getTime() - now.getTime();
        daysUntilExpiry = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
      }
      
      setMembershipDetails({
        ...res.data,
        daysUntilExpiry: daysUntilExpiry || 0
      });
    } catch (error) {
      // Error fetching premium status
    }
  };

  const fixMembershipExpiry = async () => {
    try {
      const res = await axios.post(BASE_URL + "/premium/fix-expiry", {}, {
        withCredentials: true,
      });
      
      // Refresh the premium status after fixing
      await verifyPremiumUser();
      
      alert(`Membership expiry fixed successfully! Your membership expires in ${res.data.daysUntilExpiry} days.`);
    } catch (error) {
      alert("Error fixing membership expiry. Please try again.");
    }
  };

  const copyUpiId = async () => {
    const upiId = "example@hdfcbank";
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = upiId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      { withCredentials: true }
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Social Network",
      description: "Connect to other users",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: async (response) => {
        // Wait a moment for webhook to process
        setTimeout(async () => {
          try {
            // Verify premium status with retry logic
            await verifyPremiumUser();
          } catch (error) {
            // Error updating premium status
          }
        }, 2000); // Wait 2 seconds for webhook processing
        
        // Dispatch event to update navbar
        window.dispatchEvent(new CustomEvent('paymentSuccess'));
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return (
    <div className="min-h-full py-8 bg-base-200">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hobby Project Notice */}
        <div className="alert alert-warning mb-8 border-2 border-orange-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6 text-orange-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <div className="text-sm text-orange-700">
              <p className="mb-2">This is a hobby project using Razorpay test account. <strong className="text-orange-900">No real money will be charged!</strong></p>
              <p className="mb-1"><strong className="text-orange-900">For testing payments:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use UPI as payment method</li>
                <li className="flex flex-col gap-2">
                  <span>Use test UPI ID:</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-orange-100 text-orange-900 px-3 py-2 rounded font-mono font-bold border border-orange-300 text-sm">example@hdfcbank</code>
                    <button
                      onClick={copyUpiId}
                      className={`btn btn-sm ${copied ? 'btn-success' : 'btn-warning'} text-white font-semibold`}
                      title={copied ? 'Copied!' : 'Copy UPI ID'}
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </li>
                <li className="text-orange-600 font-medium">📋 Please copy the UPI ID above for easy testing!</li>
                <li>Any other test UPI ID will also work</li>
              </ul>
            </div>
          </div>
        </div>
        {membershipDetails ? (
          <div className="text-center mb-12">
            <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-base-100 shadow-lg border border-base-300">
              <div className={`text-2xl font-bold mb-2 ${
                membershipDetails.membershipType === 'gold' ? 'text-yellow-500' : 'text-slate-400'
              }`}>
                {membershipDetails.membershipType.charAt(0).toUpperCase() + membershipDetails.membershipType.slice(1)} Member
              </div>
              <div className="text-base-content/70 mb-4">
                {membershipDetails.isPremium ? 
                  `Expires in ${membershipDetails.daysUntilExpiry} days` : 
                  'Not a premium member'}
              </div>
              <button 
                onClick={verifyPremiumUser}
                className="btn btn-sm btn-outline mb-4"
              >
                Refresh Status
              </button>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat Enabled
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {membershipDetails.membershipType === 'gold' ? 'Unlimited' : '100'} Decisions/Day
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-3xl font-bold mb-6 text-slate-400">Silver</h2>
              <div className="text-3xl font-bold mb-6">₹499<span className="text-base font-normal text-base-content/70">/month</span></div>
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Chat with anyone
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100 decisions per day
                </li>
              </ul>
              <button
                onClick={() => handleBuyClick("silver")}
                className="btn btn-block bg-slate-400 hover:bg-slate-500 text-white border-none"
                disabled={membershipDetails?.membershipType === 'silver'}
              >
                {membershipDetails?.membershipType === 'silver' ? 'Current Plan' : 'Get Silver'}
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border-2 border-yellow-500/20">
            <div className="card-body text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="badge badge-warning">MOST POPULAR</div>
              </div>
              <h2 className="card-title justify-center text-3xl font-bold mb-6 text-yellow-500">Gold</h2>
              <div className="text-3xl font-bold mb-6">₹899<span className="text-base font-normal text-base-content/70">/month</span></div>
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Chat with anyone
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited decisions
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority in search results
                </li>
              </ul>
              <button
                onClick={() => handleBuyClick("gold")}
                className="btn btn-block bg-yellow-500 hover:bg-yellow-600 text-white border-none"
                disabled={membershipDetails?.membershipType === 'gold'}
              >
                {membershipDetails?.membershipType === 'gold' ? 'Current Plan' : 'Get Gold'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Premium;