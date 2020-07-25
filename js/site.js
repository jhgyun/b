// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

var AFRAME;

// Write your Javascript code.
if (AFRAME == null) {
    AFRAME = {
        registerComponent: function () { }
    };
}

AFRAME.registerComponent('kac-gaze', {
    init: function () {
        this.onEnter = this.onEnter.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onUp = this.onUp.bind(this);
        this.onDown = this.onDown.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onClick = this.onClick.bind(this);

        this.el.addEventListener("mouseenter", this.onEnter);
        this.el.addEventListener("mouseleave", this.onLeave);
        this.el.addEventListener("mouseup", this.onUp);
        this.el.addEventListener("mousedown", this.onDown);
        this.el.addEventListener("mousemove", this.onMove);

        //this.el.addEventListener("click", this.onClick);
    },
    tick: function () {
    },
    onEnter: function (event) {
    },
    onLeave: function (event) {

    },
    onDown: function (event) {

    },
    onUp: function (event) { 
        this.moveTo(event);
    },
    onMove: function (event) {
    },
    onClick: function (event) {
        this.moveTo(event);
    },
    moveTo: function (event) {
       
        if (event.detail.intersection == null)
            return;

        let srcpos = document.querySelector('#cam').object3D.getWorldPosition();
        let tgtpos = event.detail.intersection.point.clone();

        tgtpos.y = srcpos.y;
        //tgtpos.y += 1.6;
        let world = document.querySelector('#world');
        let worldpos = world.object3D.position;

        let move = srcpos.sub(tgtpos);
        move.add(worldpos);

        world.setAttribute("position", move);
    }
});
AFRAME.registerComponent('kac-gaze-cursor', {
    init: function () { 
        this.onClick = this.onClick.bind(this);  
        this.el.addEventListener("click", this.onClick);
        let scnEl = this.el.sceneEl;
        scnEl.addEventListener('enter-vr', (ev) => {
            this.el.setAttribute("visible", false);
        });

        this.prevTime = Date.now();
        this.curTime = Date.now();
    },
    tick: function () {
    },
    
    onClick: function (event) {
        this.curTime = Date.now();
        let delt = this.curTime - this.prevTime;
        this.prevTime = this.curTime;
        if (delt < 300) {
            this.moveTo(event);
        }
    },
    moveTo: function (event) {

        if (event.detail.intersection == null)
            return;

        let srcpos = document.querySelector('#cam').object3D.getWorldPosition();
        let tgtpos = event.detail.intersection.point.clone();

        let dist = srcpos.distanceTo(tgtpos);
        let dir  = tgtpos.sub(srcpos);

        //tgtpos = srcpos.add(
        tgtpos.y = srcpos.y;

        //tgtpos.y += 1.6;
        let world = document.querySelector('#world');
        let worldpos = world.object3D.position;

        let move = srcpos.sub(tgtpos);
        move.add(worldpos);

        world.setAttribute("position", move);
    }
});
AFRAME.registerComponent('kac-model', {
    schema: {
        prj: { type: 'number' },
        mdl: { type: 'number' },
        stry: { type: 'number', default: -1 } 
    },
    init: function () {
        this.comp = new Kac.KacModelComponent();
        this.comp.init(this);
    },
    update: function (olddata) {
        this.comp.update(this, olddata);
    },
    tick: function (time, timeDelta) {
        this.comp.tick(this, time, timeDelta);
    },
    remove: function () {
        this.comp.remove(this);
    }
});

AFRAME.registerComponent('kac-map', {
    init: function () {
        this.btn = document.getElementById('map');
        if (this.btn == null)
            return;

        this.enabled = false;
        this.isOpened = false;

        this.btn.addEventListener('pointerdown', ev => {
            this.enabled = true;
            this.isOpened = !this.isOpened;
            let w = document.body.clientWidth - 40;
            let h = document.body.clientHeight - 40;

            if (this.isOpened) {
                $(this.btn)
                    .css('width', '')
                    .css('height','')
                    .css('right', "40px")
                    .css('bottom', "40px");
            }
            else {
                $(this.btn)
                    .css('width', '50px')
                    .css('height', '50px')
                    .css('right', "")
                    .css('bottom', "");
            }
        });
        this.btn.addEventListener('pointerup', ev => {
            this.enabled = false;
        });
    }, 
}
);