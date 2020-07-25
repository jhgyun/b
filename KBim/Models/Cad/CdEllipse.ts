/// <reference path="cdentity.ts" />
namespace KBim {
    export class CdEllipse extends CdEntity {
        //#region Fields    
        private center = new U1.Vector3();
        private normal = U1.Vector3.UnitZ;
        private majorAxis = U1.Vector3.UnitX; 
        private ratio = 1;
        private start = 0;
        private end = 0;
        private _path3: U1.Vector3[]  = null;
        //#endregion

        // #region Props 
        public get Center(): U1.Vector3 {
            return this.center;
        }
        public set Center(value: U1.Vector3) {
            this.SetProperty("Center", "center", value);
        }
      
        public get Normal(): U1.Vector3 {
            return this.normal;
        }
        public set Normal(value: U1.Vector3) {
            this.SetProperty("Normal", "normal", value);
        }
        public get MajorAxis(): U1.Vector3 {
            return this.majorAxis;
        }
        public set MajorAxis(value: U1.Vector3) {
            this.SetProperty("MajorAxis", "majorAxis", value);
        }
        public get Ratio(): number {
            return this.ratio;
        }
        public set Ratio(value: number) {
            this.SetProperty("Ratio", "ratio", value);
        }
        public get Start(): number {
            return this.start;
        }
        public set Start(value: number) {
            this.SetProperty("Start", "start", value);
        }
        public get End(): number {
            return this.end;
        }
        public set End(value: number) {
            this.SetProperty("End", "end", value);
        }
       
        get MinorAxis(): U1.Vector3 {
            var minAxis = U1.Vector3.Cross(this.Normal, this.majorAxis);
            minAxis = U1.Vector3.Scale(minAxis, this.Ratio);
            return minAxis;
        } 
        get Path3(): U1.Vector3[]
        {
            if (this._path3 == null) {
                var minAxis = this.MinorAxis;// Vector3.Cross(Normal, majorAxis); 
                var majAxis = this.MajorAxis;
                var cnt = this.Center;
                var rat = this.Ratio;

                var s_a = this.Start;
                var e_a = this.End;

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

                var plist = new Array<U1.Vector3>();
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
            this.Center = props.GetValue(U1.Vector3, "Center", this.center);
            this.Normal = props.GetValue(U1.Vector3, "Normal", this.normal);
            this.MajorAxis = props.GetValue(U1.Vector3, "MajorAxis", this.majorAxis);
            this.Ratio = props.GetFloat("Ratio", this.ratio);
            this.Start = props.GetFloat("Start", this.start);
            this.End = props.GetFloat("End", this.end);
        }
        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);
             
            props.SetValue("Center", this.center);
            props.SetValue("Normal", this.normal); 
            props.SetValue("MajorAxis", this.majorAxis);
            props.SetFloat("Ratio", this.ratio); 
            props.SetFloat("Start", this.start); 
            props.SetFloat("End", this.end); 
        }
        //#endregion

        // #region Transform
        public UpdateGeoms(result: Array<U1.Geoms.GeEntity>): void {
            super.UpdateGeoms(result);
            var color = this.Color;
            var isFilled = this.IsFilled;
            var thick = this.LineThick;
            var linePattern = this.LinePattern;
            var fillColor = this.FillColor;
            var points = this.Path3;

            var geEnt: U1.Geoms.GeEntity = null;
            var snapPoints: U1.Geoms.GeSnapPoint[] = []
            {
                new U1.Geoms.GeSnapPoint(this.Center, U1.Geoms.GeSnapTypeEnum.Center),
                    new U1.Geoms.GeSnapPointArr([points[0], points[points.length - 1]], U1.Geoms.GeSnapTypeEnum.End)

            };

            if (isFilled)
                geEnt = new U1.Geoms.GePolylineFill({
                    fillColor: fillColor,
                    color: color,
                    thick: thick,
                    points: points,
                    linePattern: linePattern
                });
            else
                geEnt = new U1.Geoms.GePolyline(
                    {
                        color: color, thick: thick, points: points, linePattern: linePattern
                    });

            geEnt.SnapPoints = snapPoints;

            result.push(geEnt);
        }
        // #endregion
    }

    U1.UDocument.Creaters["CdEllipse"] = CdEllipse;
}