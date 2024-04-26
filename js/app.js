class App {
    constructor(container) {
        this.layer = new Laye(container);
    }
}

class Layer {
    constructor(container) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        container.appendChild(this.canvas);

        this.fitToContainer(this.canvas);
        addEventListener('resize', () => this.fitToContainer(this.canvas));
    }

    fitToContainer(cnv) {
        cnv.width = cnv.offsetWidght;
        cnv.height = cnv.offsetHeight;
    }
}

onload = () => {
    new App(document.querySelector('body'));
}