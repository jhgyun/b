///<reference path="CcmEntity.ts" />
namespace KBim {
    export class CcmEntityPolygon extends CcmEntity {
        boundary: U1.Vector3[];
        holes: Array<U1.Vector3>[];
        private _bbx: U1.BoundingBox;

        ReadJson(json: any) {
            super.ReadJson(json);

            let strboundary: string = json["boundary"]; 
            this.boundary = [];

            if (strboundary != null) {
                let xys = strboundary.split(" ");
                for (let xy of xys) {
                    let fs = xy.split(",");
                    let p = new U1.Vector3();
                    p.X = parseFloat(fs[0]);
                    p.Y = parseFloat(fs[1]);
                    p.Z = parseFloat(fs[2]);

                    this.boundary.push(p);
                }
            } 
        }
        get BBX() {
            if (this._bbx == null) {
                if (this.boundary != null) {
                    var scl = this.Selector.Result.CoordScale;
                    this._bbx = U1.BoundingBox.CreateFromPoints(this.boundary
                        .map(o_ => {
                            return U1.Vector3.Scale(o_, scl);
                        }));
                }
            } 
            return this._bbx;
        }
        FillLineGeometry(lineGeom: U1.LineBufferGeometry, tm?: U1.Matrix4) {
            var z = this.GetIfcNode()?.Min?.Z ??
                this.GetModel().geomMin.Z;

            var scl = this.Selector.Result.CoordScale;

            var wm = U1.Matrix4.CreateScaleByFloats(scl, scl, scl);
            wm.Multiply(U1.Matrix4.CreateTranslationFloats(0, 0, z));

            if (tm != null)
                wm.Multiply(tm);

            lineGeom.AddppendPolygon(this.boundary, wm); 
        }
    }
}