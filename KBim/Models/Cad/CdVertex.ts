/// <reference path="cdentity.ts" />
namespace KBim {
    export class CdVertex extends U1.UGeomElement {
        private index = 0;

        get Index() {
            return this.index;
        }
        set Index(value) {
            this.SetProperty("Index", "index", value);
        } 
        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props); 
            this.Index = props.GetInt("Index", this.index);
        }

        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);
            props.SetInt("Index", this.index);
        }
    }

    U1.UDocument.Creaters["CdVertex"] = CdVertex;
}