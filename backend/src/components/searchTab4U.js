import axios from 'axios';
import * as cheerio from 'cheerio';

export async function searchTab4U(query) {
    try {
        const response = await axios.get(
            `https://www.tab4u.com/resultsSimple?tab=songs&q=${encodeURIComponent(query)}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            }
        );

        const $ = cheerio.load(response.data);

        // Extract song information from the search results
        const results = $('.recUpUnit.ruSongUnit')
            .map((_, songElement) => {
                const linkElement = $(songElement).find('a.ruSongLink');
                const songNameElement = $(songElement).find('.sNameI19'); 
                const artistNameElement = $(songElement).find('.aNameI19'); 

                if (linkElement.length && songNameElement.length && artistNameElement.length) {
                    const partialUrl = linkElement.attr('href');
                    const fullUrl = partialUrl.startsWith('http') ? partialUrl : `https://www.tab4u.com/${partialUrl}`;

                    return {
                        songName: songNameElement.text().trim().replace(' /', '') || '', 
                        artistName: artistNameElement.text().trim() || '', 
                        url: fullUrl, 
                    };
                }
                return null;
            })
            .get() // Convert the cheerio object to a regular array
            .filter(item => item !== null); 

        return results; 
    } catch (error) {
        console.error('Error in searchTab4U:', error); 
        return [];
    }
}
