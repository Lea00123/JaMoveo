import axios from 'axios'; 
import * as cheerio from 'cheerio'; 

// Align the chords and lyrics
function processRow(chordRow, lyricRow) {
  const lyrics = lyricRow.trim().split(/\s+/);

  // Regular expressions to handle spaces
  const chordMatches = [...chordRow.matchAll(/(\s*)([^\s]+)/g)];

  let result = []; 
  let chordIndex = 0; 
  let lyricsPosition = 0;

  lyrics.forEach((word, wordIndex) => {
    let lineSegment = { lyrics: word }; 
    let chordForThisWord = "";

    // Get the chord for this word
    while (chordIndex < chordMatches.length) {
      const [, spaces, chord] = chordMatches[chordIndex]; 
      const chordPosition = chordRow.indexOf(spaces + chord, lyricsPosition); 

      // If the chord fits, associate it with the word
      if (chordPosition <= lyricsPosition + word.length) {
        chordForThisWord += spaces + chord; 
        chordIndex++; 
      } else {
        break; 
      }
    }

    if (chordForThisWord) {
      lineSegment.chords = chordForThisWord.trimStart(); 
    }

    // Handle any leftover chords at the end of the line
    else if (wordIndex === lyrics.length - 1 && chordIndex < chordMatches.length) {
      lineSegment.chords = chordMatches
        .slice(chordIndex) 
        .map(([, spaces, chord]) => spaces + chord) 
        .join(""); 
    }

    result.push(lineSegment);

    lyricsPosition += word.length + 1;
  });

  
  return result;
}


// Extracts and processes lyrics and chords
async function scrapeSong(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Locate the element that contains the song's chords and lyrics
    const songContentElement = $('#songContentTPL');
    if (songContentElement.length === 0) {
      throw new Error("Song content not found");
    }

    const rows = [];
    
    // Iterate over each row in the table to find chords and lyrics
    songContentElement.find('table tr').each((index, row) => {
      const $row = $(row);
      
      if ($row.find('.tabs').length) {
        return;
      }

      // Look for rows that contain chord data
      const chordRow = $row.find('.chords_en, .chords');
      if (chordRow.length) {
        const nextRow = $row.next();
        const lyricRow = nextRow.find('.song');

        if (lyricRow.length) {
          // Clean up non relevant chord row text
          const chordText = chordRow.html()
            .replace(/<span[^>]*>([^<]*)<\/span>/g, "$1") 
            .replace(/&nbsp;/g, " ");
          
          const lyricText = lyricRow.text() || "";
          rows.push([chordText, lyricText]);
        }
      }
    });

    const processedContentAfterScrape = rows.map(([chordRow, lyricRow]) =>
      processRow(chordRow, lyricRow)
    );

    const title = $('h1.artist').text().trim(); 
    const artist = $('h2.artist').text().trim(); 

    const song = {
      title: title || "Song Title", 
      artist: artist || "Song Artist", 
      content: processedContentAfterScrape,
    };

    return song;
  } catch (error) {
    console.error('Error in scrapeSong:', error);
    throw error;
  }
}

export default scrapeSong;
