namespace KBim
{
    export class Pr3D_MMat extends U1.Views.UElementPresenter
    {
        private _mat: U1.Views.ScMaterial;
        private _ver = -1;
        private _updateVer;

        constructor()
        {
            super();
            this.Order = 100;
        }
        public get Mtl(): U1.Meshes.MMtl
        {
            return this.Element as U1.Meshes.MMtl;
        }
        public get SMaterial(): U1.Views.ScMaterial
        {
            return this._mat;
        }
        protected OnUpdate()
        {
            if (this._mat == null || this._updateVer != this._ver)
            {
                this.OnClear();

                var scene = this.View.Scene;
                var mtl = this.Mtl;
                var mid = mtl.ID;
                this._updateVer = this._ver;

                var mat_name = "MTL_#" + mid;

                var smat = scene.Materials.Get(U1.Views.ScMaterial, mat_name);
                if (smat == null)
                {
                    smat = scene.Materials.Add(U1.Views.ScMaterial, mat_name);
                }
                  
                if (mtl instanceof U1.Meshes.MMtlColr)
                {
                    smat.Diffuse = mtl.Color;
                    smat.Alpha = mtl.Alpha
                }
                else if (mtl instanceof U1.Meshes.MMtlTex)
                {
                    var difTexPrsnt = this.DocumentPresesnter.GetPresenter(Pr3D_MTexture, mtl.DifTex)   ;
                     
                    // smat.te
                    smat.Diffuse = mtl.Diffuse;
                    smat.DiffuseTexture = difTexPrsnt.STexture;
                    smat.Alpha = mtl.Alpha;
                } 

                this._mat = smat;
            }
        }

        public OnClear()
        {
            if (this._mat != null)
            {
                this._mat.Dispose();
                this._mat = undefined;
            }
        }
        public OnElementPropertyChanged(sender: U1.UElement, prop: string)
        {
            super.OnElementPropertyChanged(sender, prop);
            this._ver++; 
        }
    }
}