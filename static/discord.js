async function fetchLanyard() {
    try {
        const response = await fetch('https://api.lanyard.rest/v1/users/277565639793704961');
        const json = await response.json();
        const data = json.data;
        
        console.log("Lanyard Data:", data);

        const statusEmojiEl = document.getElementById('status-emoji');
        const emojis = {
            online: "🟢 Online",
            idle: "🌙 Idle/AFK",
            dnd: "🔴",
            offline: "⚫ Offline"
        };
        statusEmojiEl.innerText = emojis[data.discord_status] || "";

        const list = document.getElementById('activities-list');
        list.innerHTML = "";

        let hasActivity = false;

        if (data.activities && data.activities.length > 0) {
            data.activities.forEach(act => {
                let prefix = "";

                switch (act.type) {
                    case 0: prefix = "Playing"; break;
                    case 1: prefix = "Streaming"; break;
                    case 2: prefix = "Listening to"; break;
                    case 3: prefix = "Watching"; break;
                    case 5: prefix = "Competing in"; break;

                    case 4:
                        const li = document.createElement('li');
                        li.innerText = `— ${act.emoji} `;
                        list.appendChild(li);
                        hasActivity = true;
                        return;
                }

                 if (prefix) {
					const li = document.createElement('li');
					li.classList.add("activity");

					const title = document.createElement('div');
					title.classList.add("activity-title");
					title.innerText = `${prefix} ${act.name}`;

					const details = document.createElement('div');
					details.classList.add("activity-details");

					const detailText = act.details || "";
					const stateText = act.state || "";

					details.innerText = `${detailText} • ${stateText}`;

					li.appendChild(title);
					li.appendChild(details);

					list.appendChild(li);
					hasActivity = true;
    			}
            });
        }

        if (!hasActivity) {
            const li = document.createElement('li');
            li.innerText = "";
            list.appendChild(li);
        }

    } catch (error) {
        console.error("Script Error:", error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    fetchLanyard();
});