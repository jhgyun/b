namespace KBim.Views
{
    export class ScMaterialThree extends U1.Views.ScMaterial
    {
        private _matThree: THREE.MeshBasicMaterial;

        constructor()
        {
            super();
        }

        public get MaterialTh()
        {
            return this._matThree;
        }
        public OnUpdate(context: U1.Views.UpdateContext)
        {
            var contextx = context as UpdateContextThree;

            if (this.Ver != this.UpdateVer)
            {
                this.UpdateVer = this.Ver;

                if (this._matThree == null)
                {
                    this._matThree = new THREE.MeshBasicMaterial();
                }

                this._matThree.opacity = this.Alpha;
                this._matThree.transparent = this.Alpha < 0.99;
                this._matThree.color = ThreeUtil.Color(this.Diffuse);
                 
                if (this.DiffuseTexture instanceof ScTextureThree)
                {
                    let tex = this.DiffuseTexture as ScTextureThree;
                    tex.ImageLoaded.Add(this, (tex_) =>
                    {
                        this._matThree.map = tex_.TextureThree;
                        tex_.ImageLoaded.Remove(this, null); 
                    });

                    if (tex.IsImageLoaded)
                    {
                        this._matThree.map = tex.TextureThree;
                    }
                }

                if (this.SpecularTexture instanceof ScTextureThree)
                {
                    let tex = this.SpecularTexture as ScTextureThree;
                    tex.ImageLoaded.Add(this, (tex_) =>
                    {
                        this._matThree.specularMap = tex_.TextureThree;
                        tex_.ImageLoaded.Remove(this, null); 
                    });

                    if (tex.IsImageLoaded)
                    {
                        this._matThree.specularMap = tex.TextureThree;
                    } 
                } 
            }
        }
        protected OnClear()
        {
            if (this._matThree != null)
            {
                this._matThree.dispose();
                this._matThree = null;
            }
        }
    }
}