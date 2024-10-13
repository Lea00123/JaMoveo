import React, { useState } from 'react';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import AdminLoginForm from './components/AdminLoginForm';
import AdminMainPage from './components/AdminMainPage';
import PlayerMainPage from './components/PlayerMainPage';
import AdminResults from './components/AdminResults';
import LandingPage from './components/LandingPage'; 
import LivePage from './components/LivePage';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import socket from './components/socket';  
import './/global.css';

function App() {
    const navigate = useNavigate(); 
    const [userRole, setUserRole] = useState(null);
    const [userInstrument, setUserInstrument] = useState(null);
    const results = useState(null);

    const handleSignupSuccess = () => {
        navigate('/login'); 
    };

    const handleLoginSuccess = (role, instrument) => {
        console.log('Navigating to role:', role);
        setUserRole(role);
        setUserInstrument(instrument); 

        setTimeout(() => {
            if (role === 'admin') {
                navigate('/adminmain');
            } else if (role === 'user') {
                navigate('/playermain');
            }
        }, 0); 
    };

    const handleSelectSong = (song) => {
        console.log('Selected song:', song);
        socket.emit('selectSong', song);
        navigate('/live', { state: { songTitle: song.songName, songArtist: song.artistName, songUrl: song.url } });
    };

    return (
        <div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignupForm onSignupSuccess={handleSignupSuccess} />} />
                <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/admin/login" element={<AdminLoginForm onLoginSuccess={handleLoginSuccess} />} />
                <Route 
                    path="/adminmain" 
                    element={<AdminMainPage />}
                />
                <Route 
                    path="/adminresults" 
                    element={<AdminResults results={results} onSelectSong={handleSelectSong} />}
                />
                <Route 
                    path="/playermain" 
                    element={<PlayerMainPage onSelectSong={handleSelectSong} />} 
                />
                <Route path="/live" element={<LivePage userRole={userRole} userInstrument={userInstrument} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;