namespace KBim.Views
{
    export class KView extends U1.Views.ViewBase 
    {
        protected m_rect: SVGRectElement;
        protected _showNavigator = false;

        public Min: U1.Vector3;
        public Max: U1.Vector3;
         
        public get SvgOverlay(): SVGSVGElement
        {
            return null;
        }
        public get SvgText(): SVGSVGElement {
            return null;
        }
        public DrawSelectionBox(dn: U1.Vector2, mv: U1.Vector2, p: number, color: U1.Color)
        {
            if (this.m_rect != null)
            {
                var min = U1.Vector2.Min(dn, mv);
                var max = U1.Vector2.Max(dn, mv);

                this.m_rect.setAttribute("x", "" + min.X);
                this.m_rect.setAttribute("y", "" + min.Y);

                this.m_rect.setAttribute("width", "" + (max.X - min.X));
                this.m_rect.setAttribute("height", "" + (max.Y - min.Y));


                if (dn.X < mv.X)
                {
                    //(m_rect.Stroke as SolidColorBrush).Color = Colors.Blue;
                    this.m_rect.style.fill = "#0000FF";
                    this.m_rect.style.stroke = "#0000FF";
                    this.m_rect.style.fillOpacity = "0.4";
                    // (m_rect.Fill as SolidColorBrush).Color = new System.Windows.Media.Color { A = 100, R = 0, G = 0, B = 255 };
                }
                else
                {
                    this.m_rect.style.fill = "#00FF00";
                    this.m_rect.style.stroke = "#00FF00";
                    this.m_rect.style.fillOpacity = "0.4";
                    //(m_rect.Stroke as SolidColorBrush).Color = Colors.Green;
                    //(m_rect.Fill as SolidColorBrush).Color = new System.Windows.Media.Color { A = 100, R = 0, G = 255, B = 0 };
                }
            }
        }
        public HideSelectionBox()
        {
            if (this.m_rect != null)
            {
                var svgOverlay = this.SvgOverlay;
                if (svgOverlay == null)
                    return;
                 
                svgOverlay.removeChild(this.m_rect);
                this.m_rect = undefined;
            }
        }
        public ShowSelectionBox()
        {
            if (this.m_rect == null)
            {
                var svgOverlay = this.SvgOverlay;
                if (svgOverlay == null)
                    return;

                var svgNS = "http://www.w3.org/2000/svg";

                var rect = this.m_rect = document.createElementNS(svgNS, 'rect') as SVGRectElement; 
                svgOverlay.appendChild(rect);

                rect.style.strokeWidth = "2px";
                rect.style.strokeDasharray = "5,5";
            }
        }
        public get ShowNavicator(): boolean {
            return this._showNavigator;
        }
        public set ShowNavicator(value: boolean) {
            this._showNavigator = value;
        }
        ZoomFit(bbx: U1.BoundingBox = null) {
            if (bbx == null && this.Min !== undefined)
            {
                bbx = new U1.BoundingBox(this.Min, this.Max);
            }
            super.ZoomFit(bbx);
        }
      
        public PickOrbitPoint(view: U1.Vector2): U1.ISectInfo {
            var isectInfo: U1.ISectInfo = null ;
            var raycaster = new THREE.Raycaster();
            var mouse = { x: 0, y: 0 };

            //mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
            //mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

            //1. sets the mouse position with a coordinate system where the center
            //   of the screen is the origin
            mouse.x = (view.X / this.Width)  * 2 - 1;
            mouse.y = -(view.Y / this.Height) * 2 + 1;

            var sceneThree = this.Scene as SceneThree;
            //2. set the picking ray from the camera position and mouse coordinates
            if (sceneThree.SceneMode == Views.SceneMode.Orthographic3D ||
                sceneThree.SceneMode == Views.SceneMode.Orthographic2D)
                raycaster.setFromCamera(mouse, sceneThree.CamOrtho);
            else
                raycaster.setFromCamera(mouse, sceneThree.CamPersp);

            //3. compute intersections
            var intersects = raycaster.intersectObjects((this.Scene as SceneThree).SceneWorld.children, true);

            for (var i = 0; i < intersects.length; i++) {

                if (intersects[i].object?.visible !=true)
                    continue;

                isectInfo = new U1.ISectInfo();
                isectInfo.IsectPosition = ThreeUtil.FromVector3(intersects[i].point);
                isectInfo.Distance = intersects[i].distance;

                break;
                //console.log(intersects[i]);
                /*
                    An intersection has the following properties :
                        - object : intersected object (THREE.Mesh)
                        - distance : distance from camera to intersection (number)
                        - face : intersected face (THREE.Face3)
                        - faceIndex : intersected face index (number)
                        - point : intersection point (THREE.Vector3)
                        - uv : intersection point in the object's UV coordinates (THREE.Vector2)
                */
            }
            return isectInfo
        }

        private pivotControl: VcPoint; 
        public ShowOrbitPivotMark: boolean = true;

        OnMouseMove(ev: MouseEvent) {
            super.OnMouseMove(ev);
            this.UpdateOrbitPivotMark();
        }
        OnTouchMove(ev: TouchEvent): boolean {
            var res = super.OnTouchMove(ev);
            this.UpdateOrbitPivotMark();
            return res;
        }

      
        UpdateOrbitPivotMark() {
            var visible = this.ShowOrbitPivotMark
                && (this.Mode == U1.Views.ViewModes.Orbitting || this.Mode == U1.Views.ViewModes.Paning)
                && this.IsMouseDown;

            if (!visible) {
                if (this.pivotControl != null)
                    this.Controls.RemoveControl(this.pivotControl); 

                this.pivotControl = null;
                return;
            }

            if (this.pivotControl == null) {
                this.pivotControl = this.Controls.AddControl(VcPoint);
                this.pivotControl.Radius = 12;
                this.pivotControl.IsPickable = false;
                this.pivotControl.Fill = U1.Colors.Blue;//{ A = 120 };
                this.pivotControl.Fill.A = 120;
            }

            this.pivotControl.Position = this.PivotPoint
                ?? this.Scene.Camera.LookAt;// + this.Scene.Camera.Direction * 10; 
        }
    }
}