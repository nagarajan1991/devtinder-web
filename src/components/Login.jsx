import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import NavBar from "./NavBar";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle photo URL change with preview
  const handlePhotoUrlChange = (url) => {
    setPhotoUrl(url);
    setImagePreviewError(false);
    
    if (url && url.trim()) {
      setIsImageLoading(true);
      setImagePreviewError(false);
    } else {
      setIsImageLoading(false);
    }
  };

  // Handle image load success
  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImagePreviewError(false);
  };

  // Handle image load error
  const handleImageError = () => {
    setIsImageLoading(false);
    setImagePreviewError(true);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate required fields
    if (!firstName || !lastName || !emailId || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate age constraints
    if (age && (isNaN(age) || age < 1 || age >= 100 || !Number.isInteger(Number(age)))) {
      setError("Age must be a whole number between 1 and 99");
      return;
    }

    // Image validation function
    const validateImageUrl = (url) => {
      return new Promise((resolve, reject) => {
        if (!url || !url.trim()) {
          // No URL provided, use default avatar
          resolve(true);
          return;
        }

        const img = new Image();
        img.onload = () => {
          // Image loads successfully
          resolve(true);
        };
        img.onerror = () => {
          // Image fails to load
          reject(new Error("The provided image URL is invalid or cannot be accessed. Please use a different URL or leave it empty to use the default avatar."));
        };
        
        // Set timeout for image loading (5 seconds)
        const timeout = setTimeout(() => {
          reject(new Error("Image loading timed out. Please use a different URL or leave it empty to use the default avatar."));
        }, 5000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve(true);
        };
        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error("The provided image URL is invalid or cannot be accessed. Please use a different URL or leave it empty to use the default avatar."));
        };

        img.src = url;
      });
    };

    try {
      // Validate image URL before proceeding
      await validateImageUrl(photoUrl);

      // Convert skills string to array (comma-separated)
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      
      const res = await axios.post(
        BASE_URL + "/signup",
        { 
          firstName, 
          lastName, 
          emailId, 
          password,
          photoUrl: photoUrl.trim() || undefined, // Send undefined if empty to use default
          age: parseInt(age) || undefined,
          gender,
          skills: skillsArray,
          about
        },
        { withCredentials: true }
      );
      
      // Show success message
      setError(""); // Clear any existing errors
      setSuccessMessage("Account created successfully! Please check your email and click the verification link before logging in.");
      setShowSuccessToast(true);
      
      // Clear form and switch to login
      clearForm();
      setIsLoginForm(true);
      
      // Hide toast after 8 seconds (longer for verification message)
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 8000);
      
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || err?.response?.data || "Something went wrong");
    }
  };

  const clearForm = () => {
    setEmailId("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setPhotoUrl("");
    setAge("");
    setGender("");
    setSkills("");
    setAbout("");
    setError("");
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    clearForm();
  };

  const resendVerification = async () => {
    if (!emailId.trim()) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setIsResendingVerification(true);
      const response = await axios.post(`${BASE_URL}/resend-verification`, {
        emailId: emailId
      });
      setError(""); // Clear error
      setSuccessMessage("Verification email sent! Please check your email and click the verification link.");
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend verification email");
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-center my-10">
        <div className={`card bg-base-300 shadow-xl ${!isLoginForm ? 'w-full max-w-2xl' : 'w-96'}`}>
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-6">
              {isLoginForm ? "Login" : "Create Your Account"}
            </h2>
            
            {isLoginForm ? (
              // Login Form - Simple layout
              <div className="space-y-4">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium">Email ID *</span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailId}
                      className="input input-bordered w-full pr-10"
                      onChange={(e) => setEmailId(e.target.value)}
                      required
                    />
                  </div>
                </label>
                
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium">Password *</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      className="input input-bordered w-full pr-10"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
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
                </label>
                
                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    className="link link-primary text-sm hover:link-primary-focus transition-colors"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            ) : (
              // Signup Form - Clean grid layout
              <div className="space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">First Name *</span>
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      className="input input-bordered"
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </label>
                  
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Last Name *</span>
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      className="input input-bordered"
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </label>
                </div>

                {/* Age and Gender Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Age</span>
                    </div>
                    <input
                      type="number"
                      value={age}
                      className="input input-bordered"
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow whole numbers between 1 and 99
                        if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) < 100)) {
                          setAge(value);
                        }
                      }}
                      placeholder="25"
                      min="1"
                      max="99"
                      step="1"
                    />
                  </label>
                  
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Gender</span>
                    </div>
                    <select
                      value={gender}
                      className="select select-bordered"
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>

                {/* Email and Photo Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Email ID *</span>
                    </div>
                    <input
                      type="email"
                      value={emailId}
                      className="input input-bordered"
                      onChange={(e) => setEmailId(e.target.value)}
                      required
                    />
                  </label>
                  
                  {/* Email verification note */}
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 text-sm">📧</span>
                      <div className="text-xs text-blue-800">
                        <strong>Important:</strong> A valid email address is required. You'll receive a verification email and must verify your account before you can log in.
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="form-control">
                    <div className="label">
                      <span className="label-text">Profile Photo URL (Optional)</span>
                    </div>
                    
                    {/* Photo URL Input and Preview Side by Side */}
                    <div className="flex gap-4 items-start">
                      {/* Input Field */}
                      <div className="flex-1">
                        <input
                          type="url"
                          value={photoUrl}
                          className="input input-bordered w-full"
                          onChange={(e) => handlePhotoUrlChange(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                        />
                        <div className="label mt-2">
                          <span className="label-text-alt text-xs text-base-content/70">
                            💡 <strong>How to get an image URL:</strong><br/>
                            1. Go to Google Images and search for a profile picture<br/>
                            2. Right-click on an image and select "Copy image address"<br/>
                            3. Paste the URL here<br/>
                            <span className="text-primary">Leave empty to use default avatar</span>
                          </span>
                        </div>
                      </div>
                      
                      {/* Profile Preview - Right Side */}
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-base-content/70 mb-2">Preview:</div>
                        <div className="relative w-20 h-20 border-2 border-base-300 rounded-full overflow-hidden bg-base-200 flex items-center justify-center shadow-lg">
                          {isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-base-200 rounded-full">
                              <div className="loading loading-spinner loading-sm"></div>
                            </div>
                          )}
                          {imagePreviewError ? (
                            <div className="flex flex-col items-center justify-center text-xs text-error">
                              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <span className="text-center">Invalid</span>
                            </div>
                          ) : photoUrl && photoUrl.trim() ? (
                            <img
                              src={photoUrl}
                              alt="Profile preview"
                              className="w-full h-full object-cover rounded-full"
                              onLoad={handleImageLoad}
                              onError={handleImageError}
                              style={{ display: isImageLoading ? 'none' : 'block' }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : '👤'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-base-content/60 mt-1 text-center">
                          {imagePreviewError ? 'Try different URL' : 
                           photoUrl && photoUrl.trim() ? 'Custom photo' : 
                           firstName && lastName ? 'Your initials' : 'Default avatar'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills and About Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Skills & Hobby (comma-separated)</span>
                    </div>
                    <input
                      type="text"
                      value={skills}
                      className="input input-bordered"
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Tech, Art, Music, Sports..."
                    />
                  </label>
                  
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">About</span>
                    </div>
                    <textarea
                      value={about}
                      className="textarea textarea-bordered"
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows="3"
                    />
                  </label>
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Password *</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        className="input input-bordered w-full pr-10"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
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
                  </label>
                  
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Confirm Password *</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        className={`input input-bordered w-full pr-10 ${
                          confirmPassword && password !== confirmPassword ? 'input-error' : ''
                        }`}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {confirmPassword && password !== confirmPassword && (
                      <div className="label">
                        <span className="label-text-alt text-error">Passwords do not match</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}
            
            <p className="text-red-500 text-center">{error}</p>
            
            {/* Show resend verification button if error is about email verification */}
            {error && error.includes("Email not verified") && isLoginForm && (
              <div className="text-center">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={resendVerification}
                  disabled={isResendingVerification}
                >
                  {isResendingVerification ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>
              </div>
            )}
            
            <div className="card-actions justify-center mt-6">
              <button
                className="btn btn-primary w-full"
                onClick={isLoginForm ? handleLogin : handleSignUp}
                disabled={!isLoginForm && password !== confirmPassword}
              >
                {isLoginForm ? "Login" : "Create Account"}
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                className="link link-primary hover:link-primary-focus transition-colors"
                onClick={toggleForm}
              >
                {isLoginForm
                  ? "New User? Sign up here"
                  : "Already have an account? Login here"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Success!</h3>
              <div className="text-xs">{successMessage}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;