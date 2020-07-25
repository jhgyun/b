/// <reference path="cdentity.ts" />
namespace KBim
{
    export class CdBlock extends U1.UGeomElement 
    {
        private color =  U1.Colors.Black ;
        private orign = new U1.Vector3() ;

        public get Entities(): CdEntity[]
        {
            return this.Children.filter(o_ => o_ instanceof CdEntity) as CdEntity[];
        }
        public get Color(): U1.Color
        {
            return this.color;
        }
        public set Color(value: U1.Color)
        {
            this.SetProperty("Color", "color", value);
        }

        public get Orign(): U1.Vector3
        { 
            return this.orign;
        }
        public set Orign(value: U1.Vector3)
        {
            this.SetProperty("Orign","orign", value);
        }

        public AddEntity<T extends CdEntity>(ctor: { new (): T }): T  
        {
            return this.AddChild<any>(ctor);
        }

        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);

            this.Color = props.GetValue(U1.Color, "Color", this.color);
            this.Orign = props.GetValue(U1.Vector3, "Orign", this.orign); 
        }
        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);

            props.SetValue("Color", this.color);
            props.SetValue("Orign", this.orign); 
        }  

        public GetGeomNodes(parentXForm: U1.Matrix4, nodes: Array<U1.Geoms.GeNode>): void
        {
            parentXForm = U1.Matrix4.Multiply( this.Transform , parentXForm);
            for(var ent of this.Entities)
            {
                ent.GetGeomNodes(parentXForm, nodes);
            }
        }

        protected OnGeometryChanged(source: U1.UGeomElement) 
        {
            super.OnGeometryChanged(source);  
        }
        protected OnChildAdded(child: U1.UNode)
        {
            super.OnChildAdded(child);
            this.InvokePropertyChanged("EntityChanged");
        }
        protected OnChildDeleting(child: U1.UNode)
        {
            super.OnChildDeleting(child);
            this.InvokePropertyChanged("EntityChanged");
        }

        protected UpdateTransform()
        {
            var orign = this.Orign;
            this.m_transform.SetCreateTranslationFloats(-orign.X, -orign.Y, -orign.Z);
        }
    } 
    export class CdBlockSet extends U1.UNode
    {
        private namedItems: { [index: string]: CdBlock }; 

        public GetBlock(name: string): CdBlock 
        {
            if (this.namedItems == null)
                this.namedItems = {};

            if (this.namedItems[name] === undefined)
                this.namedItems[name] = this.GetChild(CdBlock, name);

            return this.namedItems[name];
        } 
        protected OnChildAdded(child: U1.UGeomElement)
        {
            super.OnChildAdded(child);
            this.namedItems = null; 
             
        }
        protected OnChildDeleting(child: U1.UGeomElement)
        {
            super.OnChildDeleting(child);  
            this.namedItems = null; 
        }
        //#endregion
    }

    U1.UDocument.Creaters["CdBlock"] = CdBlock;
    U1.UDocument.Creaters["CdBlockSet"] = CdBlockSet;
}