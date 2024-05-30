const SCALE = 2;
const WIDTH = 50;
const HEIGHT = 45;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const MOVEMENT_SPEED = 5;
const FRAME_X = 314;
const FRAME_Y = 340;

let canvas;
let ctx;
let keyPresses = {};
let mousePresses = {};
let mouseX, mouseY;
let lockAnimation = false;
let pl;

class player {
    positionX = 0;
    positionY = 0;
    playerImageX = FRAME_X;
    playerImageY = FRAME_Y;

    attackAnimation(frameCount) {
        if (frameCount == 5) {
            playerImageY = 745;
            frameCount++;
            if (lockAnimation) {
                setTimeout(attackAnimation, 70, frameCount);
            }
        }
        if (frameCount > 5) {
            frameCount = 0;
            playerImageX = FRAME_X;
            playerImageY = FRAME_Y;
            lockAnimation = false;
            return;
        }
        playerImageX = 314;
        playerImageY = 699 + (45 * frameCount);

        frameCount++;
        if (lockAnimation) {
            setTimeout(attackAnimation, 70, frameCount);
        }

    }
}

function init() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener('mousemove', function (evt) {
        var rect = this.getBoundingClientRect();

        mouseX = evt.clientX - rect.left;
        mouseY = evt.clientY - rect.top;
        //console.log(mouseX + ", sss" + mouseY);

    }, false);

    pl = new player();

    ctx = canvas.getContext('2d');
}

let img = new Image();
window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}
window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

window.addEventListener('mousedown', mouseDownListener);
function mouseDownListener(event) {
    if (event.button == 0 && !lockAnimation) { //left mouse button
        console.log("hf,jnftn");
        lockAnimation = true;
        if (lockAnimation) {
            pl.attackAnimation(0);
        }

    }
    mousePresses[event.button] = true;
}
window.addEventListener('mouseup', mouseUpListener);
function mouseUpListener(event) {
    mousePresses[event.button] = false;
}

function loadImage() {
    img.src = '../img/PC Computer - Hotline Miami 2 Wrong Number - Police.png';
    img.onload = function () {
        window.requestAnimationFrame(gameLoop);
    };
}
function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX/* * WIDTH*/, frameY/* * HEIGHT*/, WIDTH, HEIGHT,
        canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
}

loadImage();

function gameLoop() {
    mX = mouseX - pl.positionX - WIDTH / 2.0;
    mY = mouseY - pl.positionY - HEIGHT / 2.0 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (keyPresses.w) {
        moveCharacter(0, -MOVEMENT_SPEED);
    } else if (keyPresses.s) {
        moveCharacter(0, MOVEMENT_SPEED);
    }
    if (keyPresses.a) {
        moveCharacter(-MOVEMENT_SPEED, 0);
    } else if (keyPresses.d) {
        moveCharacter(MOVEMENT_SPEED, 0);
    }

    ctx.save();
    ctx.fillRect(pl.positionX + WIDTH / 2.0, pl.positionY + HEIGHT / 2.0, 10, 10)
    //квадратик для центра

    ctx.translate(pl.positionX + WIDTH / 2.0, pl.positionY + HEIGHT / 2.0);
    ctx.translate(8, 8);
    var asin = Math.asin(mY / Math.sqrt(mY * mY + mX * mX));
    var acos = Math.acos(mX / Math.sqrt(mY * mY + mX * mX));
    var rotation = asin;

    if (acos > Math.PI / 2.) {
        rotation = -Math.PI - asin;
    }
    ctx.rotate(rotation);
    ctx.translate(-8, -8);
    drawFrame(pl.playerImageX, pl.playerImageY, -30, -35);
    ctx.translate(0, 0);
    ctx.restore();
    window.requestAnimationFrame(gameLoop);
}

function moveCharacter(deltaX, deltaY) {
    /*console.log("cvs width" + canvas.width)
    console.log("positionX = " + positionX)*/
    if (pl.positionX + deltaX > -WIDTH / 2.0 && pl.positionX + SCALED_WIDTH + deltaX < canvas.width) {
        pl.positionX += deltaX;
    }
    if (pl.positionY + deltaY > -HEIGHT / 2.0 && pl.positionY + SCALED_HEIGHT + deltaY < canvas.height) {
        pl.positionY += deltaY;
    }
}

/*function attackAnimation(frameCount) {
    if (frameCount == 5) {
        playerImageY = 745;
        frameCount++;
        if (lockAnimation) {
            setTimeout(attackAnimation, 70, frameCount);
        }
    }
    if (frameCount > 5) {
        frameCount = 0;
        playerImageX = FRAME_X;
        playerImageY = FRAME_Y;
        lockAnimation = false;
        return;
    }
    playerImageX = 314;
    playerImageY = 699 + (45 * frameCount);

    frameCount++;
    if (lockAnimation) {
        setTimeout(attackAnimation, 70, frameCount);
    }

}*/

//30 на 16 размеры
//(34, 27) коорды