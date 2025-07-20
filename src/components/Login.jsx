import { React, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {
    const [emailId, setEmailId] = useState("nagarajan1991@gmail.com");
    const [password, setPassword] = useState("Naga@1234$");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post(BASE_URL + "/login", {
            emailId,
            password,
        },
      {withCredentials: true})
            dispatch(addUser(res.data));
            return navigate("/");
        }
        catch (err) {
            setError(err.response.data|| "Login failed. Please try again.");
        }

    }


  return (
    <div className="flex justify-center my-10">
    <div className="card card-border bg-base-300 w-96">
    <div className="card-body">
    <h2 className="card-title justify-center">Login</h2>
    <div>
        <input  
        type="text" 
        placeholder="Email" 
        className="input input-bordered w-full max-w-xs" 
        value={emailId}
        onChange={(e) =>
            setEmailId(e.target.value)}
        />
    </div>
    <div>
        <input type="text" 
        placeholder="Password" 
        className="input input-bordered w-full max-w-xs" 
        value={password}    
        onChange={(e) =>
            setPassword(e.target.value)}
        />
    </div>
    <p className='text-red-500'>{error}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
    </div>
  </div>
</div>
</div>
  )
}

export default Login;