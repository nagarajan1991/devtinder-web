import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import NavBar from "./NavBar";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    setError("");
    setIsLoading(true);
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.patch(
        BASE_URL + "/auth/change-password",
        {
          currentPassword,
          newPassword
        },
        { withCredentials: true }
      );
      
      setSuccess(true);
      setError("");
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen py-8 bg-base-200">
        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Change Password
            </h1>
            <p className="text-base-content opacity-70">
              Update your account password
            </p>
          </div>

          {/* Password Change Form */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
              <div className="space-y-6">
                {/* Current Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Current Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      className="input input-bordered w-full pr-10"
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content disabled:opacity-50"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={isLoading}
                    >
                      {showCurrentPassword ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      className="input input-bordered w-full pr-10"
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content disabled:opacity-50"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isLoading}
                    >
                      {showNewPassword ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="label">
                    <span className="label-text-alt text-xs text-base-content/70">
                      Password must be at least 8 characters with uppercase, lowercase, number, and special character
                    </span>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Confirm New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      className={`input input-bordered w-full pr-10 ${
                        confirmPassword && newPassword !== confirmPassword ? 'input-error' : ''
                      }`}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content disabled:opacity-50"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <div className="label">
                      <span className="label-text-alt text-error">Passwords do not match</span>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-error">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="alert alert-success">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Password changed successfully!</span>
                  </div>
                )}

                {/* Change Password Button */}
                <div className="pt-2">
                  <button 
                    className="btn btn-primary w-full"
                    onClick={handleChangePassword}
                    disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Changing Password...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>

                {/* Back to Profile Link */}
                <div className="text-center">
                  <button
                    className="link link-primary hover:link-primary-focus transition-colors"
                    onClick={() => window.history.back()}
                  >
                    ← Back to Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="card bg-base-100 shadow-lg mt-6">
            <div className="card-body p-6">
              <h3 className="text-lg font-semibold mb-3">🔒 Security Tips</h3>
              <ul className="text-sm text-base-content/70 space-y-2">
                <li>• Use a unique password that you don't use elsewhere</li>
                <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
                <li>• Avoid using personal information in your password</li>
                <li>• Consider using a password manager to generate and store secure passwords</li>
                <li>• Never share your password with anyone</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
