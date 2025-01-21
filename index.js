let board = ["", "", "", "", "", "", "", "", ""];
let playerSymbol = "X";
let aiSymbol = "O";
let currentPlayer = "X";
let gameActive = true;

let playerScore = 0;
let aiScore = 0;

let difficulty = 1;

const cells = document.querySelectorAll(".cell");
const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");
const resetBtn = document.getElementById("resetBtn");
const newGameBtn = document.getElementById("newGameBtn");
const difficultyRange = document.getElementById("difficultyRange");
const difficultyValue = document.getElementById("difficultyValue");
const symbolSelect = document.getElementById("symbolSelect");

cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
});

resetBtn.addEventListener("click", () => {
    playButtonAnimation(resetBtn);
    resetBoard();
});

newGameBtn.addEventListener("click", () => {
    playButtonAnimation(newGameBtn);
    resetScoresAndBoard();
});

difficultyRange.addEventListener("input", () => {
    updateDifficulty();
    difficultyRange.style.transform = "scale(1.2)";
    setTimeout(() => {
        difficultyRange.style.transform = "scale(1)";
    }, 200);
});

symbolSelect.addEventListener("change", () => {
    playButtonAnimation(symbolSelect);
    playerSymbol = symbolSelect.value;
    aiSymbol = playerSymbol === "X" ? "O" : "X";
    resetBoard();
});

updateDifficulty();
updateScores();
aiSymbol = playerSymbol === "X" ? "O" : "X";

function handleCellClick(e) {
    const cellIndex = e.target.getAttribute("data-index");

    if (!gameActive || board[cellIndex] !== "") return;

    if (currentPlayer === playerSymbol) {
        updateCell(cellIndex, playerSymbol);

        if (checkWin(playerSymbol)) {
            highlightWin(playerSymbol);
            playerScore++;
            updateScores();
            gameActive = false;
            return;
        } else if (checkDraw()) {
            gameActive = false;
            return;
        }

        currentPlayer = aiSymbol;
        setTimeout(() => aiMove(), 400);
    }
}

function aiMove() {
    if (!gameActive) return;

    let cellIndex;
    switch (difficulty) {
        case 1:
            cellIndex = getRandomMove();
            break;
        case 2:
            cellIndex = Math.random() < 0.5 ? getRandomMove() : getBestMove();
            break;
        case 3:
        default:
            cellIndex = getBestMove();
            break;
    }

    updateCell(cellIndex, aiSymbol);

    if (checkWin(aiSymbol)) {
        highlightWin(aiSymbol);
        aiScore++;
        updateScores();
        gameActive = false;
    } else if (checkDraw()) {
        gameActive = false;
    } else {
        currentPlayer = playerSymbol;
    }
}

function updateCell(index, symbol) {
    board[index] = symbol;
    cells[index].textContent = symbol;
    cells[index].style.transform = "scale(1.3)";
    setTimeout(() => {
        cells[index].style.transform = "scale(1)";
    }, 150);
}

function checkWin(symbol) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return winPatterns.some((pattern) =>
        pattern.every((idx) => board[idx] === symbol)
    );
}

function highlightWin(symbol) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    winPatterns.forEach((pattern) => {
        if (pattern.every((idx) => board[idx] === symbol)) {
            pattern.forEach((idx) => {
                cells[idx].classList.add("win");
            });
        }
    });
}

function checkDraw() {
    return board.every((c) => c !== "");
}

function getRandomMove() {
    const validMoves = board
        .map((val, idx) => (val === "" ? idx : null))
        .filter((val) => val !== null);

    return validMoves[Math.floor(Math.random() * validMoves.length)];
}

function getBestMove() {
    let bestVal = -Infinity;
    let move = null;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = aiSymbol;
            const moveVal = minimax(board, 0, false);
            board[i] = "";

            if (moveVal > bestVal) {
                bestVal = moveVal;
                move = i;
            }
        }
    }
    return move;
}

function minimax(tempBoard, depth, isMaximizing) {
    if (checkWin(aiSymbol)) return 10 - depth;
    if (checkWin(playerSymbol)) return depth - 10;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < tempBoard.length; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = aiSymbol;
                let score = minimax(tempBoard, depth + 1, false);
                tempBoard[i] = "";
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < tempBoard.length; i++) {
            if (tempBoard[i] === "") {
                tempBoard[i] = playerSymbol;
                let score = minimax(tempBoard, depth + 1, true);
                tempBoard[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("win");
        cell.style.transform = "scale(1)";
    });
    gameActive = true;
    currentPlayer = playerSymbol;
}

function resetScoresAndBoard() {
    resetBoard();
    playerScore = 0;
    aiScore = 0;
    updateScores();
}

function updateScores() {
    playerScoreEl.textContent = playerScore;
    aiScoreEl.textContent = aiScore;
}

function updateDifficulty() {
    difficulty = parseInt(difficultyRange.value);
    switch (difficulty) {
        case 1:
            difficultyValue.textContent = "Easy";
            break;
        case 2:
            difficultyValue.textContent = "Medium";
            break;
        case 3:
            difficultyValue.textContent = "Hard";
            break;
        default:
            difficultyValue.textContent = "Easy";
    }
}

function playButtonAnimation(element) {
    element.style.transform = "scale(0.9)";
    setTimeout(() => {
        element.style.transform = "scale(1)";
    }, 150);
}
