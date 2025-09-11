import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Body from './components/Body';
import Login from './components/Login';
import Profile from './components/Profile';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import Feed from './components/Feed';
import Connections from './components/Connections';
import Requests from './components/Requests';
import Premium from './components/Premium';
import Chat from "./components/Chat";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyEmail from "./components/VerifyEmail";
import ChangePassword from "./components/ChangePassword";
import { ThemeProvider } from './contexts/ThemeContext';
import { UserStatusProvider } from './contexts/UserStatusContext';
import AuthProvider from './contexts/AuthProvider';
import MembershipStatus from './components/MembershipStatus';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <ThemeProvider>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <AuthProvider>
            <UserStatusProvider>
              <MembershipStatus />
              <Routes>
                {/* Standalone auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/change-password" element={<ChangePassword />} />
                
                {/* Main app routes with NavBar and Footer */}
                <Route path="/" element={<Body />}> 
                  <Route path="/" element={<Feed />} /> 
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/connections" element={<Connections />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/chat/:targetUserId" element={<Chat />} />
                </Route>
              </Routes>
            </UserStatusProvider>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
      </>
  );
}


export default App;
