const SCALE = 2;
const WIDTH = 50;
const HEIGHT = 45;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const MOVEMENT_SPEED = 6;
const FRAME_X = 314;
const FRAME_Y = 340;
const FRAME_SPEED = 300;//50;

let canvas;
let ctx;
let keyPresses = {};
let mousePresses = {};
let mouseX, mouseY;
let lockAnimation = false;
let pl;

class entity {
    constructor(x, y, width, height, angle) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
    }
}

class player extends entity {
    constructor(x, y, playerImageX, playerImageY) {
        super(x, y, WIDTH / 2, HEIGHT, 0);
        this.playerImageX = playerImageX;
        this.playerImageY = playerImageY;
        this.collisionBox = new collisionBox(this);
    }

    attackOfBatonAnimation(frameCount) {
        if (frameCount == 7) {
            this.playerImageX = 314;
            this.playerImageY = 745;
            frameCount++;
            if (lockAnimation) {
                setTimeout(() => {
                    this.attackOfBatonAnimation(frameCount);
                }, FRAME_SPEED, frameCount);
            }
        }
        if (frameCount > 7) {
            frameCount = 0;
            this.playerImageX = FRAME_X;
            this.playerImageY = FRAME_Y;
            lockAnimation = false;
            return;
        }
        if (frameCount < 5) {
            this.playerImageX = 314;
            this.playerImageY = 699 + (45 * frameCount);
        } else {
            this.playerImageX = 364;
            this.playerImageY = 372 + (45 * (frameCount - 5));
        }

        frameCount++;
        if (lockAnimation) {
            setTimeout(() => {
                this.attackOfBatonAnimation(frameCount);
            }, FRAME_SPEED, frameCount);
        }

    }
}

class enemy extends entity {
    constructor(x, y, width, height, angle) {
        super(x, y, width, height, angle);
        this.enemyImageX = enemyImageX;
        this.enemyImageY = enemyImageY;
        this.collisionBox = new collisionBox(this);
    }
}

