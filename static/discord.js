async function fetchLanyard() {
    try {
        const response = await fetch('https://api.lanyard.rest/v1/users/277565639793704961');
        const json = await response.json();
        const data = json.data;
        
        console.log("Lanyard Data:", data);

        const statusEmojiEl = document.getElementById('status-emoji');
        const emojis = { online: "🟢", idle: "🌙", dnd: "🔴", offline: "⚫" };
        statusEmojiEl.innerText = emojis[data.discord_status] || "⚫";

        const list = document.getElementById('activities-list');
        list.innerHTML = "";

        let hasActivity = false;

        if (data.listening_to_spotify) {
            hasActivity = true;
            const li = document.createElement('li');
            li.innerText = `Listening to ${data.spotify.song}`;
            list.appendChild(li);
        }

        if (data.activities && data.activities.length > 0) {
            data.activities.forEach(act => {
                if (act.type === 2) return;
                
                hasActivity = true;
                const li = document.createElement('li');
                
                if (act.type === 4) {
                    const emoji = act.emoji ? act.emoji.name : "";
                    const state = act.state || "";
                    li.innerText = `${emoji} ${state}`;
                } else {
                    // Games/Apps
                    li.innerText = `Playing: ${act.name}`;
                }
                list.appendChild(li);
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