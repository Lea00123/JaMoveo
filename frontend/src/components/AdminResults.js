import React from 'react';
import './../global.css';

const AdminResults = ({ results, onSelectSong }) => { 
    const handleSelectSong = (song) => {
        onSelectSong(song);
    };

    return (
        <div className="background">
            <h2>Search Results:</h2> 
            {results.length > 0 ? ( 
                <ul>
                    {results.map((song, index) => (
                        <li 
                            key={index} 
                            className="button" 
                            onClick={() => handleSelectSong(song)}
                        >
                            <div>
                                <h3>{song.songName}</h3>
                                <p>{song.artistName}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found. Please try a different search query.</p>
            )}
        </div>
    );
};

export default AdminResults;