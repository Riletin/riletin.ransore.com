async function fetchPresence() {
    try {
        const response = await fetch(`https://presence.ransore.com/277565639793704961`);
        const data = await response.json();
        if (data) updateUI(data);
    } catch (err) {
        console.error("Error API:", err);
    }
}

function updateUI(data) {
    const statusEmojis = { online: "🟢", idle: "🌙", dnd: "🔴", offline: "⚫" };

    document.getElementById('discord-name').innerText = data.data.discord_user.global_name;
    document.getElementById('status').innerHTML = `${statusEmojis[data.data.status] || "⚫"}`;
	document.getElementById('about-me').innerText = data.data.discord_user.bio;

	const list = document.getElementById('activities-list');
    list.innerHTML = "";

	const platformContainer = document.getElementById('platform-icon');
    platformContainer.innerHTML = "";

    if (data.data.platform.desktop) {
        const desktopSvg = document.createElement('span');
        desktopSvg.innerHTML = `
            <svg fill="#FF0000" viewBox="0 0 24 24" style="width:20px; height:20px;">
                <path d="M4 2.5c-1.103 0-2 .897-2 2v11c0 1.104.897 2 2 2h7v2H7v2h10v-2h-4v-2h7c1.103 0 2-.896 2-2v-11c0-1.103-.897-2-2-2H4Zm16 2v9H4v-9h16Z"></path>
            </svg>`;
        platformContainer.appendChild(desktopSvg);
    }
	
	if (data.data.platform.mobile) {
    const mobileSvg = document.createElement('span');
    mobileSvg.innerHTML = `
        <svg fill="#FF0000" viewBox="0 0 24 24" style="width:20px; height:20px;">
            <path d="M17 2H7c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2ZM7 4h10v12H7V4Zm5 16c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1Z"></path>
        </svg>`;
    platformContainer.appendChild(mobileSvg);
	}

	if (data.data.platform.web) {
		const webSvg = document.createElement('span');
		webSvg.innerHTML = `
			<svg fill="#FF0000" viewBox="0 0 24 24" style="width:20px; height:20px;">
				<path d="M 187 0 L 813 0 C 916.277 0 1000 83.723 1000 187 L 1000 1313 C 1000 1416.277 916.277 1500 813 1500 L 187 1500 C 83.723 1500 0 1416.277 0 1313 L 0 187 C 0 83.723 83.723 0 187 0 Z M 125 1000 L 875 1000 L 875 250 L 125 250 Z M 500 1125 C 430.964 1125 375 1180.964 375 1250 C 375 1319.036 430.964 1375 500 1375 C 569.036 1375 625 1319.036 625 1250 C 625 1180.964 569.036 1125 500 1125 Z"></path>
			</svg>`;
		platformContainer.appendChild(webSvg);
	}

    data.data.activities.forEach(act => {
        const div = document.createElement('div');
        div.className = "activity";

        const nameEl = document.createElement('strong');
        nameEl.innerText = act.name;
        div.appendChild(nameEl);
        div.appendChild(document.createElement('br'));

		const infoLine = document.createElement('div'); // Changed to div for better block control
		infoLine.className = "activity-details";
        // Only add the dot if BOTH details and state exist
        if (act.details && act.state) {
            infoLine.innerText = `${act.details}\n${act.state}`;
        } else {
            infoLine.innerText = act.details || act.state || "";
        }

        if (infoLine.innerText) {
            div.appendChild(infoLine);
        }
        list.appendChild(div);
    });
}



window.addEventListener('DOMContentLoaded', () => {
    fetchPresence();
    setInterval(fetchPresence, 1000);
});