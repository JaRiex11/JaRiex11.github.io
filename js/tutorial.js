let data;
fetch('data/scores.json')
    .then(response => response.json())
    .then(jsonData => data = jsonData);
console.log(data);

const SCALE = 2;
const FRAME_WIDTH = 50;
const FRAME_HEIGHT = 45;
const WIDTH = SCALE * FRAME_WIDTH;
const HEIGHT = SCALE * FRAME_HEIGHT;
const MIDDLE_X = WIDTH / 2 - 5;
const MIDDLE_Y = HEIGHT / 2;
const MOVEMENT_SPEED = 10;
const FRAME_X = 0;
const FRAME_Y = 0;
const FRAME_SPEED = 1000 / 36;
const COMBO_TIME = 75;

let canvas;
let ctx;
let keyPresses = {};
let mousePresses = {};
let mouseX, mouseY;
let lockAnimation = false;
let pl;
let enemyList = [];
let imgCounter = 2; // количество рисунков
let testCounter = 1;
let random_num = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
let isPaused = false;
let score = 0;
let combo = 0;
let comboTimer = COMBO_TIME;
let cntEnemies = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
let cntKills = 0;

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
    constructor(imgName, playerImageX, playerImageY, imgWidth, imgHeight, x, y, angle) {
        super(x /** SCALE*/, y /** SCALE*/, /*WIDTH*/imgWidth / 4, /*HEIGHT*/imgHeight / 2, angle);
        this.imgName = imgName;
        this.imageX = playerImageX;
        this.imageY = playerImageY;
        this.imgWidth = imgWidth;//FRAME_WIDTH;
        this.imgHeight = imgHeight;//FRAME_HEIGHT;
        this.isDead = false;
        this.collisionBox = new collisionBox(this.x, this.y, WIDTH / 4, HEIGHT / 2, this.angle);
        // this.collisionOfWeapon = [

        // ];
    }

    attackOfBatonAnimation(frameCount) {
        if (frameCount > 7) {
            frameCount = 0;
            this.imageX = FRAME_X;
            this.imageY = FRAME_Y;
            lockAnimation = false;
            return;
        }
        this.imageX = 0;
        this.imageY = 45 + (45 * frameCount);


        frameCount++;
        if (lockAnimation) {
            setTimeout(() => {
                this.attackOfBatonAnimation(frameCount);
            }, FRAME_SPEED + 11, frameCount);
        }

    }
}

class enemy extends entity {
    constructor(imgName, enemyImageX, enemyImageY, frameWidth, frameHeight, x, y, width, height, angle) {
        super(x, y, frameWidth, frameHeight, angle);
        this.imgName = imgName;
        this.imageX = enemyImageX;
        this.imageY = enemyImageY;
        this.imgWidth = frameWidth;
        this.imgHeight = frameHeight;
        this.isDead = false;
        this.lockAnimation = false;
        this.scores = 500;
        this.collisionBox = new collisionBox(this.x, this.y, width / 4, height / 2, this.angle);
    }

    attackOfEnemyBatonAnimation(frameCount) {
        if (frameCount > 6) {
            frameCount = 0;
            this.lockAnimation = false;
            this.imageX = 0;
            this.imageY = 0;
            return;
        }
        this.imageX = 50 + (50 * frameCount);
        this.imageY = 0;
        frameCount++;
        if (this.lockAnimation) {
            setTimeout(() => {
                this.attackOfEnemyBatonAnimation(frameCount);
            }, FRAME_SPEED + 11, frameCount);
        }

    }
}

