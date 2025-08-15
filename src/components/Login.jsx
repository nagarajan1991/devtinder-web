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
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      setError(err?.response?.data || "Something went wrong");
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

    try {
      // Convert skills string to array (comma-separated)
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      
      const res = await axios.post(
        BASE_URL + "/signup",
        { 
          firstName, 
          lastName, 
          emailId, 
          password,
          photoUrl,
          age: parseInt(age) || undefined,
          gender,
          skills: skillsArray,
          about
        },
        { withCredentials: true }
      );
      
      // Show success toast
      setShowSuccessToast(true);
      
      // Clear form and switch to login
      clearForm();
      setIsLoginForm(true);
      
      // Hide toast after 5 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
      
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
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
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      min="1"
                      max="120"
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
                  
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Photo URL</span>
                    </div>
                    <input
                      type="url"
                      value={photoUrl}
                      className="input input-bordered"
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </label>
                </div>

                {/* Skills and About Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Skills (comma-separated)</span>
                    </div>
                    <input
                      type="text"
                      value={skills}
                      className="input input-bordered"
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="JavaScript, React, Node.js"
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
              <h3 className="font-bold">Account Created Successfully!</h3>
              <div className="text-xs">You can now login with your email and password.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;