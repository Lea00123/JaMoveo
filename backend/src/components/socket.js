    import { Server } from 'socket.io';
    import { searchTab4U } from './searchTab4U.js'; 
    import scrapeSong from './scrapeSong.js';

    export const setupSocket = (server) => {
        const io = new Server(server, {
            cors: {
                origin: ["https://jamoveo-lea.netlify.app", "http://localhost:3000", "http://localhost:3001"], 
                methods: ["GET", "POST"], 
                credentials: true,
            },
        });

        io.on('connection', (socket) => {
            
            socket.on('searchSong', async (query) => {
                try {
                    const results = await searchTab4U(query);
                    socket.emit('searchResults', results);
                } catch (error) {
                    console.error('Error searching for songs:', error);
                    socket.emit('searchError', { message: 'Error retrieving song data. Please try again.' });
                }
            });

            socket.on('selectSong', (songData) => {
                io.emit('songSelected', songData);
            });

            socket.on('scrapeSong', async (url) => {
                try {
                    const songData = await scrapeSong(url); 
                    socket.emit('songDetails', songData); 
                } catch (error) {
                    console.error('Error scraping song details:', error);
                    socket.emit('scrapeError', { message: 'Error retrieving song details. Please try again.' });
                }
            });

            socket.on('adminQuit', () => {
                console.log('Admin has quit. Broadcasting to all clients.');
                io.emit('quit');
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });

        return io;
    };