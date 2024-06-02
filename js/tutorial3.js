const SCALE = 2;
const FRAME_WIDTH = 50;
const FRAME_HEIGHT = 45;
const WIDTH = SCALE * FRAME_WIDTH;
const HEIGHT = SCALE * FRAME_HEIGHT;
const MIDDLE_X = WIDTH / 2 - 5;
const MIDDLE_Y = HEIGHT / 2;
const MOVEMENT_SPEED = 1;
const FRAME_X = 315;
const FRAME_Y = 340;
const FRAME_SPEED = 50;

let canvas;
let ctx;
let keyPresses = {};
let mousePresses = {};
let mouseX, mouseY;
let lockAnimation = false;
let pl;
let enemyList = {};
let imgCounter = 2; // количество рисунков
let testCounter = 1;

class entity {
    constructor(x, y, width, height, angle) {
        this.x = x * SCALE;
        this.y = y * SCALE;
        this.width = width * SCALE;
        this.height = height * SCALE;
        this.angle = angle;
    }
}

class player extends entity {
    constructor(imgName, playerImageX, playerImageY, x, y, angle) {
        super(x, y, FRAME_WIDTH / 4, FRAME_HEIGHT / 2, angle);
        this.imgName = imgName;
        this.imageX = playerImageX;
        this.imageY = playerImageY;
        this.imgWidth = FRAME_WIDTH;
        this.imgHeight = FRAME_HEIGHT;
        this.collisionBox = new collisionBox(this.x, this.y, WIDTH / 4, HEIGHT / 2, this.angle);
        this.collisionOfWeapon = [
            new hitbox(this, 0, 25, 30, 16),
            new hitbox(this, 20, -5, 20, 30)
        ];
    }

    attackOfBatonAnimation(frameCount) {
        if (frameCount == 7) {
            this.imageX = 314;
            this.imageY = 745;
            frameCount++;
            if (lockAnimation) {
                setTimeout(() => {
                    this.attackOfBatonAnimation(frameCount);
                }, FRAME_SPEED);
            }
        }
        if (frameCount > 7) {
            frameCount = 0;
            this.imageX = FRAME_X;
            this.imageY = FRAME_Y;
            lockAnimation = false;
            return;
        }
        if (frameCount < 5) {
            this.imageX = 314;
            this.imageY = 699 + (45 * frameCount);
        } else {
            this.imageX = 364;
            this.imageY = 372 + (45 * (frameCount - 5));
        }

        frameCount++;
        if (lockAnimation) {
            setTimeout(() => {
                this.attackOfBatonAnimation(frameCount);
            }, FRAME_SPEED);
        }
    }
}

class enemy extends entity {
    constructor(imgName, enemyImageX, enemyImageY, x, y, angle) {
        super(x, y, FRAME_WIDTH / 4, FRAME_HEIGHT / 2, angle);
        this.imgName = imgName;
        this.imageX = enemyImageX;
        this.imageY = enemyImageY;
        this.imgWidth = FRAME_WIDTH;
        this.imgHeight = FRAME_HEIGHT;
        this.collisionBox = new collisionBox(this.x, this.y, this.width, this.height, this.angle);
    }
}

