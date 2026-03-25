async function connectWallet() {
    try {
        const client = await window.Sphere.connect();
        document.getElementById("playerName").innerText =
            "Connected: " + client.nametag;
    } catch (e) {
        console.log(e);
        alert("Wallet connection failed");
    }
}
