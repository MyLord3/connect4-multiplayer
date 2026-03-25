async function connectWallet() {
    try {
        const sphere = new Sphere();
        const user = await sphere.connect();

        document.getElementById("playerName").innerText =
            "Connected: " + user.nametag;
    } catch (err) {
        console.log(err);
        alert("Wallet connection failed");
    }
}
