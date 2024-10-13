import React, { useEffect } from 'react';
import socket from './socket';
import './../global.css'; 

const PlayerMainPage = ({ onSelectSong }) => {  

    useEffect(() => {
        const handleSongSelected = (songData) => {
            onSelectSong(songData);
        };

        // Listen for the 'songSelected' event from the server
        socket.on('songSelected', handleSongSelected);

        // Clean up the socket connection
        return () => {
            socket.off('songSelected', handleSongSelected);
        };
    }, [onSelectSong]);

    return (
        <div className="container"> 
             <img src='/band4.jpeg' alt='Rehearsal App Logo' className="logo" />
            <h1>Waiting for next song...</h1>
        </div>
    );
};

export default PlayerMainPage;
