document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('load', init);
    function init() {
        document.getElementById("settings").addEventListener("click", switchToSettings);
        document.getElementById("color").addEventListener("click", okayKlick);
    }

    function switchToSettings() {

        document.getElementsByClassName('preloader_block')[0].classList.add('anim2');
        setTimeout(settings, 1000);
    }

    function settings() {
        top.location.href = 'settings.html';
    }

    function okayKlick() {

    }
});