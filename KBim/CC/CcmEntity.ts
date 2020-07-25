namespace KBim {
    export class CcmEntity {
        EID: string;
        Selector: CcSelector;
        GetIfcNode() {
            if (this.EID != null)
            {
                return this.Selector.Result.Model.node_map.get(this.EID);
            }
            return null;
        }
        GetRelatedNodes(): KmNode[]
        {
            if (this._relatedElements != null) {
                let mdl = this.GetModel();

                return this._relatedElements
                    .map(o_ =>
                    mdl.node_map.get(o_));
            }
            return null;
        }
        GetModel() {
            return this.Selector?.Result?.Model;
        }
        ReadJson(json: any) { 
            this.EID = json["eid"];
            this._relatedElements = (json["elementsRelated"] as string)?.split(",");
        }
        get BBX() {
            return new U1.BoundingBox(new U1.Vector3(-10. - 10, -10), new U1.Vector3(10, 10, 10));
        }

        FillLineGeometry(lineGeom: U1.LineBufferGeometry,  tm?: U1.Matrix4) {
            return null;
        }

        private _relatedElements: string[];
    } 
}