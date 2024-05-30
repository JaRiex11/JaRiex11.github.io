let canvas;
let ctx;
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

    ctx = canvas.getContext('2d');
}
function gameLoop() {
    ctx.save();
    ctx.fillRect(positionX + WIDTH / 2.0, positionY + HEIGHT / 2.0, 10, 10)
    ctx.translate(positionX + WIDTH / 2.0, positionY + HEIGHT / 2.0);
    //квадратик для центра


    var rotation = Math.atan2(mouseY, mouseX);
    ctx.rotate(rotation);
    drawFrame(FRAME_X, FRAME_Y, positionX, positionY);
    ctx.translate(0, 0);
    ctx.restore();
    window.requestAnimationFrame(gameLoop);
}