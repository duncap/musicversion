const canvas = document.getElementById('raycaster');
const ctx = canvas.getContext('2d');
const screenWidth = canvas.width = window.innerWidth;
const screenHeight = canvas.height = window.innerHeight;
const fov = Math.PI / 3; // Wider field of view angle

const worldMap = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
];

const player = {
    x: 2.5, // Initial X position (make sure it's not inside a wall)
    y: 2.5, // Initial Y position (make sure it's not inside a wall)
    angle: Math.PI / 4,
    verticalAngle: 0, // Initialize vertical look angle
    moveSpeed: 0.1,
    rotateSpeed: 0.05
};

let previousTimestamp = 0;
let mouseSensitivity = 0.1; // Adjust this value to control sensitivity

// Mouse-look handling
let isMouseLocked = false;
canvas.requestPointerLock =
    canvas.requestPointerLock ||
    canvas.mozRequestPointerLock ||
    canvas.webkitRequestPointerLock;
canvas.onclick = () => {
    if (!isMouseLocked) {
        canvas.requestPointerLock();
    }
};

document.addEventListener('pointerlockchange', () => {
    isMouseLocked = document.pointerLockElement === canvas;
});

canvas.addEventListener('mousemove', (e) => {
    if (isMouseLocked) {
        // Adjust the player's horizontal angle based on mouse movement with sensitivity scaling
        player.angle += e.movementX * player.rotateSpeed * mouseSensitivity;

        // Adjust the vertical look angle based on mouse movement (limited to a range)
        player.verticalAngle -= e.movementY * player.rotateSpeed * mouseSensitivity;

        // Limit the vertical look angle to a certain range (e.g., -Math.PI/2 to Math.PI/2)
        player.verticalAngle = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, player.verticalAngle));
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        movePlayer(player.angle, player.moveSpeed);
    } else if (e.key === 's') {
        movePlayer(player.angle + Math.PI, player.moveSpeed);
    } else if (e.key === 'a') {
        movePlayer(player.angle - Math.PI / 2, player.moveSpeed);
    } else if (e.key === 'd') {
        movePlayer(player.angle + Math.PI / 2, player.moveSpeed);
    }
});

function movePlayer(angle, distance) {
    const newX = player.x + Math.cos(angle) * distance;
    const newY = player.y + Math.sin(angle) * distance;
    if (isCollision(newX, newY)) {
        return;
    }
    player.x = newX;
    player.y = newY;
}

function isCollision(x, y) {
    const gridX = Math.floor(x);
    const gridY = Math.floor(y);
    return worldMap[gridY][gridX] === 1;
}

function castRays(timestamp) {
    const elapsed = timestamp - previousTimestamp;
    previousTimestamp = timestamp;
    const moveDistance = player.moveSpeed * elapsed;

    ctx.clearRect(0, 0, screenWidth, screenHeight);

    for (let x = 0; x < screenWidth; x++) {
        const verticalOffset = (screenHeight / 2) * player.verticalAngle / fov; // Vertical offset
        const rayAngle = (player.angle - fov / 2) + (x / screenWidth) * fov;
        const ray = castRay(player.x, player.y, rayAngle);
        renderWall(x, ray, verticalOffset); // Pass the vertical offset to the rendering function
    }

    requestAnimationFrame(castRays);
}

function castRay(x, y, angle) {
    let rayX = x;
    let rayY = y;

    while (true) {
        rayX += Math.cos(angle) * 0.01; // Step forward in the ray's direction
        rayY += Math.sin(angle) * 0.01;

        const gridX = Math.floor(rayX);
        const gridY = Math.floor(rayY);

        if (worldMap[gridY][gridX] === 1) {
            const distance = Math.sqrt((rayX - x) ** 2 + (rayY - y) ** 2);
            return { distance, hitWall: true, wallType: 1 }; // Solid color wall
        }
    }
}

function renderWall(screenX, ray, verticalOffset) {
    const wallHeight = screenHeight / ray.distance;
    const wallTop = (screenHeight - wallHeight) / 2 + verticalOffset; // Adjust the top position
    ctx.fillStyle = 'gray'; // Color for solid color walls (you can change this)
    ctx.fillRect(screenX, wallTop, 1, wallHeight);
}


function update() {
    // Implement game logic here
}

function gameLoop(timestamp) {
    update();
    castRays(timestamp);
}

gameLoop();
