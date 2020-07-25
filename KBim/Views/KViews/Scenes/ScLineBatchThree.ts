namespace KBim.Views {
    export class ScLineBatchThree extends U1.Views.ScLineBatch
    {
        private _positions: Float32Array[] = [];
        private _colors: Float32Array[] = [];

        private _geoms: THREE.BufferGeometry[] = [];
        private _objs: THREE.LineSegments[] = [];
        private _mat = new THREE.LineBasicMaterial();//{ vertexColors: THREE.VertexColors });
        private _updateVer: number;

        protected OnUpdate(context: U1.Views.UpdateContext) {
            super.OnUpdate(context); 

            if (this._updateVer == this.Ver)
                return;

            this._updateVer = this.Ver;

            var fillInfo: { gi: number, vi: number, ii: number } = { gi: 0, vi: 0, ii: 0 }; 

            for (var key in this.Items)
            {
                var item = this.Items[key];
                if (item == null) 
                    continue; 
                  
                if (!this.Fill(item, fillInfo))
                {
                    let geom = this._geoms[fillInfo.gi];
                    geom.computeBoundingSphere();
                    (geom.attributes["position"] as THREE.BufferAttribute).needsUpdate = true;
                    (geom.attributes["color"] as THREE.BufferAttribute).needsUpdate = true;
                    geom.setDrawRange(0, fillInfo.vi);

                    fillInfo.gi++;
                    fillInfo.vi = 0;
                    fillInfo.ii = 0;

                    this.Fill(item, fillInfo);
                } 
            }

            let geom = this._geoms[fillInfo.gi];
            if (geom != null) {
                geom.computeBoundingSphere();
                (geom.attributes["position"] as THREE.BufferAttribute).needsUpdate = true;
                (geom.attributes["color"] as THREE.BufferAttribute).needsUpdate = true; 
                geom.setDrawRange(0, fillInfo.vi);
            }
            for (var i = fillInfo.gi+1; i < this._geoms.length; i++)
            {
                this._geoms[i].setDrawRange(0, 0);
            } 
        }

        private Fill(item: U1.Views.ScLineBatchItem, info: { gi: number, vi: number, ii: number }): boolean
        {
            var pointCount = this.PointCount;
            var indexCount = this.IndexCount;

            var vcount = (item.XFormedPath.length - 1) * 2;
            if (info.vi > 0 && info.vi + vcount > pointCount )
            {
                return false;
            }

            if (this._geoms[info.gi] == null)
            {
                this._geoms[info.gi] = new THREE.BufferGeometry();
                this._objs[info.gi] = new THREE.LineSegments(); 
                this._objs[info.gi].geometry = this._geoms[info.gi];
                this._objs[info.gi].material = this._mat;

                var sceneThree = this.Scene as SceneThree; 
                sceneThree.SceneWorld.add(this._objs[info.gi]);

                let points = this._positions[info.gi] = new Float32Array(pointCount * 3);
                let colors = this._colors[info.gi] = new Float32Array(pointCount * 3);

                this._geoms[info.gi].setAttribute("position", new THREE.BufferAttribute(points, 3).setUsage(THREE.DynamicDrawUsage));
                this._geoms[info.gi].setAttribute("color", new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));   
            }  

            let points = this._positions[info.gi];
            let colors = this._colors[info.gi];

            var r = item.Color.R / 255;
            var g = item.Color.G / 255;
            var b = item.Color.B / 255;

            for (var i = 1; i < item.XFormedPath.length; i++) {
                var v0 = info.vi * 3;
                points[v0] = item.XFormedPath[i-1].X;
                points[v0 + 1] = item.XFormedPath[i - 1].Y;
                points[v0 + 2] = item.XFormedPath[i - 1].Z;

                colors[v0] = r;
                colors[v0 + 1] = g;
                colors[v0 + 2] = b;

                info.vi++;
                v0 = info.vi * 3;
                points[v0] = item.XFormedPath[i].X;
                points[v0 + 1] = item.XFormedPath[i].Y;
                points[v0 + 2] = item.XFormedPath[i].Z;

                colors[v0] = r;
                colors[v0 + 1] = g;
                colors[v0 + 2] = b;

                info.vi++;
            } 
            return true;
        }

        protected OnClear() {
            var sceneThree = this.Scene as SceneThree;
            if (this._objs != null)
            {
                for (var i = 0; i < this._objs.length; i++) {
                    sceneThree.SceneWorld.remove(this._objs[i]);
                    this._geoms[i].dispose();
                    this._colors[i] = undefined;
                    this._positions[i] = undefined;
                }
            } 

            if (this._mat != null)
            {
                this._mat.dispose();
            }

            this._geoms = undefined;
            this._colors = undefined;
            this._positions = undefined;
            this._mat = undefined;
        }
    }
}