class hitbox extends entity {
    constructor(pl, dx, dy, width, height) {
        super(pl.x + dx, pl.y + dy, width, height, pl.angle);
        this.pl = pl;
        this.collisionBox = new collisionBox(this.pl.x + dx, this.pl.y + dy, width * SCALE, height * SCALE, pl.angle);
    }
}

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class collisionBox {
    constructor(x, y, width, height, angle) { //x, y, width, height, angle, isDeadly
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
            new point(this.x + this.height * Math.sin(this.angle) / 2 + this.width * Math.cos(this.angle) / 2, this.y + this.height * Math.cos(this.angle) / 2 + this.width * Math.sin(this.angle) / 2),
            new point(this.x - this.height * Math.sin(this.angle) / 2 + this.width * Math.cos(this.angle) / 2, this.y - this.height * Math.cos(this.angle) / 2 + this.width * Math.sin(this.angle) / 2)
        ];
        let ps2 = [
            new point(colBox2.x - colBox2.height * Math.sin(colBox2.angle) / 2 - colBox2.width * Math.cos(colBox2.angle) / 2, colBox2.y - colBox2.height * Math.cos(colBox2.angle) / 2 - colBox2.width * Math.sin(colBox2.angle) / 2),
            new point(colBox2.x + colBox2.height * Math.sin(colBox2.angle) / 2 - colBox2.width * Math.cos(colBox2.angle) / 2, colBox2.y + colBox2.height * Math.cos(colBox2.angle) / 2 - colBox2.width * Math.sin(colBox2.angle) / 2),
            new point(colBox2.x + colBox2.height * Math.sin(colBox2.angle) / 2 + colBox2.width * Math.cos(colBox2.angle) / 2, colBox2.y + colBox2.height * Math.cos(colBox2.angle) / 2 + colBox2.width * Math.sin(colBox2.angle) / 2),
            new point(colBox2.x - colBox2.height * Math.sin(colBox2.angle) / 2 + colBox2.width * Math.cos(colBox2.angle) / 2, colBox2.y - colBox2.height * Math.cos(colBox2.angle) / 2 + colBox2.width * Math.sin(colBox2.angle) / 2)
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
    if (keyPresses[27]) {
        isPaused = !isPaused;
    }
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

        for (let i = 0; i < cntEnemies; i++) {
            enemyList[i].imgName = prisoners;
        }

        imgCounter--;
        if (imgCounter == 0) {
            window.requestAnimationFrame(gameLoop);
        }
    };
}

function init() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth - 5;
    canvas.height = window.innerHeight - 5;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    canvas.addEventListener('mousemove', function (evt) {
        var rect = this.getBoundingClientRect();

        mouseX = evt.clientX - rect.left;
        mouseY = evt.clientY - rect.top;
        //console.log(mouseX + ", sss" + mouseY);

    }, false);

    pl = new player(policeman, FRAME_X, FRAME_Y, FRAME_WIDTH, FRAME_HEIGHT, WIDTH / 2, HEIGHT / 2, 0);

    for (let i = 0; i < cntEnemies; i++) {
        enemyList[i] = new enemy(
            prisoners, 0, 0, FRAME_WIDTH, FRAME_HEIGHT,
            Math.floor(Math.random() * (canvas.width / SCALE - 25 + 1)) + 25, Math.floor(Math.random() * (canvas.height / SCALE - 25 + 1)) + 25, WIDTH, HEIGHT, 0);
    }

    /*enemyList[0] = new enemy(prisoners, 0, 0, FRAME_WIDTH, FRAME_HEIGHT, 100, 100, WIDTH, HEIGHT, 0);
    enemyList[1] = new enemy(prisoners, 0, 0, FRAME_WIDTH, FRAME_HEIGHT, 180, 100, WIDTH, HEIGHT, 0);
    enemyList[2] = new enemy(prisoners, 0, 0, FRAME_WIDTH, FRAME_HEIGHT, 180, 50, WIDTH, HEIGHT, 0);
    enemyList[3] = new enemy(prisoners, 0, 0, FRAME_WIDTH, FRAME_HEIGHT, 300, 300, WIDTH, HEIGHT, 0);*/

}

loadImage();

function moveCharacter(deltaX, deltaY) {
    if (pl.x + deltaX > 0 && pl.x + WIDTH + deltaX < canvas.width) {
        pl.x += deltaX;
        pl.collisionBox.x += deltaX;
    }
    if (pl.y + deltaY > 0 && pl.y + HEIGHT + deltaY < canvas.height) {
        pl.y += deltaY;
        pl.collisionBox.y += deltaY;
    }
}

function drawPlayer(pl) {
    ctx.drawImage(pl.imgName, pl.imageX, pl.imageY, pl.imgWidth, pl.imgHeight,
        0 - MIDDLE_X + 18 - 14, 0 - 21 - 21, WIDTH, HEIGHT);
    //-14 и -21 нужно для стыковки с центром кручения
    // -18 и - 21 нужно для стыковки с хитбоксом
}

