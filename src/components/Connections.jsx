import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addConnection } from '../utils/connectionSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStatus } from '../contexts/UserStatusContext';

function Connections() {
    const connections = useSelector(store => store.connections);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isUserOnline, getStatusColor } = useUserStatus();
    const [isPremium, setIsPremium] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Check premium status
    useEffect(() => {
        const checkPremiumStatus = async () => {
            try {
                const res = await axios.get(BASE_URL + "/premium/verify", {
                    withCredentials: true,
                });
                
                const { isPremium, membershipExpiry } = res.data;
                
                // Check if membership is valid
                if (isPremium && membershipExpiry) {
                    const now = new Date();
                    const expiry = new Date(membershipExpiry);
                    
                    if (now < expiry) {
                        setIsPremium(true);
                        return;
                    }
                }
                
                setIsPremium(false);
            } catch (err) {
                console.error("Error checking premium status:", err);
                setIsPremium(false);
            }
        };
        checkPremiumStatus();
    }, []);

    const fetchConnections = async () => {
        try {
            const response = await axios.get(BASE_URL + '/user/connections', { withCredentials: true });
            dispatch(addConnection(response.data));
        } catch (error) {
            console.error("Error fetching connections:", error);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections || !connections.data || connections.data.length === 0) {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-base-300 rounded-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-base-content opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        Your Connections
                    </h1>
                    <p className="text-base-content opacity-70 text-lg mb-8">No connections found yet. Start connecting with other people!</p>
                    <Link to="/" className="btn btn-primary btn-lg">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Discover People
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        Your Connections
                    </h1>
                    <p className="text-base-content opacity-70 text-lg">
                        Connect and chat with amazing people
                    </p>
                </div>

                {/* Connections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {connections.data.map((connection) => {
                        const { _id, firstName, lastName, photoUrl, about, age, gender, skills } = connection;
                        return (
                            <div
                                key={_id}
                                className="group card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-base-300"
                            >
                                <div className="card-body p-6">
                                    {/* Profile Image */}
                                    <div className="flex justify-center mb-4">
                                        <div className="relative">
                                            <img
                                                alt={`${firstName} ${lastName}`}
                                                className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow-lg"
                                                src={photoUrl}
                                            />
                                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(_id)} rounded-full border-2 border-base-100`}></div>
                                        </div>
                                    </div>

                                    {/* Name and Basic Info */}
                                    <div className="text-center mb-4">
                                        <h2 className="text-xl font-bold text-base-content mb-1">
                                            {firstName} {lastName}
                                        </h2>
                                        {age && gender && (
                                            <div className="flex justify-center gap-2 mb-2">
                                                <span className="badge badge-primary badge-sm">{age}</span>
                                                <span className="badge badge-secondary badge-sm">{gender}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* About Section */}
                                    {about && (
                                        <p className="text-base-content opacity-80 text-sm text-center mb-4 line-clamp-2">
                                            {about}
                                        </p>
                                    )}

                                    {/* Skills */}
                                    {skills && skills.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {skills.slice(0, 3).map((skill, index) => (
                                                    <span key={index} className="badge badge-outline badge-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {skills.length > 3 && (
                                                    <span className="badge badge-outline badge-xs">
                                                        +{skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <div className="card-actions justify-center mt-auto">
                                        {isPremium ? (
                                            <Link to={"/chat/" + _id} className="w-full">
                                                <button className="btn btn-primary btn-sm w-full group-hover:btn-accent transition-colors duration-300">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    Start Chat
                                                </button>
                                            </Link>
                                        ) : (
                                            <button 
                                                onClick={() => setShowPremiumModal(true)}
                                                className="btn btn-ghost btn-sm w-full text-warning hover:bg-warning/10"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                                Upgrade to Chat
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Premium Modal */}
                {showPremiumModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-base-100 rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Premium Feature</h3>
                                <p className="text-base-content/70 mb-6">
                                    Chat is a premium feature. Upgrade your account to start chatting with your connections!
                                </p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => navigate('/premium')} 
                                        className="btn btn-warning flex-1"
                                    >
                                        Upgrade Now
                                    </button>
                                    <button 
                                        onClick={() => setShowPremiumModal(false)} 
                                        className="btn btn-ghost flex-1"
                                    >
                                        Maybe Later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Connections;