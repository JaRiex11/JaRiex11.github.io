document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('load', init);
    function init() {
        document.getElementById("video").addEventListener("click", video);
        document.getElementById("audio").addEventListener("click", okayKlick);
    }

    //нужно сделать кнопку полного экрана
    //а также кнопку регулировки громкости
});