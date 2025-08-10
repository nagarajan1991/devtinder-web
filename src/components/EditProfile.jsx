import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import UserCard from './UserCard';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';

const EditProfile = ({user}) => {
    const [showToast, setShowToast] = useState(false);


    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [emailId, setEmailId] = useState(user.emailId);
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [age, setAge] = useState(user.age);
    const [gender, setGender] = useState(user.gender);
    const [about, setAbout] = useState(user.about);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const dispatch = useDispatch();
    const saveProfile = async () => {
      try {
        const response = await axios.patch(BASE_URL + '/profile/edit', {
          firstName,
          lastName,
          emailId,
          photoUrl,
          age,
          gender,
          about
        }, { withCredentials: true });
        dispatch(addUser(response?.data?.data))
        if (response.status === 200) {
          // Profile updated successfully
          setSuccess("Profile updated successfully!"); // <-- Set success message
          setError(""); // Clear any previous error
          setShowToast(true); 
          setTimeout(() => {
            setShowToast(false); // Hide toast after 3 seconds
          }, 3000);
        }
      } catch (error) {
        setError(error.response?.data || error.message); // Prefer backend error message if available, else use generic error
        setSuccess(""); // Clear any previous success message
        console.error("Error updating profile:", error);
      }
    };

  return (
      <div className="flex justify-center my-10">
        {/* DaisyUI Toast */}
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Profile updated successfully!</span>
          </div>
        </div>
      )}
        <div className="flex justify-center mx-10">
    <div className="card card-border bg-base-300 w-96">
    <div className="card-body">
    <h2 className="card-title justify-center">Login</h2>
    <div>
        <input  
        type="text" 
        placeholder="First Name" 
        className="input input-bordered w-full max-w-xs" 
        value={firstName}
        onChange={(e) =>
            setFirstName(e.target.value)}
        />
    </div>
    <div>
        <input  
        type="text" 
        placeholder="Last Name" 
        className="input input-bordered w-full max-w-xs" 
        value={lastName}
        onChange={(e) =>
            setLastName(e.target.value)}
        />
    </div>
        <div>
        <input  
        type="text" 
        placeholder="Email ID" 
        className="input input-bordered w-full max-w-xs" 
        value={emailId}
        onChange={(e) =>
            setEmailId(e.target.value)}
        />
    </div>
        <div>
        <input  
        type="text" 
        placeholder="Photo URL" 
        className="input input-bordered w-full max-w-xs" 
        value={photoUrl}
        onChange={(e) =>
            setPhotoUrl(e.target.value)}
        />
    </div>
        <div>
        <input  
        type="text" 
        placeholder="Age" 
        className="input input-bordered w-full max-w-xs" 
        value={age}
        onChange={(e) =>
            setAge(e.target.value)}
        />
    </div>
        <div>
        <input  
        type="text" 
        placeholder="Gender" 
        className="input input-bordered w-full max-w-xs" 
        value={gender}
        onChange={(e) =>
            setGender(e.target.value)}
        />
    </div>
    <div>
        <input  
        type="text" 
        placeholder="About" 
        className="input input-bordered w-full max-w-xs" 
        value={about}
        onChange={(e) =>
            setAbout(e.target.value)}
        />
    </div>
    <p className='text-red-500'>{error}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary" onClick={saveProfile}>Save Profile</button>
    </div>
  </div>
</div>
        </div>
        <UserCard user={{firstName, lastName, emailId, photoUrl, age, gender, about}} />
      </div>
  )
}

export default EditProfile