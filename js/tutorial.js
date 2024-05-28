

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('load', init);
    window.addEventListener('resize', resize)

    function init() {
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('heigth', window.innerHeight);
    }

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    console.log("saaf");

    var img = new Image();

    img.onload = function() {
	    context.drawImage(img, 10, 10);
    };
    img.src = '../img/bg.png';

    function resize() {
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('heigth', window.innerHeight);
    }



});