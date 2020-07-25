/// <reference path="cdentity.ts" />
namespace KBim
{
    export class CdPolyline2d extends CdEntity
    {
        private flag =  0 ;
        private elevation =  0 ;
        private normal = U1.Vector3.UnitZ ;

        private path3: U1.Vector3[];
        private snapPoints: U1.Vector3[];
        private path2: U1.Vector2[];

        get Flag()
        {
            return this.flag;
        }
        set Flag(value)
        {
            this.SetProperty("Flag","flag", value);
        }

        get Elevation()
        {
            return this.elevation;
        }
        set Elevation(value)
        {
            this.SetProperty("Elevation","elevation", value);
        }

        get Vertices(): CdVertex2d[]
        {
            return this.Children
                .filter(o_ => o_ instanceof CdVertex2d)
                .OrderBy((o_: CdVertex2d) => o_.Index) as CdVertex2d[];
        }


        get Normal()
        {
            return this.normal;
        }
        set Normal(value)
        {
            this.SetProperty("Normal","normal", value);
        }

        get SnapPoints()
        {
            if (this.snapPoints == null)
            {
                this.snapPoints =
                    this.Vertices.map(o_ => o_.Position.Clone());
            }

            return this.snapPoints;
        }

        get Path3()
        {
            if (this.path3 == null)
            {
                var z = this.Elevation;
                var polyline = this.GetPath();
                this.path3 = polyline
                    .map(o_ => new U1.Vector3(o_, z));
            }

            return this.path3;
        }
        get Path2()
        {
            if (this.path2 == null)
            {
                var result = this.GetPath();
                this.path2 = result;
            }

            return this.path2;
        }

        private GetPath(): U1.Vector2[]
        {
            var vs = this.Vertices;
            var result: U1.Vector2[] = [];

            if (vs.length == 0)
                return result;

            result.push(vs[0].Position.XY());

            for (var i = 1; i <= vs.length; i++)
            {
                if (i == vs.length && !this.IsClosed)
                    break;

                var pv = vs[i - 1];
                var cv = vs[i % vs.length];

                if (U1.Vector3.DistanceSquared(pv.Position, cv.Position) < 0.00001)
                    continue;

                if (cv.Bulge < -0.001 || cv.Bulge > 0.001)
                {
                    var start = pv.Position.XY();
                    var end = cv.Position.XY();

                    var bulge = U1.Vector2.Distance(start, end) / 2 * cv.Bulge;

                    var arc = new U1.Arc2(start, end, bulge);
                    var tvs = arc.Slice(16);

                    for (var j = 1; j < tvs.length; j++)
                    {
                        result.push(tvs[j]);
                    }
                }
                else
                {
                    if (i != vs.length)
                        result.push(cv.Position.XY());
                }
            }
             
            return result;
        }
        get IsClosed()
        {
            return (this.Flag & 1) == 1;
        }
        set IsClosed(value)
        {
            if (value)
                this.Flag = (this.Flag | 1);
            else
                this.Flag = (this.Flag & ~1);
        }

        get NumberOfVertex()
        {
            return this.Vertices.length;
        }