class hitbox extends entity {
    constructor(pl, dx, dy, width, height) {
        super(pl.x + dx, pl.y + dy, width, height, pl.angle);
        this.pl = pl;
        this.collisionBox = new collisionBox(this.x, this.y, width * SCALE, height * SCALE);
    }
}

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class collisionBox {
    constructor(x, y, width, height, angle) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
    }

    collision(colBox2) {
        let res = false;
        let ps1 = [
            new point(this.x - this.height * Math.sin(this.angle) / 2 - this.width * Math.cos(this.angle) / 2, this.y - this.height * Math.cos(this.angle) / 2 - this.width * Math.sin(this.angle) / 2),
            new point(this.x + this.height * Math.sin(this.angle) / 2 - this.width * Math.cos(this.angle) / 2, this.y + this.height * Math.cos(this.angle) / 2 - this.width * Math.sin(this.angle) / 2),
            new point(this.x - this.height * Math.sin(this.angle) / 2 + this.width * Math.cos(this.angle) / 2, this.y - this.height * Math.cos(this.angle) / 2 + this.width * Math.sin(this.angle) / 2),
            new point(this.x + this.height * Math.sin(this.angle) / 2 + this.width * Math.cos(this.angle) / 2, this.y + this.height * Math.cos(this.angle) / 2 + this.width * Math.sin(this.angle) / 2)
        ];
        let ps2 = [
            new point(colBox2.x - colBox2.height * Math.sin(colBox2.angle) / 2 - colBox2.width * Math.cos(colBox2.angle) / 2, colBox2.y - colBox2.height * Math.cos(colBox2.angle) / 2 - colBox2.width * Math.sin(colBox2.angle) / 2),
            new point(colBox2.x + colBox2.height * Math.sin(colBox2.angle) / 2 - colBox2.width * Math.cos(colBox2.angle) / 2, colBox2.y + colBox2.height * Math.cos(colBox2.angle) / 2 - colBox2.width * Math.sin(colBox2.angle) / 2),
            new point(colBox2.x - colBox2.height * Math.sin(colBox2.angle) / 2 + colBox2.width * Math.cos(colBox2.angle) / 2, colBox2.y - colBox2.height * Math.cos(colBox2.angle) / 2 + colBox2.width * Math.sin(colBox2.angle) / 2),
            new point(colBox2.x + colBox2.height * Math.sin(colBox2.angle) / 2 + colBox2.width * Math.cos(colBox2.angle) / 2, colBox2.y + colBox2.height * Math.cos(colBox2.angle) / 2 + colBox2.width * Math.sin(colBox2.angle) / 2)
        ];

        for (let i = 1; i < 5; i++) {
            let p1 = ps1[i - 1];
            let p2 = ps1[i];
            if (i == 4) {
                p2 = ps1[0];
            }
            for (let j = 1; j < 5; j++) {
                let p3 = ps2[j - 1];
                let p4 = ps2[j];
                if (j == 4) {
                    p4 = ps2[0];
                }
                if (p2.x - p1.x == 0) {
                    let buf = p1;
                    p1 = p3;
                    p3 = buf;
                    buf = p2;
                    p2 = p4;
                    p4 = buf;
                }

                let t2 = ((p3.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p3.x - p1.x))
                    / ((p2.y - p1.y) * (p4.x - p3.x) - (p4.y - p3.y) * (p2.x - p1.x));

                let t1 = (p3.x - p1.x + (p4.x - p3.x) * t2) / (p2.x - p1.x);

                if (0 < t1 && 1 > t1 && 0 < t2 && 1 > t2) {
                    res = true;
                }
            }
        }

        return res;
    }
}

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.keyCode] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.keyCode] = false;
}

window.addEventListener('mousedown', mouseDownListener);
function mouseDownListener(event) {
    if (event.button == 0 && !lockAnimation) { //left mouse button
        lockAnimation = true;
        if (lockAnimation) {
            pl.attackOfBatonAnimation(0);
            attackOfBatonCollision(0);
        }
    }
    mousePresses[event.button] = true;
}

window.addEventListener('mouseup', mouseUpListener);
function mouseUpListener(event) {
    mousePresses[event.button] = false;
}

window.addEventListener('mousemove', mouseMoveListener);
function mouseMoveListener(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function loadImage() {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = 'tileset.png';
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

function drawFrame(image, sx, sy, sw, sh, dx, dy, dw, dh) {
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

async function init() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const tilesetImage = await loadImage();

    // Initialize player
    pl = new player("player", FRAME_X, FRAME_Y, MIDDLE_X, MIDDLE_Y, 0);

    // Initialize enemies
    enemyList[0] = new enemy("enemy", 315, 550, 100, 100, 0);

    function gameLoop() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        drawFrame(tilesetImage, pl.imageX, pl.imageY, pl.imgWidth, pl.imgHeight, pl.x, pl.y, pl.width, pl.height);

        // Draw enemies
        for (let id in enemyList) {
            let en = enemyList[id];
            drawFrame(tilesetImage, en.imageX, en.imageY, en.imgWidth, en.imgHeight, en.x, en.y, en.width, en.height);
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

window.onload = init;

function attackOfBatonCollision(frameCount) {
    let hitboxes = pl.collisionOfWeapon;
    if (frameCount > 4) {
        for (let id in enemyList) {
            let en = enemyList[id];
            let enBox = en.collisionBox;
            for (let h in hitboxes) {
                if (hitboxes[h].collisionBox.collision(enBox)) {
                    console.log("collision with enemy id: " + id);
                }
            }
        }
        return;
    }
    frameCount++;
    setTimeout(() => {
        attackOfBatonCollision(frameCount);
    }, FRAME_SPEED);
}
