class KeyControls {
    constructor(keylist = ["KeyW", 'KeyA', 'Keys', 'KeyD']) {
        this.keylist = keylist;
        this.keys = {};

        addEventListener("keydown", e => this.changeState(e));
        addEventListener("keyup", e => this.changeState(e));
    }
    changeState(e) {
        //выбираем нужные клавиши
        if (!this.keylist.includes(e.code)) return;
        this.keys[e.code] = e.type === 'keydown' ? true : false;
        console.log(this.keys);
    }
}

new KeyControls;