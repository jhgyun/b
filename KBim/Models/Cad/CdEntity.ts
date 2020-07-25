/// <reference path="../../../u1.d.ts" /> 
namespace KBim
{
    export class CdEntity extends U1.UGeomElement
    {
        private handle = "";
        private layerName ="";
        private lineType = "solid";
        private lineThick = 1;
        private linePattern = [1];
        private isFilled = false;
        private fillColor = U1.Colors.Gray;
        private color = U1.Colors.Black;
        private useLayerColor = false;
        private useBlockColor = false;
           
        public get Handle(): string 
        {
            return this.handle;
        }
        public set Handle(value: string)
        {
            this.SetProperty("Handle", "handle", value);
        }
        public get LayerName(): string 
        {
            return this.layerName;
        }
        public set LayerName(value: string)
        {
            this.SetProperty("LayerName",  "layerName", value); 
        }
        public get LineType(): string 
        {
            return this.lineType;
        }
        public set LineType(value: string)
        {
            this.SetProperty("LineType", "linetype", value);  
        }
        public get LineThick(): number
        {
            return this.lineThick;
        }
        public set LineThick(value: number)
        {
            this.SetProperty("LineThick", "lineThick", value);
        }
        public get LinePattern(): number[]
        {
            return this.linePattern;
        }
        public set LinePattern(value: number[])
        {
            this.SetProperty("LinePattern","linePattern", value);
        }
        public get IsFilled(): boolean
        {
            return this.isFilled;
        }
        public set IsFilled(value: boolean)
        {
            this.SetProperty("IsFilled","isFilled", value);
        }
        public get FillColor(): U1.Color
        {
            return this.fillColor;
        }
        public set FillColor(value: U1.Color)
        {
            this.SetProperty("FillColor", "fillColor", value);
        }
        public get Color(): U1.Color
        { 
            return this.color;
        }
        public set Color(value: U1.Color)
        {
            this.SetProperty("Color","color", value);
        }
        public get UseLayerColor(): boolean
        {
            return this.useLayerColor;
        }
        public set UseLayerColor(value: boolean)
        {
            this.SetProperty("UseLayerColor","useLayerColor", value);
        }
        public get UseBlockColor(): boolean
        {
            return this.useBlockColor;
        }
        public set UseBlockColor(value: boolean)
        {
            this.SetProperty("UseBlockColor","useBlockColor", value);
        }

        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props); 

            this.Handle = props.GetStr("Handle", this.handle);
            this.LayerName = props.GetStr("LayerName", this.layerName);
            this.LineType = props.GetStr("LineType", this.lineType);
            this.LineThick = props.GetInt("LineThick", this.lineThick);
            this.LinePattern = props.GetIntArr("LinePattern", this.linePattern);
            this.IsFilled = props.GetBool("IsFilled", this.isFilled);
            this.FillColor = props.GetValue(U1.Color, "FillColor", this.fillColor); 
            this.Color = props.GetValue(U1.Color, "Color", this.color);
            this.UseLayerColor = props.GetBool("UseLayerColor", this.useLayerColor);
            this.UseBlockColor = props.GetBool("UseBlockColor", this.useBlockColor);
        }
        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props); 
            props.SetStr("Handle", this.handle);
            props.SetStr("LayerName", this.layerName);
            props.SetStr("LineType", this.lineType);
            props.SetInt("LineThick", this.lineThick);
            props.SetIntArr("LinePattern", this.linePattern);
            props.SetBool("IsFilled", this.isFilled);
            props.SetValue("FillColor", this.fillColor);
            props.SetValue("Color", this.color);
            props.SetBool("UseLayerColor", this.useLayerColor);
            props.SetBool("UseBlockColor", this.useBlockColor);
        }  

        public static SetTransformCircle(entity: { Center: U1.Vector3, Radius: number, Normal: U1.Vector3 }, xform: U1.Matrix4)
        {
            var s_: { v0: U1.Vector3, sc: U1.Vector3, axis: U1.Vector4, loc: U1.Vector3 };
            s_ = CdEntity[".stfc."] || (CdEntity[".stfc."] = s_ =
                {
                v0: new U1.Vector3(),
                sc: new U1.Vector3(), axis: new U1.Vector4(), loc: new U1.Vector3()
                });


            var v0 = s_.v0;
            var scale = s_.sc;
            var axis = s_.axis;
            var loc = s_.loc;
             
            xform.ToSRT(scale, axis, loc);

            entity.Center = U1.Vector3.Transform(entity.Center, xform, v0);
            entity.Radius *= Math.max(scale.X, Math.max(scale.Y, scale.Z));
            entity.Normal = v0.SetTransformNormal(entity.Normal, xform).Normalize();
        }
        public UpdateGeoms(result: U1.Geoms.GeEntity[]): void {
            super.UpdateGeoms(result)}
    }

    export class CdEntitySet extends U1.UNode
    {
        public AddEntity<T extends CdEntity>(ctor: { new (): T }): T 
        {
            var entity = super.AddChild<any>(ctor);
            return entity;
        }

        public get Entities(): CdEntity[]
        {
            return this.Children
                .filter(o_ => o_ instanceof CdEntity) as CdEntity[];
        }
    }

    U1.UDocument.Creaters["CdEntity"] = CdEntity; 
    U1.UDocument.Creaters["CdEntitySet"] = CdEntitySet; 
}