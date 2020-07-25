namespace KBim
{
    export class Pr3D_MMesh extends U1.Views.UElementPresenter
    {
        private _meshGeoms:
        {
                [index: number]: U1.MeshBufferGeometry
        };
        private _lineGeoms: {
            [index: number]: U1.LineBufferGeometry
        };

        private ver = -1;
        private updateVer = -1;

        constructor()
        {
            super();
            this.Order = 200;
        }

        public get Mesh(): U1.Meshes.MMesh
        {
            return this.Element as U1.Meshes.MMesh;
        }
        public get MeshGeomsByMid(): { [index: number]: U1.MeshBufferGeometry }
        {
            return this._meshGeoms;
        }
        public get LineGeomsByMid(): { [index: number]: U1.LineBufferGeometry }
        {
            return this._lineGeoms;
        }
        public OnClear()
        {
            if (this._meshGeoms != null)
            {
                this._meshGeoms = undefined;
            }

            this._lineGeoms = undefined
        }
        protected OnUpdate()
        {
            if (this._meshGeoms === undefined || this.ver != this.updateVer)
            {
                this._meshGeoms = {};
                this.AddMesh(this.Mesh); 
                this.updateVer = this.ver;
            }
        }

        protected AddMesh(mesh: U1.Meshes.MMesh)
        {
            var shells = mesh.GetMeshBuffersByMid();
            var mesh = this.Mesh;
            var scene = this.View.Scene;

            for (var str_mid in shells)
            {  
                this._meshGeoms[str_mid] = shells[str_mid]; 
            }
        }

        protected AddMesh_(mesh: U1.Meshes.MMesh)
        {
            var shells = mesh.GetShellsByMid();
            var mesh = this.Mesh;
            var scene = this.View.Scene;

            for (var str_mid in shells)
            {
                var shell = new U1.BRep.Shell();

                for (var sh of shells[str_mid])
                {
                    shell.Merge(sh);
                }
                
                var meshGeom = new U1.MeshBufferGeometry().CopyFromShell(shell); 
                this._meshGeoms[str_mid] = meshGeom;
                 
            }
        }
        public OnElementPropertyChanged(sender: U1.UElement, prop: string)
        {
            super.OnElementPropertyChanged(sender, prop);
            this.ver++;
            this.Invalid = true;
        }
    }
}