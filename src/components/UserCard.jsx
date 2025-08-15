import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, showActions = true }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };

  return (
    <div className="card bg-base-100 shadow-2xl border border-base-300 max-w-sm mx-auto">
      {/* Image Section */}
      <figure className="relative h-80 overflow-hidden">
        <img 
          src={photoUrl} 
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </figure>

      {/* Content Section */}
      <div className="card-body p-6">
        {/* Header with name and basic info */}
        <div className="mb-4">
          <h2 className="card-title text-2xl font-bold text-base-content mb-2">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <div className="flex items-center gap-2 text-base-content/70">
              <span className="badge badge-primary badge-sm">{age} years</span>
              <span className="badge badge-secondary badge-sm">{gender}</span>
            </div>
          )}
        </div>

        {/* About section */}
        {about && (
          <div className="mb-6">
            <p className="text-base-content/80 leading-relaxed">
              {about}
            </p>
          </div>
        )}

        {/* Action buttons - only show if showActions is true */}
        {showActions && (
          <div className="card-actions justify-center gap-3">
            <button
              className="btn btn-outline btn-error flex-1"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Ignore
            </button>
            <button
              className="btn btn-primary flex-1"
              onClick={() => handleSendRequest("interested", _id)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;