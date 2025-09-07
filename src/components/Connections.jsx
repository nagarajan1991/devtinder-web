import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addConnection } from '../utils/connectionSlice';
import { Link } from 'react-router-dom';

function Connections() {
    const connections = useSelector(store => store.connections);
    const dispatch = useDispatch();

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
            <div className="flex flex-col items-center justify-center h-64">
                <h1 className="text-3xl font-semibold text-gray-700 mb-4">Your Connections</h1>
                <p className="text-gray-500">No connections found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto my-10 px-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-primary">Your Connections</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {connections.data.map((connection) => {
                    const { _id, firstName, lastName, photoUrl, about, age, gender } = connection;
                    return (
                        <div
                            key={_id}
                            className="card bg-base-100 shadow-md border border-base-200 flex flex-col items-center p-6"
                        >
                            <img
                                alt={`${firstName} ${lastName}`}
                                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary"
                                src={photoUrl}
                            />
                            <h2 className="text-xl font-semibold mb-1">{firstName} {lastName}</h2>
                            {age && gender && (
                                <p className="text-sm text-white mb-2">{age} &bull; {gender}</p>
                            )}
                            <p className="text-white text-center mb-2">{about}</p>
                            <Link to={"/chat/" + _id}>
              <button className="btn btn-primary">Chat</button>
            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Connections;