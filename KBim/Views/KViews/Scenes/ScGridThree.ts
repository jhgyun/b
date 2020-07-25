namespace KBim.Views
{
    export class ScGridThree extends U1.Views.ScGrid
    {
        private _linesThree: THREE.LineSegments;
        private _geomThree: THREE.Geometry;
        private _material: THREE.LineBasicMaterial;

        protected OnUpdate(context: U1.Views.UpdateContext)
        {
            super.OnUpdate(context);

            if (this.Ver != this.UpdateVer)
            {
                this.OnClear();
                this.UpdateLines(context as UpdateContextThree);
                this.UpdateVer = this.Ver;
            }

            this.UpdateTransform();
        }

        protected OnClear()
        {
            var sceneThree = this.Scene as SceneThree;

            if (this._linesThree != null)
            {
                sceneThree.SceneWorld.remove(this._linesThree);
                sceneThree.SceneOverlay.remove(this._linesThree);

                this._linesThree = null;
            }
            if (this._geomThree != null)
            {
                this._geomThree.dispose();
                this._geomThree = null;
            }
            if (this._material != null)
            {
                this._material.dispose();
                this._material = null;
            }
        }

        private UpdateLines(context: UpdateContextThree)
        {
            if (this._linesThree == null)
            {
                this._linesThree = new THREE.LineSegments();

                if (context.IsOveraySpace)
                    context.SceneOverlay.add(this._linesThree);
                else
                    context.SceneWorld.add(this._linesThree);
            }

            if (this._material == null)
            {
                this._material = new THREE.LineBasicMaterial({ color: 0xd3d3d3, linewidth:1 });
            }

            if (this._geomThree == null)
            {
                var geom = this._geomThree = new THREE.Geometry();
                var lineData = this.GetLineData();
                var segments: THREE.Vector3[] = [];

                var ic = lineData.IndexCount;
                for (var i = 0; i < ic; i += 2)
                {
                    var v0 = lineData.Indexes[i];
                    var v1 = lineData.Indexes[i + 1];

                    segments.push(ThreeUtil.Vector3(lineData.Points[v0].Position));
                    segments.push(ThreeUtil.Vector3(lineData.Points[v1].Position));
                }
                geom.vertices = segments;
                geom.verticesNeedUpdate = true;
            }

            this._linesThree.geometry = this._geomThree;
            this._linesThree.material = this._material;
        }

        private UpdateTransform()
        {
            ThreeUtil.ApplyTransform(this._linesThree, this._transform);
        }
    }
}