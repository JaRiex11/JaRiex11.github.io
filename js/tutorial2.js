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
        super(x /** SCALE*/, y /** SCALE*/, /*WIDTH*/FRAME_WIDTH / 4, /*HEIGHT*/FRAME_HEIGHT / 2, angle);
        this.imgName = imgName;
        this.imageX = playerImageX;
        this.imageY = playerImageY;
        this.imgWidth = FRAME_WIDTH;
        this.imgHeight = FRAME_HEIGHT;
        this.collisionBox = new collisionBox(this);
        this.collisionOfWeapon = new hitbox(this, 0, 25, 30, 16);
    }

    attackOfBatonAnimation(frameCount) {
        if (frameCount == 7) {
            this.imageX = 314;
            this.imageY = 745;
            frameCount++;
            if (lockAnimation) {
                setTimeout(() => {
                    this.attackOfBatonAnimation(frameCount);
                }, FRAME_SPEED, frameCount);
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
            }, FRAME_SPEED, frameCount);
        }

    }
}

class enemy extends entity {
    constructor(imgName, enemyImageX, enemyImageY, frameWidth, frameHeight, x, y, width, height, angle) {
        super(x, y, frameWidth / 4, frameHeight / 2, angle);
        this.imgName = imgName;
        this.imageX = enemyImageX;
        this.imageY = enemyImageY;
        this.imgWidth = frameWidth;
        this.imgHeight = frameHeight;
        this.collisionBox = new collisionBox(this);
    }
}

