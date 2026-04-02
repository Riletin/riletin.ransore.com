document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("enterOverlay");
    const audio = document.getElementById("bgAudio");
    const progressFill = document.querySelector(".ytm-player__progress-fill");
	const progress = document.querySelector(".ytm-player__progress");

	if (progress) {
		progress.addEventListener("click", (e) => {
			if (audio.duration) {
				const containerWidth = progress.offsetWidth;
				const clickX = e.offsetX;
				const clickPercent = clickX / containerWidth;
				audio.currentTime - clickPercent * audio.duration;
			}
		});
	}

    if (!overlay || !audio) {
        console.error("Required elements (overlay or audio) not found in DOM.");
        return;
    }

    const track = {
        title: "My Mother Wants Me Dead",
        artist: "ily",
        thumb: "static/cover.jpg"
    };

    function setNowPlaying() {
        if (document.getElementById("ytm-player__title")) document.getElementById("ytmTitle").innerText = track.title;
        if (document.getElementById("ytm-player__artist")) document.getElementById("ytmArtist").innerText = track.artist;
        if (document.getElementById("ytm-player__thumb")) document.getElementById("ytmThumb").src = track.thumb;
    }

    overlay.addEventListener("click", () => {
        audio.currentTime = 0; 
        
        audio.play().then(() => {
            audio.volume = 0;
            setNowPlaying();

            let vol = 0;
            const maxVol = 0.03;
            const fadeStep = 0.01;
            
            const fade = setInterval(() => {
                vol += fadeStep;
                audio.volume = Math.min(vol, maxVol);

                if (vol >= maxVol) {
                    clearInterval(fade);
                }
            }, 1000);
        }).catch((err) => {
            console.error("Playback failed:", err);
        });

        overlay.style.transition = "opacity 1.5s";
        overlay.style.opacity = "0";

        setTimeout(() => {
            overlay.style.display = "none";
        }, 1);
    });

    audio.addEventListener("timeupdate", () => {
        if (audio.duration && progressFill) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + "%";
        }
    });
});