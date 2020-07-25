namespace KBim
{
    export class CdEntity3d extends CdEntity
    {
        //#region Fields
        protected location = U1.Vector3.Zero;
        protected scale = U1.Vector3.One;
        protected axis = U1.Vector3.UnitZ;
        protected angle = 0;

        // #endregion

        //#region Props
        public get Location(): U1.Vector3
        {
            return this.location;
        }
        public set Location(value: U1.Vector3)
        {
            this.SetProperty("Location","location", value);
        }

        public get Scale(): U1.Vector3
        {
            return this.scale;
        }
        public set Scale(value: U1.Vector3)
        {
            this.SetProperty("Scale","scale", value);
        }

        public get Axis(): U1.Vector3
        { 
            return this.axis;
        }
        public set Axis(value: U1.Vector3)
        {
            this.SetProperty("Axis","axis", value);
        }

        public get Angle(): number
        {
            return this.angle;
        }
        public set Angle(value: number)
        {
            this.SetProperty("Angle","angle", value);
        }
        // #endregion

        // #region Methods
        protected OnPropertyChanged(name: string)
        {
            super.OnPropertyChanged(name);
            if (name == "Location" ||
                name == "Scale" ||
                name == "Axis" ||
                name == "Angle")
            {
                this.InvokeTransformChanged();
            }
        }

        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);

            this.Location = props.GetValue(U1.Vector3, "Location", this.location);
            this.Scale = props.GetValue(U1.Vector3, "Scale", this.scale);
            this.Axis = props.GetValue(U1.Vector3,"Axis", this.axis);
            this.Angle = props.GetFloat("Angle", this.angle); 
        }
        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);

            props.SetValue("Location", this.location);
            props.SetValue("Scale", this.scale);
            props.SetValue("Axis", this.axis);
            props.SetFloat("Angle", this.angle);  
        }  
         
        // #endregion

        //#region Transform
        protected UpdateTransform()
        {
            var m0: U1.Matrix4 = CdEntity3d[".utf.m0"] || (CdEntity3d[".utf.m0"] = U1.Matrix4.Identity);
            var m1: U1.Matrix4 = CdEntity3d[".utf.m1"] || (CdEntity3d[".utf.m1"] = U1.Matrix4.Identity);

            this.m_transform
                .SetCreateScale(this.Scale)
                .Multiply(m0.SetCreateFromAxisAngle(this.Axis, this.Angle))
                .Multiply(m1.SetCreateTranslation(this.Location));
        }
        public SetTransform(xform: U1.Matrix4)
        {
            var s_: { scale: U1.Vector3, axisang: U1.Vector4, axis: U1.Vector3, loc: U1.Vector3 };
            s_ = CdEntity3d[".stf."] || (CdEntity3d[".stf."] = s_ = {
                scale: new U1.Vector3(),
                axisang: new U1.Vector4(),
                axis: new U1.Vector3(),
                loc: new U1.Vector3()
            });

            xform.ToSRT(s_.scale, s_.axisang, s_.loc);    
            s_.axisang.GetXYZ(s_.axis); 

            this.Location = s_.loc;
            this.Scale = s_.scale;
            this.Axis = s_.axis;
            this.Angle = s_.axisang.W;
        }
        //#endregion
    }

    U1.UDocument.Creaters["CdEntity3d"] = CdEntity3d; 

}