class hitbox extends entity {
    constructor(pl, dx, dy, width, height) {
        super(pl.x + dx/* + width / 2*/, pl.y + dy/* + height / 2*/, width, height, pl.angle);
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
    constructor(player/*, dx, dy*/) { //x, y, width, height, angle, isDeadly
        this.pl = player;
    }

    collision(colBox2) {
        let res = false;

        let ps1 = [
            new point(this.pl.x - this.pl.height * Math.sin(this.pl.angle) / 2 - this.pl.width * Math.cos(this.pl.angle) / 2, this.pl.y - this.pl.height * Math.cos(this.pl.angle) / 2 - this.pl.width * Math.sin(this.pl.angle) / 2),
            new point(this.pl.x + this.pl.height * Math.sin(this.pl.angle) / 2 - this.pl.width * Math.cos(this.pl.angle) / 2, this.pl.y + this.pl.height * Math.cos(this.pl.angle) / 2 - this.pl.width * Math.sin(this.pl.angle) / 2),
            new point(this.pl.x - this.pl.height * Math.sin(this.pl.angle) / 2 + this.pl.width * Math.cos(this.pl.angle) / 2, this.pl.y - this.pl.height * Math.cos(this.pl.angle) / 2 + this.pl.width * Math.sin(this.pl.angle) / 2),
            new point(this.pl.x + this.pl.height * Math.sin(this.pl.angle) / 2 + this.pl.width * Math.cos(this.pl.angle) / 2, this.pl.y + this.pl.height * Math.cos(this.pl.angle) / 2 + this.pl.width * Math.sin(this.pl.angle) / 2)
        ];
        let ps2 = [
            new point(colBox2.pl.x - colBox2.pl.height * Math.sin(colBox2.pl.angle) / 2 - colBox2.pl.width * Math.cos(colBox2.pl.angle) / 2, colBox2.pl.y - colBox2.pl.height * Math.cos(colBox2.pl.angle) / 2 - colBox2.pl.width * Math.sin(colBox2.pl.angle) / 2),
            new point(colBox2.pl.x + colBox2.pl.height * Math.sin(colBox2.pl.angle) / 2 - colBox2.pl.width * Math.cos(colBox2.pl.angle) / 2, colBox2.pl.y + colBox2.pl.height * Math.cos(colBox2.pl.angle) / 2 - colBox2.pl.width * Math.sin(colBox2.pl.angle) / 2),
            new point(colBox2.pl.x - colBox2.pl.height * Math.sin(colBox2.pl.angle) / 2 + colBox2.pl.width * Math.cos(colBox2.pl.angle) / 2, colBox2.pl.y - colBox2.pl.height * Math.cos(colBox2.pl.angle) / 2 + colBox2.pl.width * Math.sin(colBox2.pl.angle) / 2),
            new point(colBox2.pl.x + colBox2.pl.height * Math.sin(colBox2.pl.angle) / 2 + colBox2.pl.width * Math.cos(colBox2.pl.angle) / 2, colBox2.pl.y + colBox2.pl.height * Math.cos(colBox2.pl.angle) / 2 + colBox2.pl.width * Math.sin(colBox2.pl.angle) / 2)
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
        //console.log("mouse is working");
        //console.log(pl);
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

let policeman = new Image();
let prisoners = new Image();
function loadImage() {
    policeman.src = '../img/policeman.png';
    policeman.onload = function () {
        pl.imgName = policeman;

        imgCounter--;
        if (imgCounter == 0) {
            window.requestAnimationFrame(gameLoop);
        }
    };

    prisoners.src = '../img/prisoners.png';
    prisoners.onload = function () {
        enemyList[0].imgName = prisoners;

        imgCounter--;
        if (imgCounter == 0) {
            window.requestAnimationFrame(gameLoop);
        }
    };
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

    pl = new player(policeman, FRAME_X, FRAME_Y, WIDTH / 2, HEIGHT / 2, 0);

    enemyList[0] = new enemy(prisoners, 1059, 62, FRAME_WIDTH, FRAME_HEIGHT, 100, 100, WIDTH, HEIGHT, 0);

    ctx = canvas.getContext('2d');
}

loadImage();

function moveCharacter(deltaX, deltaY) {
    //if (pl.x + deltaX > -FRAME_WIDTH / 2.0 && pl.x + WIDTH + deltaX < canvas.width) {
    pl.x += deltaX;
    //}
    //if (pl.y + deltaY > -FRAME_HEIGHT / 2.0 && pl.y + HEIGHT + deltaY < canvas.height) {
    pl.y += deltaY;
    //}
}

function drawPlayer(pl) {
    ctx.drawImage(pl.imgName, pl.imageX, pl.imageY, FRAME_WIDTH, FRAME_HEIGHT,
        0 - MIDDLE_X + 18 - 14, 0 - 21 - 21, WIDTH, HEIGHT);
    //-14 и -21 нужно для стыковки с центром кручения
    // -18 и - 21 нужно для стыковки с хитбоксом
}

// function drawFrame(pl) {
//     ctx.save();
//     //console.log(pl.imageX);
//     ctx.translate(pl.x/* - MIDDLE_X*/, pl.y /*- MIDDLE_Y*/);
//     ctx.rotate(pl.angle);

//     ctx.fillRect(pl.x, pl.y, pl.width, pl.height);

//     ctx.drawImage(pl.imgName, pl.imageX, pl.imageY, pl.width, pl.height,
//         pl.x, pl.y, pl.width, pl.height);

//     ctx.translate(pl.imgWidth / 2, pl.imgHeight / 2);
//     ctx.restore();
// }

function gameLoop() {

    let mX = mouseX - pl.x;
    let mY = mouseY - pl.y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (keyPresses[87]) {
        moveCharacter(0, -MOVEMENT_SPEED);
    } else if (keyPresses[83]) {
        moveCharacter(0, MOVEMENT_SPEED);
    }
    if (keyPresses[65]) {
        moveCharacter(-MOVEMENT_SPEED, 0);
    } else if (keyPresses[68]) {
        moveCharacter(MOVEMENT_SPEED, 0);
    }

    //фон
    ctx.fillStyle = "#ad0068";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    //enemy
    ctx.fillRect(enemyList[0].collisionBox.pl.x, enemyList[0].collisionBox.pl.y, enemyList[0].collisionBox.pl.width, enemyList[0].collisionBox.pl.height);


    ctx.save();

    //вычисление угла поворота
    var asin = Math.asin(mY / Math.sqrt(mY * mY + mX * mX));
    var acos = Math.acos(mX / Math.sqrt(mY * mY + mX * mX));
    var rotation = asin;

    if (acos > Math.PI / 2.) {
        rotation = -Math.PI - asin;
    }

    //ctx.translate(pl.x + MIDDLE_X + 5, pl.y + MIDDLE_Y);
    ctx.translate(pl.collisionBox.pl.x + pl.collisionBox.pl.width / 2, pl.collisionBox.pl.y + pl.collisionBox.pl.height / 2)
    pl.angle = rotation;
    ctx.rotate(rotation);

    //rectangle
    ctx.fillRect(- pl.collisionBox.pl.width / 2, -pl.collisionBox.pl.height / 2, pl.collisionBox.pl.width, pl.collisionBox.pl.height);

    drawPlayer(pl);
    //drawFrame(policeman, pl.playerImageX, pl.playerImageY, -MIDDLE_X, -MIDDLE_Y, );

    //rotating hitbox of attack
    ctx.strokeStyle = "red";
    ctx.strokeRect(
        - pl.collisionBox.pl.width / 2,
        -pl.collisionBox.pl.height / 2 + 25,
        pl.collisionOfWeapon.collisionBox.pl.width,
        pl.collisionOfWeapon.collisionBox.pl.height
    )

    //ctx.strokeRect(- pl.collisionBox.pl.width / 2, -pl.collisionBox.pl.height / 2 + 25, 30 * SCALE, 16 * SCALE)
    ctx.strokeStyle = "black";

    if (testBool) {
        ctx.fillStyle = "blue";
        ctx.fillRect(- pl.collisionBox.pl.width / 2, -pl.collisionBox.pl.height / 2 + 25, 30 * SCALE, 16 * SCALE)
        ctx.fillStyle = "black";
        testBool = false;
    }

    ctx.restore();

    //хитбокс игрока
    ctx.fillStyle = "rgba(1, 0, 0, 0.5)";
    ctx.fillRect(pl.collisionBox.pl.x, pl.collisionBox.pl.y, pl.collisionBox.pl.width, pl.collisionBox.pl.height);
    ctx.fillStyle = "black";

    //hitbox of attack
    ctx.strokeStyle = "red";
    ctx.strokeRect(pl.x, pl.y + 25, 30 * SCALE, 16 * SCALE)
    ctx.strokeStyle = "black";



    window.requestAnimationFrame(gameLoop);
}
let testBool = false;
function attackOfBatonCollision(frameCount) {
    if (frameCount > 7) {
        frameCount = 0;
        return;
    }
    if (frameCount == 5) {
        //ctx.strokeRect(5, -30, 20 * SCALE, 30 * SCALE);
        //ctx.strokeRect(-16, 0, 30 * SCALE, 16 * SCALE);
        ctx.save();
        ctx.translate(pl.collisionBox.pl.x + pl.collisionBox.pl.width / 2, pl.collisionBox.pl.y + pl.collisionBox.pl.height / 2)
        ctx.rotate(pl.angle);

        let hitBox1 = new hitbox(pl, 0, 25, 30 /** SCALE*/, 16 /** SCALE*/);
        testBool = true;

        if (pl.collisionBox.collision(enemyList[0].collisionBox)) {
            console.log("попал по врагу");
        }
        if (pl.collisionOfWeapon.collisionBox.collision(enemyList[0].collisionBox)) {
            console.log("попал оружием");
        }
        /*if (hitBox1.collisionBox.collision(enemyList[0].collisionBox)) {
            console.log("попал по врагу");
        }*/


        ctx.restore()
    }
    /*if (frameCount == 6) {
        let hitBox2 = new hitbox(pl, 5, -30, 20, 30);
        if (hitBox2.collisionBox.collision(enemyList[0].collisionBox)) {
            console.log("попал по врагу");
        }
    }*/
    frameCount++;
    if (lockAnimation) {
        setTimeout(() => {
            attackOfBatonCollision(frameCount);
        }, FRAME_SPEED, frameCount);
    }

}