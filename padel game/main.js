const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");
const overlay = document.getElementById("overlay");
const livesDiv = document.getElementById("lives");

let ballRadius = 8;
let ballX, ballY, ballSpeedX, ballSpeedY;

let paddleHeight = 10;
let paddleWidth = 80;
let paddleX;

let rightPressed = false;
let leftPressed = false;

let score = 0;
let lives = 3;
let gameInterval;
let gameRunning = false;

// Blocks
const blockRowCount = 5;
const blockColumnCount = 7;
const blockWidth = 50;
const blockHeight = 20;
const blockPadding = 10;
const blockOffsetTop = 30;
const blockOffsetLeft = 35;
let blocks = [];

// --- Lives (❤️) ---
function updateLives() {
  const livesDiv = document.getElementById("lives");

  // لو أول مرة نبدأ اللعبة، نرسم القلوب كلها
  if (livesDiv.children.length === 0) {
    for (let i = 0; i < lives; i++) {
      const heart = document.createElement("span");
      heart.textContent = "❤️";
      livesDiv.appendChild(heart);
    }
  } else {
    // لو خسر حياة
    const hearts = livesDiv.querySelectorAll("span");
    if (hearts[lives]) {
      hearts[lives].classList.add("heart-lost"); 
      setTimeout(() => {
        hearts[lives].style.visibility = "hidden"; 
      }, 700);
    }
  }
}


// --- Reset ball & paddle ---
function resetBallAndPaddle() {
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  ballSpeedX = 3;
  ballSpeedY = -3;
  paddleX = (canvas.width - paddleWidth) / 2;
}

// --- Start Game ---
function startGame() {
  score = 0;
  lives = 3;
  updateLives();
  createBlocks();
  resetBallAndPaddle();
  message.textContent = "";
  overlay.style.display = "none";
  restartBtn.style.display = "none"; // مخفي في الأول
  gameRunning = true;
  clearInterval(gameInterval);
  gameInterval = setInterval(draw, 16);
}

// --- Restart Game ---
function restartGame() {
  startGame();
}

// --- Game Over ---
function gameOver() {
  gameRunning = false;
  clearInterval(gameInterval);
  message.textContent = "Game Over! | Score: " + score;
  startBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  overlay.style.display = "flex";
}

// --- You Win ---
function youWin() {
  gameRunning = false;
  clearInterval(gameInterval);
  message.textContent = "🎉 You Win! | Score: " + score;
  restartBtn.style.display = "inline-block";
  overlay.style.display = "flex";
}

// --- Create Blocks ---
function createBlocks() {
  blocks = [];
  for (let c = 0; c < blockColumnCount; c++) {
    blocks[c] = [];
    for (let r = 0; r < blockRowCount; r++) {
      blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

// --- Draw Blocks ---
function drawBlocks() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      if (blocks[c][r].status == 1) {
        let blockX = c * (blockWidth + blockPadding) + blockOffsetLeft;
        let blockY = r * (blockHeight + blockPadding) + blockOffsetTop;
        blocks[c][r].x = blockX;
        blocks[c][r].y = blockY;
        ctx.beginPath();
        ctx.rect(blockX, blockY, blockWidth, blockHeight);
        ctx.fillStyle = "#ffeb3b";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// --- Collision Detection ---
function collisionDetection() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      let b = blocks[c][r];
      if (b.status == 1) {
        if (
          ballX > b.x &&
          ballX < b.x + blockWidth &&
          ballY > b.y &&
          ballY < b.y + blockHeight
        ) {
          ballSpeedY = -ballSpeedY;
          b.status = 0;
          score++;
          if (score === blockRowCount * blockColumnCount) {
            youWin();
          }
        }
      }
    }
  }
}

// --- Draw Ball ---
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00e5ff";
  ctx.fill();
  ctx.closePath();
}

// --- Draw Paddle ---
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
  ctx.fillStyle = "#4caf50";
  ctx.fill();
  ctx.closePath();
}

// --- Draw Score ---
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 8, 20);
}

// --- Draw Everything ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBlocks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  // Bounce off walls
  if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY + ballSpeedY < ballRadius) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY + ballSpeedY > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballSpeedY = -ballSpeedY;
    } else {
      lives--;
      updateLives();
      if (lives > 0) {
        resetBallAndPaddle();
      } else {
        gameOver();
      }
    }
  }

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Move paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 8;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 8;
  }
}

// --- Key Handlers ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
});

// --- Button Events ---
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
