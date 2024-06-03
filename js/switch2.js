document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('load', init);
    function init() {
        document.getElementById("newGame").addEventListener("click", switchToNewGame);
        document.getElementById("settings").addEventListener("click", switchToSettings);
        //document.getElementById("color").addEventListener("click", okayKlick);
        document.getElementById("quit").addEventListener("click", closeGame);
        /*var audio = new Audio('..audio/music/Scattle_-_Flatline.mp3');
        audio.play();*/
    }

    function switchToMenu() {
        animation();
        setTimeout(menu, 1000);
    }

    function menu() {
        document.body.removeChild(document.getElementsByClassName('notMenu')[0]);
        // создание контейнера
        let menu = document.createElement('div');
        menu.setAttribute('id', 'container');
        // создание заголовка
        let h1 = document.createElement('h1');
        h1.setAttribute('id', 'name');
        // создание кнопки "Новая игра"
        let but1 = document.createElement('button');
        but1.setAttribute('id', 'newGame');
        //для firefox`a
        but1.setAttribute('autocomplete', 'off');
        //
        but1.textContent = 'Новая игра';
        but1.addEventListener("click", switchToNewGame);
        // создание кнопки "Продолжить"
        let but2 = document.createElement('button');
        but2.setAttribute('id', 'continue');
        but2.textContent = 'Продолжить';
        //для firefox`a
        but2.setAttribute('autocomplete', 'off');
        //
        // создание кнопки "Настройки"
        let but3 = document.createElement('button');
        but3.setAttribute('id', 'settings');
        but3.textContent = 'Настройки';
        //для firefox`a
        but3.setAttribute('autocomplete', 'off');
        //

        but3.addEventListener("click", switchToSettings);
        // создание кнопки "Выход"
        let but4 = document.createElement('button');
        but4.setAttribute('id', 'quit');
        but4.textContent = 'Выход';
        //для firefox`a
        but4.setAttribute('autocomplete', 'off');
        //

        menu.appendChild(h1);
        menu.appendChild(but1);
        menu.appendChild(but2);
        menu.appendChild(but3);
        menu.appendChild(but4);

        document.body.appendChild(menu);
    }

    function switchToNewGame() {
        animation();
        setTimeout(newGame, 1000);
    }

    function newGame() {
        document.body.removeChild(document.getElementById('container'));
        //создание контейнера
        let child = document.createElement('div');
        child.setAttribute('id', 'container-newGame');
        child.classList.add('notMenu');
        window.location.href = "../tutorial.html";
    }

    function switchToSettings() {
        animation();
        setTimeout(settings, 1000);
    }

    function settings() {
        document.body.removeChild(document.getElementById('container'));
        //создание контейнера
        let child = document.createElement('div');
        child.setAttribute('id', 'container-settings');
        child.classList.add('notMenu');

        /* создание кнопки видео */
        let button1 = document.createElement('div');
        button1.setAttribute('id', 'sett-button1');
        let but1 = document.createElement('button');
        but1.setAttribute('id', 'video');
        but1.textContent = 'Video';
        button1.appendChild(but1);

        /* создание кнопки аудио */
        let button2 = document.createElement('div');
        button2.setAttribute('id', 'sett-button2');
        let but2 = document.createElement('button');
        but2.setAttribute('id', 'audio');
        but2.textContent = 'Audio';
        button2.appendChild(but2);

        /* создание кнопки back */
        let back = document.createElement('div');
        back.setAttribute('id', 'sett-back-button');
        let but3 = document.createElement('button');
        but3.setAttribute('id', 'back');
        but3.textContent = 'Back';
        back.appendChild(but3);
        back.addEventListener("click", switchToMenu); // переключение назад

        child.appendChild(back);
        child.appendChild(button1);
        child.appendChild(button2);
        document.body.appendChild(child);
    }

    function closeGame() {
        animation();
        setTimeout(function () {
            window.close();
        }, 1000)
    }

    function animation() {
        document.getElementsByClassName('preloader_block')[0].classList.remove('animation');
        document.getElementsByClassName('preloader_block')[0].style.display = 'block';
        document.getElementsByClassName('preloader_block')[0].classList.add('anim2');
        setTimeout(function () {
            document.getElementsByClassName('preloader_block')[0].style.display = 'none';
            document.getElementsByClassName('preloader_block')[0].classList.remove('anim2');
        }, 2000);
    }
});