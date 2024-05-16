document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('load', init);
    function init() {
        document.getElementById("video").addEventListener("click", switchToSettings);
        document.getElementById("audio").addEventListener("click", okayKlick);
    }

    function switchToSettings() {
        setTimeout(settings, 1000)
    }

    function settings() {
        top.location.href = 'settings.html';
    }

    function okayKlick() {

    }
});