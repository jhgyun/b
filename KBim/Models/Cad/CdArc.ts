/// <reference path="cdentity.ts" />
namespace KBim
{
    export class CdArc extends CdEntity
    {
        //#region Fields 
        private center = new U1.Vector3();
        private normal = U1.Vector3.UnitZ;
        private startAngle = 0;
        private endAngle = 0;
        private radius = 1; 
        private path3: U1.Vector3[];
        //#endregion

        // #region Props
         
        public get Center()
        {
            return this.center;
        }
        public set Center(value: U1.Vector3)
        {
            this.SetProperty("Center", "center", value); 
        }
        public get Normal()
        {
            return this.normal;
        }
        public set Normal(value: U1.Vector3)
        {
            this.SetProperty("Normal", "normal", value);
        }

        public get StartAngle(): number
        {
            return this.startAngle;
        }
        public set StartAngle(value: number)
        {
            this.SetProperty("StartAngle","startAngle", value);
        }
        public get EndAngle(): number
        {
            return this.endAngle;
        }
        public set EndAngle(value: number)
        {
            this.SetProperty("EndAngle","endAngle", value);
        }
        public get Radius()
        {
            return this.radius;
        }
        public set Radius(value: number)
        {
            this.SetProperty("Radius","radius", value);
        }

        public get Path(): U1.Vector3[]
        {
            if (this.path3 == null || this.path3.length === 0)
            {
                if (this.path3 == null)
                    this.path3 = [];

                var yAxis: U1.Vector3 = CdArc[".path.uy"] || (CdArc[".path.uy"] = U1.Vector3.UnitY);
                var xAxis: U1.Vector3 = CdArc[".path.ux"] || (CdArc[".path.ux"] = U1.Vector3.UnitX);
                var v: U1.Vector3 = CdArc[".path.v"] || (CdArc[".path.v"] = U1.Vector3.UnitX);
                var v0: U1.Vector3 = CdArc[".path.v0"] || (CdArc[".path.v0"] = U1.Vector3.Zero);
                var v1: U1.Vector3 = CdArc[".path.v1"] || (CdArc[".path.v1"] = U1.Vector3.Zero);
                var m: U1.Matrix4 = CdArc[".path.m"] || (CdArc[".path.m"] = U1.Matrix4.Identity);

                U1.GeometryHelper3.GetArbitraryAxis(this.Normal, xAxis, yAxis);

                var cnt = this.Center;

                var s_a = this.StartAngle;
                var e_a = this.EndAngle;

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
                
                var plist = this.path3;
                var norm = this.Normal;
                var rad = this.Radius;

                m.SetIdentity();
                v.SetZero();

                for (var a = s_a; ; a += delt)
                {
                    if (a >= e_a)
                        a = e_a;

                    v.SetAdd(v0.SetScale(xAxis, Math.cos(a)), v1.SetScale(yAxis, Math.sin(a)));

                    var p = U1.Vector3.Scale(v, rad);
                    p.Add(cnt);

                    plist.push(p);
                    if (a >= e_a)
                        break;
                }
            }

            return this.path3;
        }

        //#endregion

        //#region Methods
        public get PropertyCategory()
        {
            return "Arc";
        }

        protected OnGeometryChanged(source: U1.UGeomElement)
        {
            super.OnGeometryChanged(source);
            this.path3 = null;
        }

        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);

            this.Center = props.GetValue(U1.Vector3, "Center", this.center);
            this.Normal = props.GetValue(U1.Vector3, "Normal", this.normal);
            this.StartAngle = props.GetFloat("StartAngle", this.startAngle); 
            this.EndAngle = props.GetFloat("EndAngle", this.endAngle); 
            this.Radius = props.GetFloat("Radius", this.radius); 
        }
        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);

            props.SetValue("Center", this.center);
            props.SetValue("Normal", this.normal);
            props.SetFloat("StartAngle", this.startAngle);
            props.SetFloat("EndAngle", this.endAngle);
            props.SetFloat("Radius", this.radius); 
        }  
 
        protected OnPropertyChanged(name: string)
        {
            if (name === "IsMouseOver")
            {
            }
            else
            {
                if (name === "Center" ||
                    name === "EndAngle" ||
                    name === "StartAngle" ||
                    name === "Normal"
                )
                {
                    this.InvokeTransformChanged();
                    this.InvokeGeometryChanged();
                }
            }
            super.OnPropertyChanged(name);
        }
        protected UpdateBounding()
        {
            var path = this.Path;
            if (path.length > 0)
            {
                var lbb: U1.BoundingBox = CdArc[".ub.lbb"] || (CdArc[".ub.lbb"] = new U1.BoundingBox());
                lbb.SetCreateFromPoints(path);
                lbb.Max.Z += 0.1;

                this.m_boundingBox.SetCreateFromPoints(path);
                this.m_boundingBox.Max.Z += 0.1;
                this.m_boundingSphere.SetCreateFromPoints(path);
            }
        }
        public UpdateGeoms(result: U1.Geoms.GeEntity[]): void {
            super.UpdateGeoms(result);
            var color = this.Color;
            var isFilled =this.IsFilled;
            var thick = this.LineThick;
            var linePattern = this.LinePattern;
            var fillColor = this.FillColor;

            var points = this.Path;
            var snapPoints = [
                new U1.Geoms.GeSnapPoint(this.Center, U1.Geoms.GeSnapTypeEnum.Center),
                new U1.Geoms.GeSnapPoint(points[0], U1.Geoms.GeSnapTypeEnum.End),
                new U1.Geoms.GeSnapPoint(points[points.length - 1], U1.Geoms.GeSnapTypeEnum.End)
            ]; 

            var geomEnt: U1.Geoms.GeEntity = null;
            if (isFilled)
                geomEnt = new U1.Geoms.GePolylineFill({ fillColor: fillColor, color: color, thick: thick, points: points, linePattern: linePattern });
            else
                geomEnt = new U1.Geoms.GePolyline({ color: color, thick: thick, points: points, linePattern: linePattern });

            if (geomEnt != null) {
                geomEnt.SnapPoints = snapPoints;
                result.push(geomEnt);
            }
        }
        //#endregion

        //#region Transform
        public SetTransform(xform: U1.Matrix4)
        {
            CdEntity.SetTransformCircle(this, xform); 
        }
        //#endregion 
    }

    U1.UDocument.Creaters["CdArc"] = CdArc;
}