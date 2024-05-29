var ctx, canvas;
function init() {
    canvas = document.getElementById("canvas");
    canvas.width = 500;
    canvas.height = 500;

    ctx = canvas.getContext('2d');
}

let img = new Image();
img.src = '../img/PC Computer - Hotline Miami 2 Wrong Number - Police.png';
img.onload = function () {
    window.requestAnimationFrame(gameLoop);
};

const SCALE = 2;
const WIDTH = 56;
const HEIGHT = 58;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
        canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
}
const CYCLE_LOOP = [0, 1, 0, 2];
let currentLoopIndex = 0;
let frameCount = 0;
let currentDirection = 0;

let keyPresses = {};
window.addEventListener('keydown', keyDownListener, false);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}
window.addEventListener('keyup', keyUpListener, false);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

const MOVEMENT_SPEED = 3;
let positionX = 0;
let positionY = 0;
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (keyPresses.w && keyPresses.s) {
        positionY -= 0;
    } else if (keyPresses.w) {
        positionY -= MOVEMENT_SPEED;
        //currentDirection = FACING_UP;
    } else if (keyPresses.s) {
        positionY += MOVEMENT_SPEED;
        //currentDirection = FACING_DOWN;
    }
    if (keyPresses.a && keyPresses.d) {
        positionX -= 0;
    } else if (keyPresses.a) {
        positionX -= MOVEMENT_SPEED;
        //currentDirection = FACING_LEFT;
    } else if (keyPresses.d) {
        positionX += MOVEMENT_SPEED;
        //currentDirection = FACING_RIGHT;
    }
    drawFrame(0, currentDirection, positionX, positionY);
    window.requestAnimationFrame(gameLoop);
}