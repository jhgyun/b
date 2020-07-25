/// <reference path="../../../u1.d.ts" />
namespace KBim
{
    export class CdLayer extends U1.UNode
    {
        private color = U1.Colors.White ;
        private flag =  0 ;
        private isfrozen =   false ;
        private islocked = false ;
        private visible =  true ;


        get Color()
        {
            return this.color;
        }
        set Color(value)
        {
            this.SetProperty("Color","color", value);
        }
        get IsFrozen()
        {
            return this.isfrozen;
        }
        set IsFrozen(value)
        {
            this.SetProperty("IsFrozen","isfrozen", value);
        }
        get IsLocked()
        {
            return this.islocked;
        }
        set IsLocked(value)
        {
            this.SetProperty("IsLocked","islocked", value);
        }
        get Visible()
        {
            return this.visible;
        }
        set Visible(value)
        {
            this.SetProperty("Visible","visible", value);
        }

        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);

            this.Color = props.GetValue(U1.Color, "Color", this.color);
            this.IsFrozen = props.GetBool("IsFrozen", this.isfrozen); 
            this.IsLocked = props.GetBool("IsLocked", this.islocked); 
            this.Visible  = props.GetBool("Visible", this.visible); 
        } 

        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);
            props.SetValue("Color", this.color);
            props.SetBool("IsFrozen", this.isfrozen);
            props.SetBool("IsLocked", this.islocked);
            props.SetBool("Visible", this.visible); 
        }  
    } 
    export class CdLayerSet extends U1.UNode  
    {
        private namedItems: { [index: string]: CdLayer } = {};


        public AddLayer(name): CdLayer
        {
            return super.AddChild(CdLayer, name);
        }

        public GetLayer(name: string): CdLayer
        {
            if (this.namedItems[name] == null)
                this.namedItems[name] = this.GetChild(CdLayer, name);
            return this.namedItems[name];
        }

        protected OnChildAdded(child: U1.UNode)
        {
            super.OnChildAdded(child);
            this.namedItems = {};
        }
        protected OnChildDeleting(child: U1.UNode)
        {
            super.OnChildDeleting(child);
            this.namedItems = {};
        }
    }

    U1.UDocument.Creaters["CdLayer"] = CdLayer;
    U1.UDocument.Creaters["CdLayerSet"] = CdLayerSet; 
}