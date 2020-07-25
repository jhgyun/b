namespace KBim.Views
{
    export class ScLightTree extends U1.Views.ScLight
    {
        private _lightThree: THREE.Light;

        protected OnUpdate(context: U1.Views.UpdateContext)
        {
            super.OnUpdate(context);

            if (this.Ver != this.UpdateVer)
            {
                this.OnClear();
                this.UpdateLight(context as UpdateContextThree);
                this.UpdateVer = this.Ver;
            }
            //this.UpdateTransform();
        }
        protected OnClear()
        {
            if (this._lightThree !== undefined)
            {
                this._lightThree = null;
            }
        }
        private UpdateLight(context: UpdateContextThree)
        {
            this.OnClear();

            if (this.Light.Type == U1.LightTypeEnum.DIRECTIONAL)
            {
                this._lightThree = new THREE.DirectionalLight();

                if (this.DropShadow)
                {
                    //this._lightThree = new THREE( 
                }
            }

        }
    }
}