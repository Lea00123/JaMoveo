import React, { useState } from 'react';
import './../global.css';
import socket from './socket';

const AdminMainPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = () => {
        if (!searchQuery) {
            alert("Please enter a search query.");
            return;
        }

        setLoading(true);
        socket.emit('searchSong', searchQuery);
    };

    return (
        <div className="container"> 
            <img src='/band4.jpeg' alt='Rehearsal App Logo' className="logo" />
            <h1>Search any song...</h1>
            <div className="search-container">
                <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Enter song name"
                />
                <button className="button" onClick={handleSearch}>Search</button>
            </div>

            {loading && <div>Loading...</div>}
        </div>
    );
};

export default AdminMainPage;