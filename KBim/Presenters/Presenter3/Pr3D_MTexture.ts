namespace KBim
{
    export class Pr3D_MTexture extends U1.Views.UElementPresenter
    {
        private _texture: U1.Views.ScTexture;
        private _ver = -1;
        private _updateVer;

        constructor()
        {
            super();
            this.Order = 90;
        }
        public get Texture(): U1.Meshes.MTexture
        {
            return this.Element as U1.Meshes.MTexture;
        }
        public get STexture(): U1.Views.ScTexture
        {
            return this._texture;
        }
        protected OnUpdate()
        {
            if (this._texture == null || this._updateVer != this._ver)
            {
                this.OnClear();

                var scene = this.View.Scene;
                var tex = this.Texture;
                var tex_id = tex.ID;
                this._updateVer = this._ver;

                var tex_name = "TEX_#" + tex_id;

                var stexture = scene.Textures.Get(U1.Views.ScTexture, tex_name);
                if (stexture == null)
                {
                    stexture = scene.Textures.Add(U1.Views.ScTexture, tex_name);
                }

                stexture.Uri = tex.Uri;

                this._texture = stexture;
            }
        }

        public OnClear()
        {
            if (this._texture != null)
            {
                this._texture.Dispose();
                this._texture = undefined;
            }
        }
        public OnElementPropertyChanged(sender: U1.UElement, prop: string)
        {
            super.OnElementPropertyChanged(sender, prop);
            this._ver++;
        }
    }
}