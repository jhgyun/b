/// <reference path="cdentity.ts" />
namespace KBim {
    export class CdLine extends CdEntity {
        private start = U1.Vector3.Zero;
        private end = U1.Vector3.Zero;

        get Start() {
            return this.start;
        }
        set Start(value) {
            this.SetProperty("Start", "start", value);
        }

        get End() {
            return this.end;
        }
        set End(value) {
            this.SetProperty("End", "end", value);
        }

        protected OnPropertyChanged(name: string) {
            super.OnPropertyChanged(name);
            this.InvokeGeometryChanged();
        }

        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);

            this.Start = props.GetValue(U1.Vector3, "Start", this.start);
            this.End = props.GetValue(U1.Vector3, "End", this.end);
        }

        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);
            props.SetValue("Start", this.start);
            props.SetValue("End", this.end);
        }

        protected UpdateBounding() {
            super.UpdateBounding();

            var sp = this.Start;
            var ep = this.End;
            this.m_boundingBox.Min.SetMin(sp, ep);
            this.m_boundingBox.Max.SetMax(sp, ep);
            this.m_boundingSphere.SetCreateFromBoundingBox(this.m_boundingBox);
        }
        public SetTransform(xform: U1.Matrix4) {
            this.Start = U1.Vector3.Transform(this.Start, xform);
            this.End = U1.Vector3.Transform(this.End, xform);
        }
        public get PropertyCategory() {
            return KBimStringService.LB_LINE;
        }
        public GetProperties() {
            var result = super.GetProperties() || [];

            var p_tk = new U1.UPropDouble();
            p_tk.Source = this;
            p_tk.Category = KBimStringService.LB_POLYLINE;
            p_tk.Label = KBimStringService.LB_LINE_WIDTH;
            p_tk.GetValueFunc = (p_) => {
                return this.LineThick;
            };
            p_tk.SetValueFunc = (p_, v) => {
                this.LineThick = v;
            };

            var p_tc = new U1.UPropColor();
            p_tc.Source = this;
            p_tc.Category = KBimStringService.LB_POLYLINE;
            p_tc.Group = KBimStringService.COLOR;
            p_tc.Label = KBimStringService.LINE_COLOR;
            p_tc.GetValueFunc = (p_) => {
                return this.Color;
            };
            p_tc.SetValueFunc = (p_, v_) => {
                this.Color = v_;
            };

            //result.Add(thick_p); 
            //result.Add(strokeColor);
            //result.AddRange(GeometryProps());

            return result;
        }

        public UpdateGeoms(result: Array<U1.Geoms.GeEntity>) {
            super.UpdateGeoms(result);

            var color = this.Color;
            var isFilled = this.IsFilled;
            var thick = this.LineThick;
            var linePattern = this.LinePattern;
            var fillColor = this.FillColor;

            var sp = this.Start;
            var ep = this.End;

            var snapPoints: U1.Geoms.GeSnapPoint[] = [
                new U1.Geoms.GeSnapPointArr([sp, ep], U1.Geoms.GeSnapTypeEnum.End)
            ];

            var geLine = new U1.Geoms.GeLine();
            geLine.Start = sp;
            geLine.End = ep,
                geLine.Color = color;
            geLine.Thick = thick;
            geLine.LinePattern = linePattern;
            geLine.SnapPoints = snapPoints;
            result.push(geLine);

            return geLine;
        }
    }
    U1.UDocument.Creaters["CdLine"] = CdLine;
}