function drawFrame(ent) {
    ctx.drawImage(ent.imgName, ent.imageX, ent.imageY, ent.imgWidth, ent.imgHeight,
        0 - ent.width / 2, 0 - ent.height / 2, ent.width, ent.height);
}

function gameLoop() {

    let mx, my;

    if (pl.isDead) {
        //censured
        pl.imageX = 50;
        pl.imageY = 0;
        //uncensured

        pl.imageX = 50;
        pl.imageY = 45 * random_num;
    }

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

    //Рисовка и передвижение противников
    for (let i = 0; i < enemyList.length; i++) {
        if (enemyList[i].isDead) {
            //censured
            enemyList[i].imageX = 0;
            enemyList[i].imageY = 45;

            //uncensured
            enemyList[i].imageX = 60 * random_num;
            enemyList[i].imageY = 45;
            enemyList[i].imgWidth = 60;
            enemyList[i].imgHeight = 50;
        } else {
            let path = new point(pl.x - enemyList[i].x, pl.y - enemyList[i].y);
            let pathLength = Math.sqrt(path.x * path.x + path.y * path.y);

            if (pathLength > 50 && pathLength < 250) {
                enemyList[i].x += (MOVEMENT_SPEED - 1) * path.x / pathLength;
                enemyList[i].y += (MOVEMENT_SPEED - 1) * path.y / pathLength;
                enemyList[i].collisionBox.x += MOVEMENT_SPEED * path.x / pathLength;
                enemyList[i].collisionBox.y += MOVEMENT_SPEED * path.y / pathLength;
            } else { //игрок в зоне досигаемости
                if (pathLength < 50 && !enemyList[i].lockAnimation) {
                    enemyList[i].lockAnimation = true;
                    enemyList[i].attackOfEnemyBatonAnimation(0);
                    attackOfEnemyBatonCollision(enemyList[i], 0);
                }
            }

            mX = pl.x - enemyList[i].x - 24;
            mY = pl.y - enemyList[i].y - 24;
            var asin = Math.asin(mY / Math.sqrt(mY * mY + mX * mX));
            var acos = Math.acos(mX / Math.sqrt(mY * mY + mX * mX));
            var rotation = asin;
            if (acos > Math.PI / 2.) {
                rotation = -Math.PI - asin;
            }

            enemyList[i].angle = rotation;
            enemyList[i].collisionBox.angle = rotation;
        }

        ctx.save();
        ctx.translate(enemyList[i].collisionBox.x + enemyList[i].collisionBox.width / 2, enemyList[i].collisionBox.y + enemyList[i].collisionBox.height / 2);

        ctx.rotate(enemyList[i].angle);


        drawFrame(enemyList[i]);
        ctx.restore();
    }

    mX = mouseX - pl.x - 24;
    mY = mouseY - pl.y - 24;

    //вычисление угла поворота
    var asin = Math.asin(mY / Math.sqrt(mY * mY + mX * mX));
    var acos = Math.acos(mX / Math.sqrt(mY * mY + mX * mX));
    var rotation = asin;

    if (acos > Math.PI / 2.) {
        rotation = -Math.PI - asin;
    }

    ctx.save();
    ctx.translate(pl.collisionBox.x + pl.collisionBox.width / 2, pl.collisionBox.y + pl.collisionBox.height / 2)

    pl.angle = rotation;
    pl.collisionBox.angle = rotation;

    ctx.rotate(rotation); // Поворот холста

    drawPlayer(pl);

    ctx.strokeRect(
        - pl.collisionBox.width / 2 + 20,
        -pl.collisionBox.height / 2 - 5,
        20 * SCALE,
        30 * SCALE
    )
    ctx.strokeStyle = "black";

    ctx.restore();

    //считаем комбо
    comboTimer--
    if (comboTimer <= 0) {
        combo = 0;
    }
    if (cntKills == cntEnemies) {
        winGame();
    } else if (pl.isDead) {
        restart();
    } else if (isPaused) {
        gameOnPause();
    } else {
        setTimeout(() => {
            window.requestAnimationFrame(gameLoop);
        }, FRAME_SPEED);
    }

}

function winGame() {

    if (data == 'undefined') {
        console.log("Problem with data");
    } else if (data != 'undefined') {

    }

    let array = [];
    data = localStorage.getItem('scoreStorage');
    /*array = data;
    array.push([score]);

    localStorage.setItem('scoreStorage', array);

    console.log(array);*/

    window.location.href = "../index.html";
}

