/// <reference path="../KView.ts" />
namespace KBim.Views
{
    export class View3DThree extends KView
    {
        private _3dcanvas: HTMLCanvasElement;
        private _textCanvas: HTMLCanvasElement;
        private _textSvg: SVGSVGElement;
        private _scNav: U1.Views.VcNavigator;
        private _rulerText: SVGTextElement;
        private _context2D: CanvasRenderingContext2D; 
        private _canPaning: boolean = false;
        private _svgOverlay: SVGSVGElement;

        constructor(canvas: HTMLCanvasElement, textCanvas: HTMLCanvasElement = null, textSvg: SVGSVGElement = null)
        {
            super();
            this._3dcanvas = canvas;
            this._textCanvas = textCanvas;
            this._textSvg = textSvg;
            this.DefaultTool = new U1.Views.SelectionTool();  
        }

        public get SvgOverlay(): SVGSVGElement {
            return this._svgOverlay;
        }
        public set SvgOverlay(value: SVGSVGElement) {
            this._svgOverlay = value;
        }
        public get SvgText(): SVGSVGElement 
        {
            return this._textSvg;
        }
        public get Canvas(): HTMLCanvasElement
        {
            return this._3dcanvas;
        }
        public set Canvas(value: HTMLCanvasElement)
        {
            this._3dcanvas = value;
        }
      
        public get CanPaning(): boolean
        {
            return this._canPaning;
        }
        public set CanPaning(value: boolean)
        {
            this._canPaning = value;
        }
         
        protected CreateScene(): U1.Views.Scene
        {
            var scene = new SceneThree(this);
            scene.ClearColor = U1.Colors.Azure;
            return scene;
        } 
        protected OnBeginUpdate()
        { 
            super.OnBeginUpdate();
            this._3dcanvas.width = this.Width;
            this._3dcanvas.height = this.Height;
            this._textCanvas.width = this.Width;
            this._textCanvas.height = this.Height;

            this.RenderingContext2D.globalCompositeOperation = 'destination-out'
            this.RenderingContext2D.fillStyle = "rgba(255,255,255,0.2)";
            this.RenderingContext2D.fillRect(0, 0, this.Width, this.Height);
            this.RenderingContext2D.globalCompositeOperation = "source-over";

            if (this._showNavigator) {
                if (this._scNav == null) {
                    this._scNav = this.Controls.AddControl(U1.Views.VcNavigator);
                }
            }
            else {
                if (this._scNav != null) {
                    this._scNav.Dispose();
                    this._scNav = null;
                }
            }
        } 
        protected OnEndUpdate()
        {
            //if (this._rulerText === undefined)
            //{
            //    this._rulerText = document.getElementById("view3DRulerText") as any;
            //}
            //if (this._rulerText != null && this.Scene.World.Grid != null)
            //{
            //    this._rulerText.textContent = "" + this.Scene.World.Grid.GridScale;
            //} 
            super.OnEndUpdate();
        } 
        public get TextSvg()
        {
            return this._textSvg;
        }
        public get RenderingContext2D()
        {
            if (this._context2D == null)
            {
                this._context2D = this._textCanvas.getContext('2d') as CanvasRenderingContext2D;
            }
            return this._context2D;
        }
        public newControlInstance<T extends U1.Views.VcControl>(ctor: { new(): T }): T
        {
            var result: any;

            var ctlType = ctor as any;

            if (ctlType === U1.Views.VcNavigator)
                result = new KBim.Views.VcNavigator3Three();
            else if (ctlType ===U1.Views.VcXForm)
                result = new VcXFormThree(); 
            else
                result = super.newControlInstance(ctor);

            return result as T;
        } 
        protected OnMouseDown(ev: MouseEvent)
        { 
            super.OnMouseDown(ev);
        }
        protected OnMouseEnter(ev: MouseEvent)
        { 
            super.OnMouseEnter(ev);
        }

        protected OnSelectionChanged(sel: U1.USelection)
        {
            if (sel.Count > 0)
            {
                //PanelManager.Instance.ShowPanelProp();
            }

            else
            {
                //PanelManager.Instance.ShowPanelCreate();
            }

            super.OnSelectionChanged(sel);
        }

        ZoomHit(view: U1.Vector2) {

            if (this.Scene?.Camera.ProjectionMode != U1.ProjectionTypeEnum.Perspective)
                return;

            let isect = this.PickOrbitPoint(view);
            if (isect != null) {
                let min = isect.IsectPosition.Clone();
                let max = isect.IsectPosition.Clone();
                let dist = U1.Vector3.Distance(isect.IsectPosition, this.Scene.Camera.Position);

                let rad = Math.max(3, dist * 0.1);

                min.Subtract(new U1.Vector3(rad, rad, rad));
                max.Add(new U1.Vector3(rad, rad, rad));

                let bbx = new U1.BoundingBox(min, max);
                this.ZoomFit(bbx);
                this.Document?.Selection.Clear();
            }
        }
        private _prevTouchTime = Date.now(); //밀리초
        private _curTouchTime = Date.now();  //밀리초
        protected OnDblClick(ev: MouseEvent) {
            this.ZoomHit(new U1.Vector2(ev.offsetX, ev.offsetY));
        }

        OnTouchStart(te: TouchEvent) { 
            this._curTouchTime = Date.now();
            let delt = this._curTouchTime - this._prevTouchTime;

            super.OnTouchStart(te);
            if (te.touches.length == 1 && delt < 300) {
                this.ZoomHit(this.CurDn);
                //te.preventDefault();
            }

            this._prevTouchTime = this._curTouchTime;
        }
    } 
}