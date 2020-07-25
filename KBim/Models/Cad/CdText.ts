/// <reference path="cdentity.ts" />
namespace KBim {
    export class CdText extends CdEntity3d {
        //#region Fields 
        private text: string;
        private fontSize = 1;
        private fontStyle = FontStyleEnum.Normal;
        private fontWeight = FontWeightEnum.Normal;
        private fontFamily = "Arial";
        private textAlignment = TextAlignmentEnum.Left;
        private width = 2;
        private widthFactor = 1;
        private height = 1.4;
        private isSingleLine = false;
        //#endregion

        // #region Props 

        get Text(): string {
            return this.text;
        }
        set Text(value: string) {
            this.SetProperty("Text", "text", value);
        }


        get FontSize(): number {
            return this.fontSize;
        }
        set FontSize(value: number) {
            this.SetProperty("FontSize", "fontSize", value);
        }

        get FontStyle(): FontStyleEnum {
            return this.fontStyle;
        }
        set FontStyle(value: FontStyleEnum) {
            this.SetProperty("FontStyle", "fontStyle", value);
        }

        get FontWeight(): FontWeightEnum {
            return this.fontWeight;
        }
        set FontWeight(value: FontWeightEnum) {
            this.SetProperty("FontWeight", "fontWeight", value);
        }

        get FontFamily(): string {
            return this.fontFamily;
        }
        set FontFamily(value: string) {
            this.SetProperty("FontFamily", "fontFamily", value);
        }

        get TextAlignment(): TextAlignmentEnum {
            return this.textAlignment;
        }
        set TextAlignment(value: TextAlignmentEnum) {
            this.SetProperty("TextAlignment", "textAlignment", value);
        }

        get Width(): number {
            return this.width;
        }
        set Width(value: number) {
            this.SetProperty("Width", "width", value);
        }

        get WidthFactor(): number {
            return this.widthFactor;
        }
        set WidthFactor(value: number) {
            this.SetProperty("WidthFactor", "widthFactor", value);
        }
        get Height(): number {
            return this.height;
        }
        set Height(value: number) {
            this.SetProperty("Height", "height", value);
        }
        get IsSingleLine(): boolean {
            return this.isSingleLine;
        }
        set IsSingleLine(value: boolean) {
            this.SetProperty("IsSingleLine", "isSingleLine", value);
        }
        //#endregion

        //#endregion

        //#region Methods
        public get PropertyCategory() {
            return "Text";
        }

        protected OnGeometryChanged(source: U1.UGeomElement) {
            super.OnGeometryChanged(source);
        }

        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);
            this.Text = props.GetStr("Text", this.text);
            this.FontStyle = props.GetInt("FontStyle", this.fontStyle);
            this.FontWeight = props.GetInt("FontWeight", this.fontWeight);
            this.FontSize = props.GetFloat("FontSize", this.fontSize);
            this.FontFamily = props.GetStr("FontFamily", this.fontFamily);
            this.TextAlignment = props.GetInt("TextAlignment", this.textAlignment);
            this.Width = props.GetFloat("Width", this.width);
            this.WidthFactor = props.GetFloat("WidthFactor", this.widthFactor);
            this.Height = props.GetFloat("Height", this.height);
            this.IsSingleLine = props.GetBool("IsSingleLine", this.isSingleLine);
        }
        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);

            props.SetStr("Text", this.text);
            props.SetInt("FontStyle", this.fontStyle);
            props.SetInt("FontWeight", this.fontWeight);
            props.SetFloat("FontSize", this.fontSize);
            props.SetStr("FontFamily", this.fontFamily);
            props.SetInt("TextAlignment", this.textAlignment);
            props.SetFloat("Width", this.width);
            props.SetFloat("WidthFactor", this.widthFactor);
            props.SetFloat("Height", this.height);
            props.SetBool("IsSingleLine", this.isSingleLine);
        }

        protected OnPropertyChanged(name: string) {
            if (name === "IsMouseOver") {
            }
            else {
                if (name === "Center" ||
                    name === "EndAngle" ||
                    name === "StartAngle" ||
                    name === "Normal"
                ) {
                    this.InvokeTransformChanged();
                    this.InvokeGeometryChanged();
                }
            }
            super.OnPropertyChanged(name);
        }

        //#endregion 

        public UpdateGeoms(result: Array<U1.Geoms.GeEntity>) {
            super.UpdateGeoms(result);

            var getext = new U1.Geoms.GeText();
            getext.FontSize = this.FontSize;
            getext.FontFamily = this.FontFamily;
            getext.Text = this.Text;
            getext.Height = this.Height;
            getext.Width = this.Width;
            getext.WidthFactor = this.WidthFactor;
            getext.Color =  this.Color;
            getext.IsSingleLine = this.IsSingleLine;
            getext.FontStyle = this.FontStyle;
            getext.FontWeight = this.FontWeight;
            getext.TextAlignment = this.TextAlignment;
            getext.Position = this.Transform.Translation;
            getext.Rotation = this.Angle;
            result.push(getext);
        }
    }
    U1.UDocument.Creaters["CdText"] = CdText;
}