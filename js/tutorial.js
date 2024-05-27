let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('load', init);
    window.addEventListener('resize', resize)

    function init() {
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('heigth', window.innerHeight);
        var img = new Image();

        var img = new Image();

        // Привязываем функцию к событию onload
        // Это указывает браузеру, что делать, когда изображение загружено
        img.onload = function () {
            context.drawImage(img, 10, 10);
        };

        // Загружаем файл изображения
        img.src = "../img/bat.jpg";
    }

    function resize() {
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('heigth', window.innerHeight);
    }



});