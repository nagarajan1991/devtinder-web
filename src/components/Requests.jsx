import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import { useUserStatus } from "../contexts/UserStatusContext";
import { useNavigate } from "react-router-dom";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const { getStatusColor } = useUserStatus();
  const navigate = useNavigate();

  const reviewRequest = async (status, _id) => {
    try {
      const res = axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <div className="min-h-full py-8 bg-base-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-base-300 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-base-content opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              No Connection Requests
            </h1>
            <p className="text-base-content opacity-70 text-lg mb-8">You don't have any pending connection requests at the moment.</p>
            <div className="flex gap-4">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Discover People
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/connections')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View Connections
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-full py-8 bg-base-200">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Connection Requests
          </h1>
          <p className="text-base-content opacity-70 text-lg">
            You have {requests.length} pending connection request{requests.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = request.fromUserId;

            return (
              <div
                key={_id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-base-300"
              >
                <div className="card-body p-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        alt={`${firstName} ${lastName}`}
                        className="w-16 h-16 rounded-full object-cover border-4 border-primary shadow-lg"
                        src={photoUrl}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(_id)} rounded-full border-2 border-base-100`}></div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-base-content">
                        {firstName} {lastName}
                      </h2>
                      {age && gender && (
                        <div className="flex gap-2 mt-1">
                          <span className="badge badge-primary badge-sm">{age}</span>
                          <span className="badge badge-secondary badge-sm capitalize">{gender}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* About Section */}
                  {about && (
                    <p className="text-base-content opacity-80 text-sm mb-4 line-clamp-3">
                      {about}
                    </p>
                  )}

                  {/* Skills */}
                  {skills && skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
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

                  {/* Action Buttons */}
                  <div className="card-actions justify-center gap-2 mt-auto">
                    <button
                      className="btn btn-error btn-sm flex-1"
                      onClick={() => reviewRequest("rejected", request._id)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                    <button
                      className="btn btn-success btn-sm flex-1"
                      onClick={() => reviewRequest("accepted", request._id)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Requests;