        public GetArcSegments(): U1.Arc2[] 
        {
            var result: U1.Arc2[] = [];

            var vs = this.Vertices;
            if (vs.length == 0)
                return result;


            var z = this.Elevation;

            for (var i = 1; i <= vs.length; i++)
            {
                if (i == vs.length && !this.IsClosed)
                    break;

                var pv = vs[i - 1];
                var cv = vs[i % vs.length];

                var start = pv.Position.XY();
                var end = cv.Position.XY();

                //if (XVector2.Distance(start, end) < 0.000001)
                //    continue;

                var bulge = 0.0;
                if (cv.Bulge != 0)
                    bulge = U1.Vector2.Distance(start, end) / 2 * cv.Bulge;

                var arc = new U1.Arc2(start, end, bulge);
                arc.Tag = i - 1;

                result.push(arc);
            }
            return result;
        }
        public SetArcSegments(arcs: U1.Arc2[])
        {
            for (var v of this.Vertices.slice())
            {
                v.Detach();
            }

            var v_idx = this.NextVertexIndex;
            for (var i = 0; i < arcs.length; i++)
            {
                var s = arcs[i].Start;
                var e = arcs[i].End;
                var bulge = arcs[i].Bulge;
                bulge /= U1.Vector2.Distance(s, e) / 2;

                this.AppendVertex(s, v_idx++, bulge);
            }
        }
        public GetArcSegment(seg_num: number): U1.Arc2
        {
            var vs = this.Vertices;
            if (seg_num < 0 || seg_num >= vs.length)
                return null;

            var s_num = seg_num;
            var e_num = seg_num + 1;
            if (e_num >= vs.length) e_num = 0;

            var s_v = vs[s_num];
            var e_v = vs[e_num];
            var bulge = 0.0;
            if (e_v.Bulge != 0 && U1.Vector2.Distance(s_v.Position.XY(), e_v.Position.XY()) > 0.00001)
            {
                bulge = e_v.Bulge * U1.Vector2.Distance(s_v.Position.XY(), e_v.Position.XY()) / 2;
            }

            var result = new U1.Arc2();

            result.Start = s_v.Position.XY();
            result.End = e_v.Position.XY();
            result.Bulge = bulge;
            return result; 
        }
        public SplitSegmentAt(seg_num: number, p: U1.Vector2): CdVertex2d
        {
            var vs = this.Vertices;
            var seg_arc = this.GetArcSegment(seg_num);
            var segs = U1.Arc2.SplitWithPoint(seg_arc, p);
            if (segs.length != 2)
                return null;

            var b0 = segs[0].Bulge;
            if (b0 != 0 && U1.Vector2.Distance(segs[0].Start, segs[0].End) > 0.00001)
                b0 = b0 / (U1.Vector2.Distance(segs[0].Start, segs[0].End) / 2);

            var b1 = segs[0].Bulge;
            if (b1 != 0 && U1.Vector2.Distance(segs[1].Start, segs[1].End) > 0.00001)
                b1 = b1 / (U1.Vector2.Distance(segs[1].Start, segs[1].End) / 2);

            var v0 = vs[seg_num];
            var v1 = vs[(seg_num + 1) % vs.length];
            v1.Bulge = b1;

            return this.InsertVertexAt(v0, p, b0);
        }
        public SplitSegmentAt_1(seg_num: number, u: number): CdVertex2d
        {
            if (u <= 0 || u >= 1)
                return null;

            var seg_arc = this.GetArcSegment(seg_num);
            if (seg_arc == null) return null;

            return this.SplitSegmentAt(seg_num, seg_arc.GetPositionAtU(u));
        }
        protected OnPropertyChanged(name: string)
        {
            super.OnPropertyChanged(name);
            this.InvokeGeometryChanged();
        }
        protected OnGeometryChanged(source: U1.UGeomElement)
        {
            super.OnGeometryChanged(source);

            this.InvalidateBounding();
            this.path3 = null;
            this.snapPoints = null;
            this.path2 = null;
            this.m_invalidBounding = true;
        }
        protected TransmitChildPropertyChanged(source: U1.UNode, name: string)
        {
            if (source instanceof CdVertex2d)
                return false;
            return true;
        }
        protected OnChildPropertyChanged(source: U1.UNode, name: string)
        {
            if (source instanceof CdVertex2d)
                this.InvokePropertyChanged("Vertices");

            this.InvokeGeometryChanged();
        }
        protected OnChildAdded(child: U1.UNode)
        {
            super.OnChildAdded(child);
            this.InvokeGeometryChanged();
        }
        protected OnChildDeleting(element: U1.UNode)
        {
            super.OnChildDeleting(element);
            this.InvokeGeometryChanged();
        }
        private AppendVertex(p: U1.Vector2, indx: number, bulge = 0
        ): CdVertex2d
        {
            var nv = this.AddChild(CdVertex2d);
            nv.Bulge = bulge;
            nv.Position = new U1.Vector3(p.X, p.Y);
            nv.Index = indx;
            return nv;
        }

        get NextVertexIndex()
        {
            var num = 0;
            for (var v of this.Vertices)
            {
                num = num < v.Index ? v.Index : num;
            }
            num++;
            return num;
        }

