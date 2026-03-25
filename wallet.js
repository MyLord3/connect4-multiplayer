async function connectWallet() {
    try {
        const wallet = await window.unicity.sphere.connect();
        document.getElementById("playerName").innerText =
            "Connected: " + wallet.nametag;
    } catch (e) {
        alert("Wallet connection failed");
    }
}
