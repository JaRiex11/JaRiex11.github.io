document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('load', init);
    function init() {
        document.getElementById("settings").addEventListener("click", switchToSettings);
        document.getElementById("color").addEventListener("click", okayKlick);
    }

    function switchToSettings() {
        setTimeout(settings, 1000)
    }

    function settings() {
        top.location.href = 'settings.html';
    }
});