class hitbox extends entity {
    constructor(pl, dx, dy, width, height) {
        super(pl.x + dx + SCALED_WIDTH / 2, pl.y + dy + SCALED_HEIGHT / 2, width, height, pl.angle);
        this.collisionBox = new collisionBox(this);
    }
}

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class collisionBox {
    constructor(pl) { //x, y, width, height, angle, isDeadly
        this.pl = pl;
    }

    collision(colBox2) {
        let res = false;

        let ps1 = [
            new point(pl.x - pl.height * Math.sin(pl.angle) - pl.width * Math.cos(pl.angle), pl.y - pl.height * Math.cos(pl.angle) - pl.width * Math.sin(pl.angle)),
            new point(pl.x + pl.height * Math.sin(pl.angle) - pl.width * Math.cos(pl.angle), pl.y + pl.height * Math.cos(pl.angle) - pl.width * Math.sin(pl.angle)),
            new point(pl.x - pl.height * Math.sin(pl.angle) + pl.width * Math.cos(pl.angle), pl.y - pl.height * Math.cos(pl.angle) + pl.width * Math.sin(pl.angle)),
            new point(pl.x + pl.height * Math.sin(pl.angle) + pl.width * Math.cos(pl.angle), pl.y + pl.height * Math.cos(pl.angle) + pl.width * Math.sin(pl.angle))
        ];

        let ps2 = [
            new point(colBox2.pl.x - colBox2.pl.height * Math.sin(colBox2.pl.angle) - colBox2.pl.width * Math.cos(colBox2.pl.angle), colBox2.pl.y - colBox2.pl.height * Math.cos(colBox2.pl.angle) - colBox2.pl.width * Math.sin(colBox2.pl.angle)),
            new point(colBox2.pl.x + colBox2.pl.height * Math.sin(colBox2.pl.angle) - colBox2.pl.width * Math.cos(colBox2.pl.angle), colBox2.pl.y + colBox2.pl.height * Math.cos(colBox2.pl.angle) - colBox2.pl.width * Math.sin(colBox2.pl.angle)),
            new point(colBox2.pl.x - colBox2.pl.height * Math.sin(colBox2.pl.angle) + colBox2.pl.width * Math.cos(colBox2.pl.angle), colBox2.pl.y - colBox2.pl.height * Math.cos(colBox2.pl.angle) + colBox2.pl.width * Math.sin(colBox2.pl.angle)),
            new point(colBox2.pl.x + colBox2.pl.height * Math.sin(colBox2.pl.angle) + colBox2.pl.width * Math.cos(colBox2.pl.angle), colBox2.pl.y + colBox2.pl.height * Math.cos(colBox2.pl.angle) + colBox2.pl.width * Math.sin(colBox2.pl.angle))
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

    pl = new player(0, 0, FRAME_X, FRAME_Y);

    ctx = canvas.getContext('2d');
}

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
        console.log("mouse is working");
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
//заготовка под изменённую иконку мыши
window.addEventListener('mouseover', mouseOverListener);
function mouseOverListener(event) {
    mousePresses[event.button] = false;
}

let policeman = new Image();
function loadImage() {
    policeman.src = '../img/policeman.png';
    policeman.onload = function () {
        window.requestAnimationFrame(gameLoop);
    };
}

function drawFrame(imgName, frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(imgName,
        frameX/* * WIDTH*/, frameY/* * HEIGHT*/, WIDTH, HEIGHT,
        canvasX - SCALED_WIDTH / 2, canvasY - SCALED_HEIGHT / 2, SCALED_WIDTH, SCALED_HEIGHT);
}

loadImage();

function gameLoop() {
    mX = mouseX - pl.x - WIDTH / 2.0;
    mY = mouseY - pl.y - HEIGHT / 2.0 - 10;

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

    //квадратик для центра
    ctx.fillStyle = "black";
    ctx.fillRect(pl.x + WIDTH / 2.0, pl.y + HEIGHT / 2.0, 10, 10)
    //фон
    ctx.fillStyle = "#ad0068";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(pl.x + WIDTH / 2.0, pl.y + HEIGHT / 2.0);
    ctx.translate(8, 8);
    var asin = Math.asin(mY / Math.sqrt(mY * mY + mX * mX));
    var acos = Math.acos(mX / Math.sqrt(mY * mY + mX * mX));
    var rotation = asin;

    if (acos > Math.PI / 2.) {
        rotation = -Math.PI - asin;
    }
    pl.angle = rotation;
    ctx.rotate(rotation);
    ctx.translate(0, 0);

    /*pl.collisionBox.pl.width /= -2;
    pl.collisionBox.pl.height /= -2;
    ctx.fillRect(pl.collisionBox.pl.width, pl.collisionBox.pl.height, pl.collisionBox.pl.width, pl.collisionBox.pl.height);*/
    ctx.fillRect(pl.collisionBox.pl.width / -2, pl.collisionBox.pl.height / -2, pl.collisionBox.pl.width, pl.collisionBox.pl.height);
    drawFrame(policeman, pl.playerImageX, pl.playerImageY, 5, 0);
    ctx.strokeStyle = "red";
    ctx.strokeRect(5, -30, 20 * SCALE, 30 * SCALE);
    ctx.strokeRect(-16, 0, 30 * SCALE, 16 * SCALE);
    ctx.strokeStyle = "black";

    ctx.translate(0, 0);
    ctx.restore();
    window.requestAnimationFrame(gameLoop);
}

function moveCharacter(deltaX, deltaY) {
    /*console.log("cvs width" + canvas.width)
    console.log("x = " + x)*/
    if (pl.x + deltaX > -WIDTH / 2.0 && pl.x + SCALED_WIDTH + deltaX < canvas.width) {
        pl.x += deltaX;
    }
    if (pl.y + deltaY > -HEIGHT / 2.0 && pl.y + SCALED_HEIGHT + deltaY < canvas.height) {
        pl.y += deltaY;
    }
}

//не работает пока
function attackOfBatonCollision(frameCount) {
    if (frameCount > 7) {
        frameCount = 0;
        return;
    }
    if (frameCount == 5) {
        //ctx.strokeRect(5, -30, 20 * SCALE, 30 * SCALE);
        //ctx.strokeRect(-16, 0, 30 * SCALE, 16 * SCALE);
        let hitBox1 = new hitbox(pl, -16, 0, 30 * SCALE, 16 * SCALE);

    }
    if (frameCount > 5) {
        let hitBox2 = new hitbox(pl, 5, -30, 20 * SCALE, 30 * SCALE);

    }
}

/*
function attackOfBatonAnimation(frameCount) {
    if (frameCount == 7) {
        pl.playerImageX = 314;
        pl.playerImageY = 745;
        frameCount++;
        if (lockAnimation) {
            setTimeout(attackOfBatonAnimation, FRAME_SPEED, frameCount);
        }
    }
    if (frameCount > 7) {
        frameCount = 0;
        pl.playerImageX = FRAME_X;
        pl.playerImageY = FRAME_Y;
        lockAnimation = false;
        return;
    }
    if (frameCount < 5) {
        pl.playerImageX = 314;
        pl.playerImageY = 699 + (45 * frameCount);
    } else {
        pl.playerImageX = 364;
        pl.playerImageY = 372 + (45 * (frameCount - 5));
    }

    frameCount++;
    if (lockAnimation) {
        setTimeout(attackOfBatonAnimation, FRAME_SPEED, frameCount);
    }

}*/

/* attackOfBatonAnimation(frameCount) {
        if (frameCount == 5) {
            this.playerImageX = 314;
            this.playerImageY = 745;
            frameCount++;
            if (lockAnimation) {
                setTimeout(() => {
                    this.attackOfBatonAnimation(frameCount);
                }, FRAME_SPEED, frameCount);
            }
        }
        if (frameCount > 5) {
            frameCount = 0;
            this.playerImageX = FRAME_X;
            this.playerImageY = FRAME_Y;
            lockAnimation = false;
            return;
        }
        this.playerImageX = 314;
        this.playerImageY = 699 + (45 * frameCount);

        frameCount++;
        if (lockAnimation) {
            setTimeout(() => {
                this.attackOfBatonAnimation(frameCount);
            }, FRAME_SPEED, frameCount);
        }

    }
*/