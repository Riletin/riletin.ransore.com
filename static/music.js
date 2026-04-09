async function getMusicHistory() {
  const response = await fetch('https://api.ransore.com/riletin/music');
  const tracks = await response.json();

  const container = document.getElementById('song-history');
  container.innerHTML = ''; 
  
  const fallback = "static/fallback.png";

  tracks.forEach(track => {
    const trackElement = document.createElement('div');
    trackElement.className = 'track-item';

    const isWhiteBox = track.image && track.image.includes("2a96cbd8b46e442fc41c2b86b821562f");
    const isMissing = !track.image || track.image === "";
    
    const finalImage = (isWhiteBox || isMissing) ? fallback : track.image;
    
    trackElement.innerHTML = `
        <a href="${track.url}" target="_blank" rel="noopener noreferrer" class="track-link">
            <div class="image-container">
                <img 
                  src="${finalImage}" 
                  onerror="this.src='${fallback}'; this.onerror=null;" 
                  id="song-cover" 
                  alt="${track.album}" 
                  width="60" 
                  height="60"
                >
                ${track.nowPlaying ? '<span class="pulse-dot"></span>' : ''}
            </div>
            <div class="track-info">
                <span class="track-name">${track.title}</span>
                <span class="artist-name">${track.artist}</span>
            </div>
        </a>
    `;
    container.appendChild(trackElement);
  });
}

getMusicHistory();