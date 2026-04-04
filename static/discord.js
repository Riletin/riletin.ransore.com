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

    document.getElementById('discord-avatar').src = data.data.discord_user.avatar;
    document.getElementById('discord-name').innerText = data.data.discord_user.global_name;
    document.getElementById('status').innerHTML = `${statusEmojis[data.data.status] || "⚫"}`;

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
				<path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2Zm7.931 9h-2.764a14.67 14.67 0 0 0-1.792-6.243A8.013 8.013 0 0 1 19.931 11ZM12.53 4.07c1.514 1.161 2.635 3.701 3.098 6.93h-6.256c.463-3.229 1.584-5.769 3.098-6.93ZM9.992 4.757C8.966 6.509 8.263 8.63 7.969 11H4.069a8.013 8.013 0 0 1 5.923-6.243Zm-5.923 8h3.9a14.67 14.67 0 0 0 1.792 6.243A8.013 8.013 0 0 1 4.069 12.757Zm7.461 7.173c-1.514-1.161-2.635-3.701-3.098-6.93h6.256c-.463 3.229-1.584 5.769-3.098 6.93Zm3.478-.93c1.026-1.752 1.729-3.873 2.023-6.243h3.9a8.013 8.013 0 0 1-5.923 6.243Z"></path>
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
            infoLine.innerText = `${act.details} • ${act.state}`;
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