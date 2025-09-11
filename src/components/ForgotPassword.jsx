import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ForgotPassword = () => {
  const [emailId, setEmailId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(BASE_URL + "/auth/forgot-password", {
        emailId: emailId.trim(),
      });

      setMessage(response.data.message);
      setEmailId(""); // Clear the form
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center my-10">
        <div className="card bg-base-300 shadow-xl w-96">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-6">
              Forgot Password
            </h2>
            
            <p className="text-center text-base-content/70 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="form-control">
                <div className="label">
                  <span className="label-text font-medium">Email ID *</span>
                </div>
                <input
                  type="email"
                  value={emailId}
                  className="input input-bordered w-full"
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </label>

              {message && (
                <div className="alert alert-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="card-actions justify-center mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading || !emailId.trim()}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <button
                className="link link-primary hover:link-primary-focus transition-colors"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
