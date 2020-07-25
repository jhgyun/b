/// <reference path="cdentity.ts" />
namespace KBim {
    export class CdCircle extends CdEntity {
        //#region Fields
        private thickness = 1;
        private center = new U1.Vector3();
        private radius = 1;
        private normal = U1.Vector3.UnitZ;
        private _path3: U1.Vector3[];

        //#endregion

        // #region Props
        public get Thickness(): number {
            return this.thickness;
        }
        public set Thickness(value: number) {
            this.SetProperty("Thickness", "thickness", value);
        }
        public get Center(): U1.Vector3 {
            return this.center;
        }
        public set Center(value: U1.Vector3) {
            this.SetProperty("Center", "center", value);
        }
        public get Radius(): number {
            return this.radius;
        }
        public set Radius(value: number) {
            this.SetProperty("Radius", "radius", value);
        }
        public get Normal(): U1.Vector3 {
            return this.normal;
        }
        public set Normal(value: U1.Vector3) {
            this.SetProperty("Normal", "normal", value);
        }

        get Path3(): U1.Vector3[] {
            if (this._path3 == null) {
                var minAxis = U1.Vector3.Scale(U1.Vector3.UnitX, this.Radius);
                var majAxis = U1.Vector3.Scale(U1.Vector3.UnitY, this.Radius);
                var cnt = this.Center;

                var s_a = 0.0;
                var e_a = Math.PI * 2;

                if (e_a <= s_a)
                    e_a += Math.PI * 2;

                var ang = e_a - s_a;

                var segment = 32;
                if (ang < Math.PI * 3 / 2)
                    segment = 24;
                if (ang < Math.PI)
                    segment = 16;
                if (ang < Math.PI / 2)
                    segment = 8;

                var delt = ang / segment;
                var p = U1.Vector3.Zero;

                var plist: U1.Vector3[] = [];
                var norm = this.Normal;
                var m = U1.Matrix4.Identity;
                var v = U1.Vector3.Zero;

                for (var a = s_a; ; a += delt) {
                    if (a >= e_a)
                        a = e_a;

                    v = U1.Vector3.Add(U1.Vector3.Scale(majAxis, Math.cos(a)),
                        U1.Vector3.Scale(minAxis, Math.sin(a)));
                    p = v;
                    p.Add(cnt);

                    plist.push(p);
                    if (a >= e_a)
                        break;
                }

                this._path3 = plist;
            }

            return this._path3;
        }
        //#endregion

        //#region Methods 
        protected OnPropertyChanged(prop: string) {
            super.OnPropertyChanged(prop);
            this._path3 = null;
        }
        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);
            this.Thickness = props.GetFloat("Thickness", this.thickness);
            this.Center = props.GetValue(U1.Vector3, "Center", this.center);
            this.Normal = props.GetValue(U1.Vector3, "Normal", this.normal);
            this.Radius = props.GetFloat("Radius", this.radius);
        }
        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);

            props.SetFloat("Thickness", this.thickness);
            props.SetValue("Center", this.center);
            props.SetValue("Normal", this.normal);
            props.SetFloat("Radius", this.radius);
        }
        //#endregion

        // #region Transform
        public SetTransform(xform: U1.Matrix4) {
            CdEntity.SetTransformCircle(this, xform);
        }
        // #endregion

        public UpdateGeoms(result: Array<U1.Geoms.GeEntity>): void {
            super.UpdateGeoms(result);
            var color = this.Color;
            var isFilled = this.IsFilled;
            var thick = this.LineThick;
            var linePattern = this.LinePattern;
            var fillColor = this.FillColor;
            var points = this.Path3;

            var geEnt: U1.Geoms.GeEntity = null;
            var snapPoints: U1.Geoms.GeSnapPoint[] = [
                new U1.Geoms.GeSnapPoint(this.center, U1.Geoms.GeSnapTypeEnum.Center),
                new U1.Geoms.GeSnapPointArr([points[0], points[points.length - 1]], U1.Geoms.GeSnapTypeEnum.Center)

            ];
            if (isFilled) {
                geEnt = new U1.Geoms.GePolygonFill(
                    {
                        fillColor: fillColor,
                        color: color,
                        thick: thick,
                        points: points,
                        linePattern: linePattern
                    });
            }
            else {
                geEnt = new U1.Geoms.GePolygon({
                    color: color,
                    thick: thick,
                    points: points,
                    linePattern: linePattern
                });
            }
            geEnt.SnapPoints = snapPoints;

            result.push(geEnt);
        }
    }
    U1.UDocument.Creaters["CdCircle"] = CdCircle;
}