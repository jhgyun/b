namespace KBim.Views
{
    export class ScTextureThree extends U1.Views.ScTexture
    { 
        private _textureThree: THREE.Texture;
        private _uriUpdate: string; 
        private _isImageLoaded: boolean;

        constructor()
        {
            super();
        }

        public ImageLoaded = new U1.Event1<ScTextureThree>();
        public get IsImageLoaded()
        {
            return this._isImageLoaded;
        } 
        public get TextureThree(): THREE.Texture
        {
            return this._textureThree;
        }
        public OnUpdate(context: U1.Views.UpdateContext)
        {
            var contextx = context as UpdateContextThree;

            if (this.Ver != this.UpdateVer)
            {
                if (this._uriUpdate != this.Uri)
                {
                    this.OnClear();
                    this._uriUpdate = this.Uri;
                }

                if (this._textureThree == null)
                {
                    var loader = new THREE.TextureLoader();
                    let loaded = (tex: THREE.Texture) =>
                    {
                        if (this.Scene != null)
                            this.Scene.View.Invalidate();
                    };
                     
                    this._textureThree = loader.load(this.Uri, loaded);
                    this._textureThree.flipY = false;
                    this.OnImageLoaded();   
                }

                //this._textureThree.hasAlpha = this.HasAlpha;
                //this._textureThree.uOffset = this.UOffset;
                //this._textureThree.vOffset = this.VOffset;
                //this._textureThree.uScale = this.UScale;
                //this._textureThree.vScale = this.VScale;
                //this._textureThree.uAng = this.UAng;
                //this._textureThree.vAng = this.VAng;
                //this._textureThree.wAng = this.WAng;
                //this._textureThree.coordinatesMode = ThreeDUtil.CoordinatesMode(this.CoordinatesMode);

                this.UpdateVer = this.Ver;
            }
        }
        protected OnClear()
        {
            if (this._textureThree != null)
            {
                this._textureThree.dispose();
                this._textureThree = null;
            }
             
            this._isImageLoaded = false; 
        }
        protected OnDisposing()
        {
            super.OnDisposing();
            this.ImageLoaded.Clear();
            this.ImageLoaded = undefined;
        }
        private OnImageLoaded()
        {
            if (this.IsDisposed)
                return;

            this._isImageLoaded = true; 
            this.ImageLoaded.Invoke(this);
        }
    } 
}