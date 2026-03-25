let roomId = "";

function createRoom() {
    roomId = Math.random().toString(36).substring(2, 7);
    alert("Room ID: " + roomId);
}

function joinRoom() {
    roomId = document.getElementById("roomInput").value;
    alert("Joined Room: " + roomId);
}
