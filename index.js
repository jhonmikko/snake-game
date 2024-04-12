// Selecting necessary elements from the HTML DOM
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

// Initializing game variables
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Retrieving high score from local storage or setting it to 0 if not available
let highScore = localStorage.getItem("high-score") || 0;
// Displaying high score in the UI
highScoreElement.innerText = `High Score: ${highScore}`;

// Function to update the position of food randomly on the board
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Function to handle game over scenario
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay.");
    location.reload();
}

// Function to change snake direction based on keyboard input
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Event listener for directional controls
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key})));

// Function to initialize the game
const initGame = () => {
    if (gameOver) return handleGameOver(); // Check if the game is over
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`; // Initialize HTML string with food position
    
    // Check if snake has eaten the food
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition(); // Update food position
        snakeBody.push([foodX, foodY]); // Add food to snake body
        score++; // Increase score
        highScore = score >= highScore ? score: highScore; // Update high score

        localStorage.setItem("high-score", highScore); // Store high score in local storage
        scoreElement.innerText = `Score: ${score}`; // Update score in UI
        highScoreElement.innerText = `High Score: ${highScore}`; // Update high score in UI
    }

    // Move snake
    snakeX += velocityX;
    snakeY += velocityY;

    // Update snake body positions
    for (let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // Update snake head position

    // Check for collisions with walls or itself
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    // Update HTML string with snake body
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true; // Game over if snake collides with itself
        }
    }
    playBoard.innerHTML = html; // Update the play board with new HTML
}

updateFoodPosition(); // Initialize food position
setIntervalId = setInterval(initGame, 100); // Start the game loop
document.addEventListener("keyup", changeDirection); // Event listener for keyboard input
