/// <reference path="cdvertex.ts" />
namespace KBim
{
    export class CdVertex2d extends CdVertex
    {
        private position = U1.Vector3.Zero ;
        private bulge =  0 ;
        private tangent =  0 ;
        private tangentused =  false ;

        get Position()
        {
            return this.position;
        }
        set Position(value)
        {
            this.SetProperty("Position","position", value);
        }

        get Bulge()
        {
            return this.bulge;
        }
        set Bulge(value)
        {
            this.SetProperty("Bulge", "bulge", value);
        }

        get Tangent()
        {
            return this.tangent;
        }
        set Tangent(value)
        {
            this.SetProperty("Tangent","tangent", value);
        }

        get TangentUsed()
        {
            return this.tangentused;
        }
        set TangentUsed(value)
        {
            this.SetProperty("TangentUsed","tangentused", value);
        }

        public Detach()
        {
            super.Detach();
            this.InvokeGeometryChanged();
        }
         
        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);
            this.Position = props.GetValue(U1.Vector3, "Position", this.position);
            this.Bulge       = props.GetFloat("Bulge", this.bulge);
            this.Tangent     = props.GetFloat("Tangent", this.tangent);
            this.TangentUsed = props.GetBool("TangentUsed", this.tangentused);
        }

        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props); 
            props.SetValue("Position", this.position);
            props.SetFloat("Bulge", this.bulge);
            props.SetFloat("Tangent", this.tangent);
            props.SetBool("TangentUsed", this.tangentused);

        }

        protected OnPropertyChanged(name: string)
        {
            super.OnPropertyChanged(name);
            this.InvokeGeometryChanged();
        }
    }

    U1.UDocument.Creaters["CdVertex2d"] = CdVertex2d; 
}