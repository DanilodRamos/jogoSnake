const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const canvasSize = 400;
let score = 0;
let speed = 80; // Velocidade inicial
let gameInterval;

let snake = [{ x: 160, y: 160 }];
let direction = 'RIGHT';
let food = spawnFood();

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.addEventListener('keydown', changeDirection);

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
    gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
    updateSnakePosition();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (eatFood()) {
        score += 10;
        document.getElementById("score").textContent = score;
        
        // Aumenta a velocidade a cada 50 pontos
        if (score % 50 === 0 && speed > 50) {
            speed -= 10;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
        }
        
        food = spawnFood();
    }
    drawGame();
}

function updateSnakePosition() {
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'UP': head.y -= gridSize; break;
        case 'DOWN': head.y += gridSize; break;
        case 'LEFT': head.x -= gridSize; break;
        case 'RIGHT': head.x += gridSize; break;
    }

    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    const head = snake[0];
    
    // Colisão com a parede
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }
    
    // Colisão com o corpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function eatFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        snake.push({ x: food.x, y: food.y });
        return true;
    }
    return false;
}

function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // Desenha a cobrinha
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'lime' : 'green'; // A cabeça é verde claro
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
    
    // Desenha a comida com animação
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function spawnFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'DOWN') direction = 'UP'; break;
        case 'ArrowDown': if (direction !== 'UP') direction = 'DOWN'; break;
        case 'ArrowLeft': if (direction !== 'RIGHT') direction = 'LEFT'; break;
        case 'ArrowRight': if (direction !== 'LEFT') direction = 'RIGHT'; break;
    }
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').style.display = 'block';
    document.querySelector('.game-container').style.display = 'none';
}

function restartGame() {
    score = 0;
    speed = 100;
    snake = [{ x: 160, y: 160 }];
    direction = 'RIGHT';
    food = spawnFood();
    document.getElementById("score").textContent = score;
    document.getElementById('gameOverScreen').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
    gameInterval = setInterval(gameLoop, speed);
}
