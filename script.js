const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const canvasSize = 400;
let score = 0;

let snake = [{ x: 160, y: 160 }];
let direction = 'RIGHT';
let food = spawnFood();
let gameInterval;

document.addEventListener('keydown', changeDirection);

function gameLoop() {
    updateSnakePosition();
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert("Game Over! Sua pontuação foi: " + score);
        return;
    }
    if (eatFood()) {
        score += 10;
        document.getElementById("score").textContent = score;
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
    
    // Desenha a comida
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

// Inicia o jogo
gameInterval = setInterval(gameLoop, 100);
