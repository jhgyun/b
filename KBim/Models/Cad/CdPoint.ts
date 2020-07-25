/// <reference path="cdentity.ts" />
namespace KBim
{
    export class CdPoint extends CdEntity
    {
        private pos =  U1.Vector3.Zero ;

        get Pos()
        {
            return this.pos ;
        }
        set Pos(value)
        {
            this.SetProperty("Pos","pos", value);
        }
         
        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props); 
            this.Pos = props.GetValue(U1.Vector3, "Pos", this.pos); 
        }

        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);
            props.SetValue("Pos", this.pos); 
        }


        public SetTransform(xform: U1.Matrix4)
        {
            this.Pos = U1.Vector3.Transform(this.Pos, xform);
        }
    }
    U1.UDocument.Creaters["CdPoint"] = CdPoint; 
}