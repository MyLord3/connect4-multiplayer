let board = [];
let currentPlayer = "red";

function createBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    for (let r = 0; r < 6; r++) {
        board[r] = [];
        for (let c = 0; c < 7; c++) {
            board[r][c] = "";
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.onclick = () => placePiece(c);
            boardDiv.appendChild(cell);
        }
    }
}

function placePiece(col) {
    for (let r = 5; r >= 0; r--) {
        if (board[r][col] === "") {
            board[r][col] = currentPlayer;
            updateBoard();
            currentPlayer = currentPlayer === "red" ? "yellow" : "red";
            break;
        }
    }
}

function updateBoard() {
    const cells = document.getElementsByClassName("cell");
    let i = 0;
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            cells[i].className = "cell " + board[r][c];
            i++;
        }
    }
}

createBoard();
