namespace KBim.Views
{ 
    export class ScModelThree extends U1.Views.ScModel
    {
        private _meshThree: THREE.Mesh;
        private _edgeThree: THREE.LineSegments;
        private _geomThree: THREE.Geometry | THREE.BufferGeometry;
        private _edgeGeomTrhee: THREE.BufferGeometry;
        private static _edgeMaterial: THREE.LineBasicMaterial;

        private TransformVer: number;

        protected OnUpdate(context: U1.Views.UpdateContext)
        {
            if (this.Ver != this.UpdateVer)
            {
                this.OnClear();
                this.UpdateMesh(context as UpdateContextThree);
                this.UpdateEdge(context as UpdateContextThree);
                this.UpdateVer = this.Ver;
                this.TransformVer = -1;
            }

            if (this.TransformVer != this.UpdateVer)
            {
                this.UpdateTransform();
                this.TransformVer = this.UpdateVer;
            }
        }
        protected OnClear()
        { 
            this.ClearMesh();
            this.ClearEdge();
        }
        private ClearMesh()
        {
            var sceneThree = this.Scene as SceneThree;

            if (this._meshThree != null)
            {
                sceneThree.SceneWorld.remove(this._meshThree);
                sceneThree.SceneOverlay.remove(this._meshThree);

                this._meshThree = null;
            }
            if (this._geomThree != null)
            {
                this._geomThree.dispose();
                this._geomThree = null;
            }
        }
        private ClearEdge()
        {
            var sceneThree = this.Scene as SceneThree;
            if (this._edgeThree != null)
            {
                sceneThree.SceneWorld.remove(this._edgeThree);
                sceneThree.SceneOverlay.remove(this._edgeThree);

                this._meshThree = null;
            }
            if (this._edgeGeomTrhee != null)
            {
                this._edgeGeomTrhee.dispose();
                this._edgeGeomTrhee = null;
            }
        }
        protected OnMaterialChanged()
        {
            if (this._meshThree == null)
                return;

            if (this.Material instanceof ScMaterialThree)
                this._meshThree.material = (this.Material as ScMaterialThree).MaterialTh;
            else
                this._meshThree.material = null;
        }
        private UpdateMesh(context: UpdateContextThree)
        {
            if (this.Geometry == null)
            {
                this.ClearMesh();
                return;
            }
            if (this._meshThree == null)
            {
                this._meshThree = new THREE.Mesh();

                if (context.IsOveraySpace)
                    context.SceneOverlay.add(this._meshThree);
                else
                    context.SceneWorld.add(this._meshThree);
            }

            if (this._geomThree != null)
                this._geomThree.dispose();

            var geom = this._geomThree = new THREE.BufferGeometry();
            ThreeUtil.ApplyMeshBufferGeometry(geom, this.Geometry);
            this._meshThree.geometry = geom;

            if (this.Material instanceof ScMaterialThree)
                this._meshThree.material = (this.Material as ScMaterialThree).MaterialTh;
        }
        private UpdateEdge(context: UpdateContextThree)
        {
            if (this.EdgeGeometry == null)
            {
                this._edgeGeomTrhee 
                this.ClearEdge();
                return;
            }
            if (this._edgeThree == null)
            {
                this._edgeThree = new THREE.LineSegments(); 
                if (context.IsOveraySpace)
                    context.SceneOverlay.add(this._edgeThree);
                else
                    context.SceneWorld.add(this._edgeThree);
            }

            if (this._edgeGeomTrhee != null)
                this._edgeGeomTrhee.dispose();

            var geom = this._edgeGeomTrhee = new THREE.BufferGeometry();
             
            ThreeUtil.ApplyLineBufferGeometry(geom, this.EdgeGeometry);
            this._edgeThree.geometry = geom;

            if (ScModelThree._edgeMaterial == null)
            {
                var edge_mat = ScModelThree._edgeMaterial = new THREE.LineBasicMaterial();
                edge_mat.color.set(0x000000);
            }

            this._edgeThree.material = ScModelThree._edgeMaterial;
        }
        private UpdateTransform()
        {
            if (this._meshThree != null)
            {
                ThreeUtil.ApplyTransform(this._meshThree, this.WorldTransform);
            }
            if (this._edgeThree != null)
            {
                ThreeUtil.ApplyTransform(this._edgeThree, this.WorldTransform);
            }
        }
        protected InvalidateWorldTransform()
        {
            super.InvalidateWorldTransform();
            this.TransformVer++;
        }
    }
}