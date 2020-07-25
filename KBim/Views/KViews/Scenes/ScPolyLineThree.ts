namespace KBim.Views
{
    export class ScPolyLineThree extends U1.Views.ScPolyLine
    { 
        private _lineSegments: THREE.LineSegments;  
        private _lineGeom: THREE.BufferGeometry;  

        public get KView()
        {
            return this.Scene.View as KView;
        }

        static count: number = 0;
        protected OnUpdate(context: U1.Views.UpdateContext)
        {
            if (this.Ver === this.UpdateVer)
            {
                return;
            }

            //if (ScPolyLineThree.count >= 1000)
            //    return;

            this.OnClear();
            this.UpdateVer = this.Ver;

            var lineBuffer = new U1.LineBufferGeometry();
            lineBuffer.BeginAppend();
            lineBuffer.AddppendPolyline(this.Points, this.Transform);
            lineBuffer.EndAppend();
            this._lineSegments = new THREE.LineSegments();
            var geom = this._lineGeom = new THREE.BufferGeometry(); 
            ThreeUtil.ApplyLineBufferGeometry(geom, lineBuffer);
            this._lineSegments.geometry = geom;
            //this._lineSegments.material = new THREE.LineBasicMaterial({ color: 0xff0000 }) 
            var sceneThree = this.Scene as SceneThree;

            sceneThree.SceneWorld.add(this._lineSegments);
            ScPolyLineThree.count++;
        }
        
        protected OnClear()
        {
            var sceneThree = this.Scene as SceneThree;
            if (this._lineSegments != null)
                sceneThree.SceneWorld.remove(this._lineSegments);

            if (this._lineGeom != null)
                this._lineGeom.dispose(); 

            this._lineSegments = null;
            this._lineGeom = null;
        }
    }
}