import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from './socket';
import './live.css'; 

const LivePage = ({ userRole, userInstrument }) => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [songDetails, setSongDetails] = useState(null); 
    const [scrolling, setScrolling] = useState(false); 
    const { songTitle, songArtist, songUrl } = location.state || {}; 

    const scrollIntervalRef = useRef(null); 
    const contentRef = useRef(null); 

    useEffect(() => {
        if (songUrl) {
            socket.emit('scrapeSong', songUrl);
        }

        const songDetailsListener = (scrapedData) => {
            if (scrapedData) {
                setSongDetails({
                    title: songTitle || scrapedData.title,
                    artist: songArtist || scrapedData.artist,
                    content: scrapedData.content || []
                });
            } else {
                console.error('Failed to load song details');
            }
        };

        const quitListener = () => {
            navigate(userRole === 'admin' ? '/adminmain' : '/playermain');
        };

        socket.on('songDetails', songDetailsListener);
        socket.on('quit', quitListener);

        return () => {
            socket.off('songDetails', songDetailsListener);
            socket.off('quit', quitListener);
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current); 
            }
        };
    }, [songUrl, navigate, songTitle, songArtist, userRole]);

    const renderContent = () => {
        if (!songDetails || !songDetails.content) return null;

        const isHebrew = (text) => {
            return /[\u0590-\u05FF]/.test(text);
        };

        const addWordSpacing = (text) => {
            if (isHebrew(text)) {
                return text; 
            } else {
                return text.replace(/([a-z])([A-Z])/g, '$1 $2')
                           .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
                           .split('').join('\u200B');
            }
        };

        return songDetails.content.map((section, sectionIndex) => (
            <div key={sectionIndex} className="song-section">
                {userInstrument !== 'Singer' && Array.isArray(section) && (
                    <div className="chord-line">
                        {section.map((item, itemIndex) => (
                            <span key={`chord-${itemIndex}`} className="chord">
                                {item.chords ? addWordSpacing(item.chords) : ' '}
                            </span>
                        ))}
                    </div>
                )}
                <div className={`lyric-line ${isHebrew(Array.isArray(section) ? section[0].lyrics : section) ? 'hebrew' : ''}`}>
                    {Array.isArray(section) ? (
                        section.map((item, itemIndex) => (
                            <span key={`lyrics-${itemIndex}`} className="lyrics">
                                {item.lyrics ? addWordSpacing(item.lyrics) : ''}
                            </span>
                        ))
                    ) : (
                        <span className="lyrics">{section ? addWordSpacing(section) : ''}</span>
                    )}
                </div>
            </div>
        ));
    };

    const toggleScrolling = () => {
        setScrolling((prevScrolling) => {
            console.log("Current scrolling state:", prevScrolling);
            if (prevScrolling) {
                console.log("Attempting to stop scrolling");
                if (scrollIntervalRef.current) {
                    clearInterval(scrollIntervalRef.current);
                    scrollIntervalRef.current = null;
                    console.log("Interval cleared");
                }
            
                if (contentRef.current) {
                    contentRef.current.style.overflowY = 'hidden';
                    setTimeout(() => {
                        if (contentRef.current) {
                            contentRef.current.style.overflowY = 'auto';
                        }
                    }, 50);
                }
            } else {
                console.log("Starting scrolling");
                scrollIntervalRef.current = setInterval(() => {
                    if (contentRef.current) {
                        contentRef.current.scrollBy({
                            top: 1,
                            behavior: 'auto' 
                        });
                    }
                }, 50);
            }
            return !prevScrolling;
        });
    };

    
    const handleQuit = () => {
        socket.emit('adminQuit');
        navigate('/'); 
    };

    return (
        <div className="live-page">
            {songDetails && (
                <div className="button-container">
                    <button onClick={toggleScrolling} className="button">
                        {scrolling ? 'Stop Scrolling' : 'Start Scrolling'}
                    </button>
                    {userRole === 'admin' && (
                        <button 
                            onClick={handleQuit} 
                            className="button quit-button" 
                            style={{ backgroundColor: 'red', color: 'white' }}>
                            Quit
                        </button>
                    )}
                </div>
            )}
    
            {songDetails ? (
                <>
                    <div className="song-details">
                        <h1>{songDetails.title}</h1>
                        <h2>{songDetails.artist}</h2>
                    </div>
                    <div 
                        className="song-content" 
                        ref={contentRef}
                        style={{ 
                            height: '70vh', 
                            overflowY: 'auto',
                            padding: '20px',
                            boxSizing: 'border-box'
                        }}
                    >
                        {renderContent()}
                    </div>
                    {scrolling && <div className="scrolling-indicator">Scrolling...</div>}
                </>
            ) : (
                <p>Loading song details...</p>
            )}
        </div>
    );
};

export default LivePage;
