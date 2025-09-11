import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(
   user.gender ? String(user.gender).toLowerCase() : ""
  );
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills ? user.skills.join(', ') : "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

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

  const saveProfile = async () => {
    //Clear Errors
    setError("");
    
    // Validate age constraints
    if (age && (isNaN(age) || age < 1 || age >= 100 || !Number.isInteger(Number(age)))) {
      setError("Age must be a whole number between 1 and 99");
      return;
    }

    try {
      // Validate image URL before proceeding
      await validateImageUrl(photoUrl);

      // Convert skills string to array (comma-separated)
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl: photoUrl.trim() || undefined, // Send undefined if empty to use default
          age,
          gender,
          about,
          skills: skillsArray,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err?.message || err.response?.data?.message || err.response?.data || "Something went wrong");
    }
  };


  return (
    <>
      <div className="min-h-full py-8 bg-base-200">
        <div className="max-w-6xl mx-auto px-4">
          {/* Simple Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Edit Profile
            </h1>
            <p className="text-base-content opacity-70">
              Update your information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Form */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Information</h2>
                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">First Name</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        className="input input-bordered w-full"
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Last Name</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        className="input input-bordered w-full"
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  {/* Photo URL */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Profile Photo URL (Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={photoUrl}
                      className="input input-bordered w-full"
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://example.com/your-photo.jpg"
                    />
                    <div className="label">
                      <span className="label-text-alt text-xs text-base-content/70">
                        💡 <strong>How to get an image URL:</strong><br/>
                        1. Go to Google Images and search for a profile picture<br/>
                        2. Right-click on an image and select "Copy image address"<br/>
                        3. Paste the URL here<br/>
                        <span className="text-primary">Leave empty to use default avatar</span>
                      </span>
                    </div>

                  </div>

                  {/* Age and Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Age</span>
                      </label>
                      <input
                        type="number"
                        value={age}
                        className="input input-bordered w-full"
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow whole numbers between 1 and 99
                          if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) < 100)) {
                            setAge(value);
                          }
                        }}
                        placeholder="Your age"
                        min="1"
                        max="99"
                        step="1"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Gender</span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">About You</span>
                    </label>
                    <textarea
                      value={about}
                      className="textarea textarea-bordered w-full h-24 resize-none"
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Tell us about yourself, your interests, and what you're looking for..."
                    />
                  </div>

                  {/* Skills Section */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Skills & Hobbies (comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={skills}
                      className="input input-bordered w-full"
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Tech, Art, Music, Sports..."
                    />
                    <div className="label">
                      <span className="label-text-alt text-xs text-base-content/70">
                        💡 Separate multiple skills and hobbies with commas
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-error">
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="pt-2">
                    <button 
                      className="btn btn-primary w-full"
                      onClick={saveProfile}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Preview */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-6">
                <h2 className="text-xl font-semibold mb-4">Preview</h2>
                <div className="flex justify-center">
                  <UserCard
                    user={{ firstName, lastName, photoUrl, age, gender, about, skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) }}
                    showActions={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Profile saved successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};
export default EditProfile;