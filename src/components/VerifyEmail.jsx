import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import NavBar from "./NavBar";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    // Verify the email
    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      setStatus("verifying");
      
      // Add a minimum loading time for better UX
      const minLoadingTime = 5000; // 5 seconds minimum loading
      const startTime = Date.now();
      
      const response = await axios.get(`${BASE_URL}/verify-email?token=${token}`);
      
      // Ensure minimum loading time has passed
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setStatus("success");
        setMessage(response.data.message);
        
        // Redirect to login after 2 seconds for already verified users, 3 seconds for new verification
        const redirectDelay = response.data.message.includes("already been verified") ? 2000 : 3000;
        setTimeout(() => {
          navigate("/login");
        }, redirectDelay);
      }, remainingTime);
      
    } catch (error) {
      // Add a minimum loading time for better UX even on errors
      const minLoadingTime = 8000; // 8 seconds minimum loading
      const startTime = Date.now();
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setStatus("error");
        const errorMessage = error.response?.data?.message || "Email verification failed";
        
        // Provide more helpful error messages
        if (errorMessage.includes("Invalid verification token")) {
          setMessage("This verification link is invalid. Please request a new verification email.");
        } else if (errorMessage.includes("expired")) {
          setMessage("This verification link has expired. Please request a new verification email.");
        } else {
          setMessage(errorMessage);
        }
      }, remainingTime);
    }
  };

  const resendVerification = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email address");
      return;
    }

    try {
      setIsResending(true);
      const response = await axios.post(`${BASE_URL}/resend-verification`, {
        emailId: email
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="card bg-base-300 shadow-xl w-full max-w-md">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-2xl mb-6">
              Email Verification
            </h2>

            {status === "verifying" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Verifying Your Email</h3>
                  <p className="text-base-content/70">Please wait while we verify your email address...</p>
                  <p className="text-sm text-base-content/50 mt-2">This may take a few moments</p>
                </div>
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-1 bg-base-300 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="text-6xl text-success">✅</div>
                <h3 className="text-xl font-semibold text-success">
                  {message.includes("already been verified") ? "Already Verified!" : "Email Verified!"}
                </h3>
                <p className="text-base-content/70">{message}</p>
                <p className="text-sm text-base-content/60">
                  Redirecting to login page in {message.includes("already been verified") ? "2" : "3"} seconds...
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="text-6xl text-error">❌</div>
                <h3 className="text-xl font-semibold text-error">Verification Failed</h3>
                <p className="text-base-content/70">{message}</p>
                
                <div className="divider">OR</div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Resend Verification Email</h4>
                  <div className="form-control">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="input input-bordered"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button 
                    className={`btn btn-primary w-full ${isResending ? 'loading' : ''}`}
                    onClick={resendVerification}
                    disabled={isResending}
                  >
                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </div>
                
                <div className="card-actions justify-center">
                  <button 
                    className="btn btn-outline"
                    onClick={() => navigate("/login")}
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {message && status !== "verifying" && (
              <div className={`alert ${status === "success" ? "alert-success" : status === "error" ? "alert-error" : "alert-info"} mt-4`}>
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
