import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../global.css'; 

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container"> 
            <img src='/band4.jpeg' alt='Rehearsal App Logo' className="logo" />
            <h1 className="title">Welcome to the Rehearsal App!</h1>
            <button className="button" onClick={() => navigate('/signup')}>Sign Up</button>
            <button className="button" onClick={() => navigate('/login')}>Login</button>
            <button className="button" onClick={() => navigate('/admin/login')}>Login as Admin</button>
        </div>
    );
};

export default LandingPage;
