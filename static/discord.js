let presenceSocket = null;

function connectPresenceWS() {
    const userId = "277565639793704961";
    
    const wsUrl = `wss://api.ransore.com/discord/${userId}`;

    console.log(`[WS] Connecting to presence stream for user: ${userId}`);
    presenceSocket = new WebSocket(wsUrl);

    presenceSocket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            
            if (data.error) {
                console.error("[WS] Server sent an error:", data.error);
                return;
            }

            updateUI(data);
        } catch (err) {
            console.error("[WS] Error parsing data packet:", err);
        }
    };

    presenceSocket.onclose = (event) => {
        console.log(`[WS] Connection closed (Code: ${event.code}). Attempting retry in 5 seconds...`);
        presenceSocket = null;
        
        setTimeout(connectPresenceWS, 2000);
    };

    presenceSocket.onerror = (error) => {
        console.error("[WS] Connection mistake or network issue encountered:", error);
    };
}

function updateUI(data) {
    const statusEmojis = { online: "🟢", idle: "🌙", dnd: "🔴", offline: "⚫" };
    const statusColors = {
        online: "#43b581",
        idle: "#faa61a",
        dnd: "#f04747",
        offline: "transparent"
    };
	
    document.getElementById('discord-name').innerText = data.data.discord_user.global_name;
    document.getElementById('status').innerHTML = `${statusEmojis[data.data.status] || "⚫"}`;
    document.getElementById('about-me').innerText = data.data.discord_user.bio || "";
	
    const list = document.getElementById('activities-list');
    list.innerHTML = "";

    const platformContainer = document.getElementById('platform-icon');
    platformContainer.innerHTML = "";

    const addIcon = (platformName, svgPath) => {
        const status = data.data.platform[platformName];
        if (status && status !== "offline") {
            const iconColor = statusColors[status] || "#b9bbbe";
            const span = document.createElement('span');
            span.innerHTML = `
                <svg fill="${iconColor}" viewBox="0 0 24 24" style="width:18px; height:18px; vertical-align: middle;">
                    <path d="${svgPath}"></path>
                </svg>`;
            platformContainer.appendChild(span);
        }
    };

    const paths = {
        desktop: "M4 2.5c-1.103 0-2 .897-2 2v11c0 1.104.897 2 2 2h7v2H7v2h10v-2h-4v-2h7c1.103 0 2-.896 2-2v-11c0-1.103-.897-2-2-2H4Zm16 2v9H4v-9h16Z",
        mobile: "M17 2H7c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2ZM7 4h10v12H7V4Zm5 16c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1Z",
        web: "M 187 0 L 813 0 C 916.277 0 1000 83.723 1000 187 L 1000 1313 C 1000 1416.277 916.277 1500 813 1500 L 187 1500 C 83.723 1500 0 1416.277 0 1313 L 0 187 C 0 83.723 83.723 0 187 0 Z M 125 1000 L 875 1000 L 875 250 L 125 250 Z M 500 1125 C 430.964 1125 375 1180.964 375 1250 C 375 1319.036 430.964 1375 500 1375 C 569.036 1375 625 1319.036 625 1250 C 625 1180.964 569.036 1125 500 1125 Z",
    };

    addIcon('desktop', paths.desktop);
    addIcon('mobile', paths.mobile);
    addIcon('web', paths.web);

    data.data.activities.forEach(act => {
        const div = document.createElement('div');
        div.className = "activity";
		
        if (act.assets && act.assets.large_image) {
            const assetContainer = document.createElement('div');
            assetContainer.className = "activity-assets";

            const largeImg = document.createElement('img');
            largeImg.src = act.assets.large_image;
            largeImg.className = "activity-large-img";
            assetContainer.appendChild(largeImg);

            if (act.assets.small_image) {
                const smallImg = document.createElement('img');
                smallImg.src = act.assets.small_image;
                smallImg.className = "activity-small-img";
                assetContainer.appendChild(smallImg);
            }
            div.appendChild(assetContainer);
        }

        const textContainer = document.createElement('div');
        textContainer.className = "activity-content";

        const nameEl = document.createElement('strong');
        nameEl.innerText = act.name;
        textContainer.appendChild(nameEl);

        const infoLine = document.createElement('div');
        infoLine.className = "activity-details";
        if (act.details && act.state) {
            infoLine.innerText = `${act.details}\n${act.state}`;
        } else {
            infoLine.innerText = act.details || act.state || "";
        }

        if (infoLine.innerText) {
            textContainer.appendChild(infoLine);
        }

        div.appendChild(textContainer);
        list.appendChild(div);
    });
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', connectPresenceWS);
} else {
    connectPresenceWS();
}