        public AppendVertex1(p: U1.Vector2, bulge = 0): CdVertex2d
        {
            var num = this.NextVertexIndex;
            var nv = this.AddChild(CdVertex2d);
            nv.Bulge = bulge;
            nv.Position = new U1.Vector3(p.X, p.Y);
            nv.Index = num;

            return nv;
        }
        public InsertVertexAt(prev: CdVertex2d, p: U1.Vector2, bulge = 0): CdVertex2d
        {
            var vs = this.Vertices;
            var index = prev != null ? prev.Index + 1 : 0;
            for (var v of vs)
            {
                if (prev == null || prev.Index < v.Index)
                {
                    v.Index += 1;
                }
            }

            var nv = this.AddChild(CdVertex2d);
            nv.Bulge = bulge;
            nv.Position = new U1.Vector3(p.X, p.Y);
            nv.Index = index;

            return nv;
        }
        public SetVertices(ps: U1.Vector2[])
        {
            for (var v of this.Vertices)
            {
                v.Detach();
            }

            var v_idx = this.NextVertexIndex;
            for (var p of ps)
            {
                this.AppendVertex(p, v_idx++);
            }
        }

        protected UpdateBounding()
        {
            super.UpdateBounding();
            var elv = this.Elevation;

            var path = this.Vertices
                .map(o_ =>
                {
                    var pos = o_.Position;
                    return new U1.Vector3(pos.X, pos.Y, elv);
                });

            if (path.length > 0)
            {
                var lbb = U1.BoundingBox.CreateFromPoints(path, this.m_boundingBox);
                lbb.Max.Z += 0.1;
                this.m_boundingBox.CopyFrom(lbb);
                this.m_boundingSphere = U1.BoundingSphere.CreateFromBoundingBox(lbb);
            }
        }
      
        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);
            this.Flag       = props.GetInt("Flag", this.flag);
            this.Elevation  = props.GetFloat("Elevation", this.elevation);
            this.Normal = props.GetValue(U1.Vector3, "Normal", this.normal);
        }

        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props); 
            props.SetInt("Flag", this.flag);
            props.SetFloat("Elevation", this.elevation);
            props.SetValue("Normal", this.normal); 
        }

        /**
         * Offset
         * @param offset Right Direction
         */
        public Offset(offset: number): boolean
        {
            var vs = this.Vertices;
            var polygon = vs
                .map(o_ => o_.Position.XY());

            var offsetPolygon: U1.Vector2[];

            if (this.IsClosed)
            {
                offsetPolygon = U1.GeometryHelper2.OffsetPolygon(polygon, offset);
                if (offsetPolygon == null)
                    return false;

                var pgon = new U1.CGAL.Polygon2();
                pgon.Points = offsetPolygon;

                if (!pgon.IsSimple())
                {
                    pgon.MakeSimple();
                    offsetPolygon = pgon.Points;
                }
            }
            else
            {
                offsetPolygon = U1.GeometryHelper2.OffsetPolyline(polygon, offset);
                if (offsetPolygon == null)
                    return false;
            }

            for (var i = 0; i < vs.length && i < offsetPolygon.length; i++)  
            {
                vs[i].Position = new U1.Vector3(offsetPolygon[i]);
            }

            for (var i = offsetPolygon.length; i < vs.length; i++)
            {
                vs[i].Detach();
            }

            this.InvokeGeometryChanged();
            return true;
        }

        public CopyFrom(other: CdPolyline2d)
        {
            for (var p of this.Vertices)
            {
                p.Detach();
            }

            if (other == null)
                return;

            var prev = U1.Vector2.MinValue;
            var vs = other.Vertices;
            var isClosed = other.IsClosed;

            this.AddChildCopy(vs[0], vs[0].Name);

            for (var ci = 1; ci < vs.length; ci++)
            {
                var pi = ci - 1;
                var ni = ci < vs.length - 1 ? ci + 1 : 0;

                var pv = vs[pi];
                var cv = vs[ci];
                var nv = vs[ni];

                var pp = pv.Position.XY();
                var cp = cv.Position.XY();
                var np = nv.Position.XY();

                //0.1 미터 이내
                if (U1.Vector2.Distance(pp, cp) < 0.1)
                    continue;

                if (ci == vs.length - 1 && U1.Vector2.Distance(cp, np) < 0.1)
                {
                    isClosed = true;
                    continue;
                }

                // 완전히 꺽인 상태 
                if (
                    ni > 0 &&
                    U1.Vector2.Dot(U1.Vector2.Subtract(pp, cp).Normalize(),
                        U1.Vector2.Subtract(np, cp).Normalize()
                    ) > 0.95
                )
                    continue;

                prev = cp;
                this.AddChildCopy(cv, cv.Name);
            }

            this.IsClosed = isClosed;
        }

        public SetTransform(xform: U1.Matrix4)
        {
            for (var v of this.Vertices)
            {
                v.Position = U1.Vector3.Transform(v.Position, xform);
            }
        }

        public UpdateGeoms(result: U1.Geoms.GeEntity[])
        {
            super.UpdateGeoms(result);

            var points = this.Path3;
            if (this.IsClosed &&
                points.length > 3 &&
                U1.Vector3.DistanceSquared(points[0], points[points.length - 1]) < 0.001)
            {
                points = points
                    .slice(0, points.length - 2);
            }

            var createArgs = {
                isClosed: this.IsClosed,
                color: this.Color,
                isFilled: this.IsFilled,
                thick: this.LineThick,
                linePattern: this.LinePattern,
                fillColor: this.FillColor,
                points: points
            };

            var snapPoints: U1.Geoms.GeSnapPoint[] = [
                new U1.Geoms.GeSnapPointArr(points, U1.Geoms.GeSnapTypeEnum.End)
            ];

            var geEnt: U1.Geoms.GeEntity;
            if (this.IsFilled)
            {
                if (this.IsClosed)
                    geEnt = new U1.Geoms.GePolygonFill(createArgs);
                else
                    geEnt = new U1.Geoms.GePolylineFill(createArgs);
            }
            else
            {
                if (this.IsClosed)
                    geEnt = new U1.Geoms.GePolygon(createArgs);
                else
                    geEnt = new U1.Geoms.GePolyline(createArgs);
            }

            geEnt.SnapPoints = snapPoints;
            result.push(geEnt);
        }


        get PropertyCategory()
        {
            return KBimStringService.LB_POLYLINE;
        }

        public Contans(loc: U1.Vector2)
        {
            var path2 = this.Path2;
            if (path2 == null || path2.length < 3)
                return false;

            var pgon = new U1.CGAL.Polygon2();
            pgon.Points = path2.slice();

            if (pgon.IsCW())
                pgon.Reverse();

            return pgon.HasOnBoundedSide(loc);
        }

        public ContansAll(locs: U1.Vector2[])
        {

            var path2 = this.Path2;
            if (path2 == null || path2.length < 3)
                return false;

            var src_min = this.BoundingBox.Min;
            var src_max = this.BoundingBox.Max;

            var tgt_min = U1.Vector2.MaxValue.Minimize(locs);
            var tgt_max = U1.Vector2.MinValue.Maximize(locs);

            if (tgt_max.X < src_min.X ||
                tgt_max.Y < src_min.Y ||
                tgt_min.X > src_max.X ||
                tgt_min.Y > src_max.Y)
                return false;

            var pgon = new U1.CGAL.Polygon2(path2);

            for (var loc of locs)
            {
                if (!pgon.HasOnBoundedSide(loc))
                    return false;
            }

            return true;
        }

        public ContansAny(locs: U1.Vector2[])
        {
            var path2 = this.Path2;
            if (path2 == null || path2.length < 3)
                return false;

            var src_min = this.BoundingBox.Min;
            var src_max = this.BoundingBox.Max;

            var tgt_min = U1.Vector2.MaxValue.Minimize(locs);
            var tgt_max = U1.Vector2.MinValue.Maximize(locs);

            if (tgt_max.X < src_min.X ||
                tgt_max.Y < src_min.Y ||
                tgt_min.X > src_max.X ||
                tgt_min.Y > src_max.Y)
                return false;

            var pgon = new U1.CGAL.Polygon2(path2);

            if (pgon.IsCW())
            {
                pgon.Reverse();
            }

            for (var loc of locs)
            {
                if (pgon.HasOnBoundedSide(loc))
                    return true;
            }

            return false;
        }

          _ShowTooltip: boolean; 
        public get ShowTooltip(): boolean {
            return this._ShowTooltip;
        }
        public set ShowTooltip(value: boolean) {
            this._ShowTooltip = value;
            this.InvokePropertyChanged("ShowTooltip");
        }

        public FID: string;
        public Color: U1.Color;
        public Tooltop: string;
        public Link: string; 
    }

    U1.UDocument.Creaters["CdPolyline2d"] = CdPolyline2d; 
}