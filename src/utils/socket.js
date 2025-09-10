import io from "socket.io-client";
import { BASE_URL } from "./constants";

const createSocketConnection = () => {
  const baseUrl = location.hostname === "localhost" ? "http://localhost:7777" : "/";
  return io(baseUrl, {
    withCredentials: true,
    transports: ['websocket', 'polling']
  });
};

export default createSocketConnection;