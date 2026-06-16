document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("enterOverlay");
    const audio = document.getElementById("bgAudio");
    const progressFill = document.querySelector(".ytm-player__progress-fill");
	const progress = document.querySelector(".ytm-player__progress");
	const volumeSlider = document.getElementById("volumeSlider");

	if (progress) {
		progress.addEventListener("click", (e) => {
			if (audio.duration) {
				const containerWidth = progress.offsetWidth;
				const clickX = e.offsetX;
				const clickPercent = clickX / containerWidth;
				audio.currentTime = clickPercent * audio.duration; 
			}
		});
	}

	if (volumeSlider) {
		volumeSlider.addEventListener("input", (e) => {
			audio.volume = e.target.value;
		});
	}

    if (!overlay || !audio) {
        console.error("Required elements (overlay or audio) not found in DOM.");
        return;
    }

    overlay.addEventListener("click", () => {
        audio.currentTime = 0; 
        
        audio.play().then(() => {
            audio.volume = 0;

            let vol = 0.001;
            const maxVol = 0.05;
            const fadeStep = 0.005;
            
            const fade = setInterval(() => {
                vol += fadeStep;
                audio.volume = Math.min(vol, maxVol);

                if (vol >= maxVol) {
                    clearInterval(fade);
                }
            }, 100);
        }).catch((err) => {
            console.error("Playback failed:", err);
        });

        overlay.style.transition = "opacity 0.5s";
        overlay.style.opacity = "0";

        setTimeout(() => {
            overlay.style.display = "none";
        }, 555);
    });

    audio.addEventListener("timeupdate", () => {
        if (audio.duration && progressFill) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + "%";
        }
    });
});