function restart() {
    canvas.style.position = 'absolute';
    console.log("isDead");
    let butContainer = document.createElement('div');
    let cont = document.createElement('button');
    let menu = document.createElement('button');
    let exit = document.createElement('button');

    butContainer.setAttribute('id', "button-container");

    cont.textContent = "Restart";
    menu.textContent = "Back to menu";
    exit.textContent = "Exit the game";

    cont.addEventListener('click', restartGame);
    menu.addEventListener('click', backToMenu);
    exit.addEventListener('click', closeGame);

    butContainer.appendChild(cont);
    butContainer.appendChild(menu);
    butContainer.appendChild(exit);

    document.body.appendChild(butContainer);
}

function gameOnPause() {
    canvas.style.position = 'absolute';
    console.log("isPaused");
    let butContainer = document.createElement('div');
    let cont = document.createElement('button');
    let menu = document.createElement('button');
    let exit = document.createElement('button');

    butContainer.setAttribute('id', "button-container");
    cont.setAttribute('id', 'continueButton');
    menu.setAttribute('id', 'backToMenu');
    exit.setAttribute('if', 'exitGame');

    cont.textContent = "continue";
    menu.textContent = "Back to menu";
    exit.textContent = "exit the game";

    cont.addEventListener('click', continueGame);
    menu.addEventListener('click', backToMenu);
    exit.addEventListener('click', closeGame);

    butContainer.appendChild(cont);
    butContainer.appendChild(menu);
    butContainer.appendChild(exit);

    document.body.appendChild(butContainer);

}

function restartGame() {
    pl.isDead = false;
    location.reload();
}

function continueGame() {
    isPaused = false;
    canvas.style.position = "";
    document.body.removeChild(document.getElementById('button-container'));
    gameLoop();
}

function backToMenu() {
    window.location.href = "../index.html";
}

function closeGame() {
    setTimeout(function () {
        window.close();
    }, 10)
}

function attackOfBatonCollision(frameCount) {
    let hitboxes = [
        new hitbox(pl, 5 * Math.cos(pl.angle) - 8 * Math.sin(pl.angle), 8 * Math.cos(pl.angle) + 5 * Math.sin(pl.angle), 30, 16),
        new hitbox(pl, 30 * Math.cos(pl.angle) + 5 * Math.sin(pl.angle), - 5 * Math.cos(pl.angle) + 30 * Math.sin(pl.angle), 20, 30)
    ];
    if (frameCount > 4) {
        for (let id in enemyList) {
            let en = enemyList[id];
            let enBox = en.collisionBox;
            for (let h in hitboxes) {
                if (hitboxes[h].collisionBox.collision(enBox)) {
                    console.log("collision with enemy id: " + id);
                    if (!enemyList[id].isDead) {
                        cntKills++;
                    }
                    enemyList[id].isDead = true;
                    combo++;
                    score += enemyList[id].scores * combo;
                    console.log(score);
                    console.log("kills = " + cntKills);
                    enemyList[id].scores = 0;
                    comboTimer = COMBO_TIME;
                }
            }
        }
        return;
    }
    frameCount++;
    setTimeout(() => {
        attackOfBatonCollision(frameCount);
    }, FRAME_SPEED + 11);
}

function attackOfEnemyBatonCollision(enemy, frameCount) {
    let hitboxes = [
        new hitbox(enemy, 5 * Math.cos(enemy.angle) - 8 * Math.sin(enemy.angle), 8 * Math.cos(enemy.angle) + 5 * Math.sin(enemy.angle), 30, 16),
        new hitbox(enemy, 30 * Math.cos(enemy.angle) + 5 * Math.sin(enemy.angle), - 5 * Math.cos(enemy.angle) + 30 * Math.sin(enemy.angle), 20, 30)
    ];
    if (frameCount > 4) {
        for (let h in hitboxes) {
            if (hitboxes[h].collisionBox.collision(pl.collisionBox)) {
                console.log("collision with player");
                pl.isDead = true;
            }
        }

        return;
    }
    frameCount++;
    setTimeout(() => {
        attackOfEnemyBatonCollision(enemy, frameCount);
    }, FRAME_SPEED + 11);
}