import { SphereClient } from "https://cdn.jsdelivr.net/npm/@unicitylabs/sphere-sdk/+esm";

const client = new SphereClient();

window.onload = () => {
    document.getElementById("connectBtn").onclick = async () => {
        try {
            const identity = await client.connect();
            document.getElementById("playerName").innerText =
                "Connected: " + identity.nametag;
        } catch (e) {
            console.log(e);
            alert("Wallet connection failed");
        }
    };
};
