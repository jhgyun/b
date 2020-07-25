namespace U1.Meshes
{
    interface IMEdgOp extends MEdg
    {
        _face_?: MFace;
        _del_?: boolean;
        _floop_?: boolean;
    }
    interface IMFaceOp extends MFace
    {
        _orgn_?: MFace;
        _del_?: boolean;
    }
    interface IMVertOp extends MVert
    { 
        _old_?: boolean; 
    }
    interface IMIsectEdgOp
    {
        edge?: IMEdgOp;
        state?: number
    }
    export class MMeshOp  
    { 
        public static Epsilon = 0.00001;
        public static SqEpsilon = MMeshOp.Epsilon * MMeshOp.Epsilon;
        public static EpVector3 = new Vector3(MMeshOp.Epsilon, MMeshOp.Epsilon, MMeshOp.Epsilon);

        public static Min_FaceArea = 0.0001;
        private static ang_delt = Math.PI / 50; 
         
        private static V_DistanceToLoop(v: MVert, loop_start: IMEdgOp)
        { 
            let vs = loop_start.GetLoopVs();
            let dir1 = new Vector3();
            let dir2 = new Vector3();
            let p = v.P;
            let min_dist = Number.MAX_VALUE;

            for (let i = 0; i < vs.length; i++)
            {
                let ni = i + 1;
                if (ni >= vs.length) ni = 0;

                let p1 = vs[i].P;
                let p2 = vs[ni].P;

                dir1.SetSubtract(p2, p1);
                dir2.SetSubtract(p, p1); 

                let t = Vector3.Dot(dir1, dir2) / Vector3.Dot(dir1, dir1);
                let dist = 0;

                if (t >= 1 + MMeshOp.Epsilon)
                    continue;

                if (t < MMeshOp.Epsilon)
                    dist = Vector3.DistanceSquared(p1, p);
                else
                {
                    dist = Math.pow(dir2.Length(), 2) - Math.pow(t * dir1.Length(), 2);
                }

                if (dist < min_dist)
                {
                    min_dist = dist;
                }
            }             

            return Math.sqrt(min_dist);
        }
        private static E_Split(edg: IMEdgOp, amount: number): MEdg
        {
            if (amount <= 0 || amount >= 1) return ;

            let nx = edg.Next as IMEdgOp;
            let op = edg.Opp as IMEdgOp;
            
            let mesh = edg.Parent as MMesh;
            let v1 = edg.V;
            let v2 = nx.V;

            let mv = mesh.NewVert(); 
            mv.P = Vector3.Lerp(v1.P, v2.P, amount);
            if (mv.P.X == 2.5)
            {
                let k = 0;
            }
            let n_nx = mesh.NewEdge() as IMEdgOp;
            n_nx.V = mv;
            n_nx.Next = edg.Next;
            edg.Next = n_nx;
            n_nx._face_ = edg._face_;

            n_nx.UV = Vector2.Lerp(edg.UV, nx.UV, amount); 

            if (op != null)
            {
                let op_nx = op.Next;
                let n_op = mesh.NewEdge() as IMEdgOp; 

                n_op.UV = Vector2.Lerp(op_nx.UV, op.UV, amount);  
                n_op._face_ = op._face_;

                n_op.V = mv;
                n_op.Next = op_nx;
                op.Next = n_op;

                n_op.Opp = edg;
                edg.Opp = n_op; 

                n_nx.Opp = op;
                op.Opp = n_nx;
            }

            return n_nx;
        }
        private static E_Connect(a: IMEdgOp, b: IMEdgOp): MEdg
        {
            let a_next = a.Next as IMEdgOp;
            let b_next = b.Next as IMEdgOp;

            let mesh = a.Parent as MMesh;

            let n_edg = mesh.NewEdge() as IMEdgOp;
            let n_opp = mesh.NewEdge() as IMEdgOp;

            n_edg.V = a_next.V;
            n_edg.UV = a_next.UV;

            n_opp.V = b_next.V;
            n_opp.UV = b_next.UV;

            n_edg.Opp = n_opp;
            n_opp.Opp = n_edg;

            a.Next = n_edg;
            n_edg.Next = b_next;

            b.Next = n_opp;
            n_opp.Next = a_next; 

            n_edg._face_ = a_next._face_;
            n_opp._face_ = b_next._face_;

            return n_edg;
        }
        private static E_IsSameLoop(a: IMEdgOp, b: IMEdgOp): boolean
        { 
            let cur: MEdg = a; 
            do
            {
                if (cur === b) return true;
                cur = cur.Next;
            }
            while (cur != a && cur != null);

            return false;
        } 
        private static E_SplitWithPlane(edge: IMEdgOp, plane: Plane): MEdg
        {
            let v1 = edge.V.P;
            let v2 = edge.Next.V.P;
            let d1 = plane.DotCoordinate(v1);
            let d2 = plane.DotCoordinate(v2);
            
            if (d2 > -MMeshOp.Epsilon && d2 < MMeshOp.Epsilon)
                return edge.Next;

            if (Math.abs(d1) < MMeshOp.Epsilon)
                return;

            if (d1 * d2 >= 0)
                return;
            
            let dir = Vector3.Subtract(v2, v1);
            let amount = plane.IntersectsLine(v1, dir);

            let result = MMeshOp.E_Split(edge, amount); 

            return result;
        } 
        private static E_Remove(edg: IMEdgOp)
        {
            let opp = edg.Opp;
            let f1: MFace = (edg as any)._face;
            let f2: MFace = (opp as any)._face;

            let loop1 = edg.GetLoop();
            let loop2 = opp.GetLoop();

            loop1.shift();
            loop2.shift();

            loop2[loop2.length - 1].Next = loop1[0];
            loop1[loop1.length - 1].Next = loop2[0];

            if (f1.Loops[0] == edg)
            {
                loop2[loop2.length - 1].Next = edg;
                edg.Next = edg.Next.Next;
            }

            let holes2 = f2.Loops;
            holes2.shift();

            if (holes2.length > 0)
            {
                let nloops = f1.Loops.slice();
                nloops.push(...holes2);
                f1.Loops = nloops;
            }


            f2.Loops = null;
        }
        private static E_ReLoop(start: IMEdgOp, es_len: number)
        { 
            let cur = start; 
            start._floop_ = true;
             
            for (let i = 0; i < es_len; i++)
            {
                let next = cur.Next as IMEdgOp;
                let nextOpp = next.Opp as IMEdgOp;

                while (next._del_ && next !== start)
                {
                    if (nextOpp == null || nextOpp._face_ !== start._face_)
                    {
                        start.Next = null;
                        return;
                    }
                    next = next.Opp.Next;
                    if (next === cur || next === cur.Opp)
                        break;
                }

                cur.Next = next;
                cur = next; 
                cur._floop_ = true;

                if (cur === start)
                    break;
            }

        }
        private static E_RemoveTmpVert(start: IMEdgOp)
        {
            let cur = start;  
            do
            {
                let last = cur;
                let next = cur.Next as IMEdgOp;  

                while (next != start && next._del_)
                {
                    last = next;
                    next = next.Next;  
                }

                cur.Next = next;
                cur.Opp = last.Opp;  
                cur = next; 
            }
            while (cur !== start);


        }
        private static E_GetLoopArea(loop: IMEdgOp, norm: Vector3 ): number
        {
            let u = Vector3.Zero;
            let v = Vector3.Zero;

            GeometryHelper3.GetArbitraryAxis(norm, u, v);
            let vs = loop.GetLoopVs();
            let tarea = 0;

            if (vs.length > 2)
            {
                let pgon = vs.map(o_ =>
                {
                    return new Vector2(Vector3.Dot(u, o_.P), Vector3.Dot(v, o_.P));
                });
                return CGAL.Polygon2.GetArea(pgon);
            }

            return 0;
        }
        private static F_SplitWithPlane(face: IMFaceOp, plane: Plane, faces?: IMFaceOp[]): boolean
        {
            let mesh = face.Mesh;
            let fc = 0;
            let bc = 0;
            for (let e of face.Loops[0].GetLoop())
            {
                let d = plane.DotCoordinate(e.V.P);
                if (d > 0) fc++;
                else if (d < 0) bc++;
            } 

            if (fc == 0 || bc == 0)
                return false;

            let splited_es: IMIsectEdgOp[] = [];
            let bisect = new Vector3();
            face.GetNorm(bisect);

            bisect.SetCross(bisect, plane.Normal);

            let loops = face.Loops;
            let outers: MEdg[] = [loops[0]];
            let holes: MEdg[] = loops.filter((o_, i_) => i_ > 0);

            let contains_loop = (e_: MEdg, loops_: MEdg[]) =>
            {
                for (let i = 0; i < loops_.length; i++)
                { 
                    if (MMeshOp.E_IsSameLoop(e_, loops_[i]))
                        return true;
                }

                return false;
            };
            let remove_loop = (e_: MEdg, loops_: MEdg[]) =>
            {
                for (let i = loops_.length - 1; i >= 0; i--)
                {
                    if (MMeshOp.E_IsSameLoop(loops_[i], e_))
                    {
                        loops_.splice(i, 1);
                    }
                }
            };

            for (let e_start of loops)
            {
                let es = e_start.GetLoop();

                let pi = es.length - 1;
                for (let ci = 0; ci < es.length; pi = ci, ci++)
                {
                    let e = es[ci];

                    let edg = MMeshOp.E_SplitWithPlane(e, plane);
                    if (edg == e.Next)
                    {
                        let p0 = e.V.P;
                        let p2 = edg.Next.V.P;

                        let d0 = plane.DotCoordinate(p0);
                        let d1 = plane.DotCoordinate(p2);

                        if (Math.abs(d0) < MMeshOp.Epsilon && Math.abs(d1) < MMeshOp.Epsilon)
                            continue;

                        let isect_e: IMIsectEdgOp = {};
                        isect_e.state = d0 > MMeshOp.Epsilon ? 1 : (d0 < -MMeshOp.Epsilon ? -1 : 0);
                        isect_e.state += d1 > MMeshOp.Epsilon ? 1 : (d1 < -MMeshOp.Epsilon ? -1 : 0);
                        isect_e.edge = e;

                        splited_es.push(isect_e);
                    }
                    else if (edg != null)
                    {
                        splited_es.push({ state: 0, edge: e });
                    }
                } 
            } 

            splited_es.sort((a_, b_) =>
            {
                let p1 = a_.edge.Next.V.P;
                let p2 = b_.edge.Next.V.P;

                let d1 = Vector3.Dot(p1, bisect);
                let d2 = Vector3.Dot(p2, bisect);

                if (d1 === d2) return 0;

                return d1 < d2 ? -1 : 1; 
            });
            

            let edges: MEdg[] = [];

            for (let i = 0; i < splited_es.length - 1; i++)
            {
                let isec0 = splited_es[i];
                let isec1 = splited_es[i + 1];

                if (Math.abs(isec0.state) === 1 &&
                    Math.abs(isec1.state) === 1)
                {
                    continue;
                }

                let e0 = isec0.edge;
                let e1 = isec1.edge;

                let nedg = MMeshOp.E_Connect(e0, e1);
                remove_loop(e0, holes);
                remove_loop(e1, holes);

                if (!contains_loop(e0, outers))
                    outers.push(e0);

                if (!contains_loop(e1, outers))
                    outers.push(e1);

                if (isec1.state == 2 || isec1.state == -2)
                {
                    isec1.edge = nedg;
                }
                else
                {
                    i++;
                }
            }

            type f_datatype = {
                isFront: boolean,
                loops: MEdg[]
            } 

            let f_data: f_datatype[] = [];

            for (let j = 0; j < outers.length; j++)
            {
                let isFront = false;
                for (let v of outers[j].GetLoopVs())
                {
                    let dt = plane.DotCoordinate(v.P);
                    if (dt == 0) continue;
                    isFront = (dt > 0);
                    break;
                }

                f_data[j] = {
                    isFront: isFront,
                    loops: [outers[j]]
                };
            }

            for (let j = 0; j < holes.length; j++)
            {
                let hole_s = holes[j];
                let outer: f_datatype = null;
                let min_dist = Number.MAX_VALUE;
                for (let fd of f_data)
                {
                    let dist = MMeshOp.V_DistanceToLoop(hole_s.V, fd.loops[0]);
                    if (dist < min_dist)
                    {
                        min_dist = dist;
                        outer = fd;
                    }
                }

                if (outer != null)
                {
                    outer.loops.push(hole_s);
                }
            }

            for (let i = 0; i < f_data.length; i++)
            {
                if (i == 0)
                {
                    face.Loops = f_data[i].loops;
                }
                else
                {
                    let nface = mesh.NewFace() as IMFaceOp;
                    nface.Loops = f_data[i].loops;
                    nface.SG = face.SG;
                    nface.FG = face.FG;
                    nface.MG = face.MG;
                    nface._orgn_ = face._orgn_; 

                    if (faces !== undefined)
                        faces.push(nface);
                }
            }
            return true;
        }
       
        private static F_SplitWithFace(face1: MFace, face2: MFace, faces?: IMFaceOp[]): boolean
        {
            let s_ = MMeshOp['.fswf.'] || ( MMeshOp['.fswf.'] = {} );

            let bbx1: BoundingBox = s_.bbx1 || (s_.bbx1 = new BoundingBox());
            let bbx2: BoundingBox = s_.bbx2 || (s_.bbx2 = new BoundingBox());
            let offset: Vector3 = s_.ofs || (s_.ofs = new Vector3(MMeshOp.Epsilon, MMeshOp.Epsilon, MMeshOp.Epsilon));

            face1.GetBBX(bbx1);
            face2.GetBBX(bbx2);

            bbx1.Min.Subtract(offset);
            bbx1.Max.Add(offset);
             
            if (!bbx1.IntersectsBoundingBox(bbx2))
                return false;

            let norm: Vector3 = s_.norm || (s_.norm = new Vector3());
            let plane: Plane = s_.plane || (s_.plane = new Plane());

            face2.GetPlane(plane);
               
            return MMeshOp.F_SplitWithPlane(face1, plane, faces);
        }
        private static F_IsectRay(face: MFace, p: Vector3, dir: Vector3, res?: Vector3): Vector3
        {
            let s_ = MMeshOp['.fir.'] || (MMeshOp['.fir.'] = {});
            let sp: BoundingSphere = s_.sp || (s_.sp = new BoundingSphere());
            let isct: Vector3 = s_.isct || (s_.isct = new Vector3());
            let fpln: Plane = s_.fpln || (s_.fpln = new Plane());

            isct = res || isct;

            let bbx = face.GetBBX();
            sp.Center.SetAdd(bbx.Min, bbx.Max).Scale(0.5);
            sp.Radius = Vector3.Distance(bbx.Max, bbx.Min);

            let distsq = Ray3.DistanceSquared1(p, dir, sp.Center);
            if (distsq > sp.Radius * sp.Radius)
                return null;
             
            let plane = face.GetPlane(fpln); 
            let t = plane.IntersectsLine(p, dir);
            if (t == null || t < -MMeshOp.Epsilon)
                return null;

            isct.SetScaleAdd(p, t, dir); 

            let stat = MMeshOp.F_Contains(face, isct);
            if (stat == FaceIntersectionTypeEnum.Outside)
                return null;

            return isct;
        }
        private static F_Contains(face: MFace, p: Vector3): U1.FaceIntersectionTypeEnum
        {
            let s_ = MMeshOp[".fc."] || (MMeshOp[".fc."] = {});

            let u: Vector3 = s_["u"] || (s_["u"]= new Vector3());
            let v: Vector3 = s_["v"] || (s_["v"] = new Vector3()); 

            let pln_norm: Vector3 = s_["pn"] || (s_["pn"]  = new Vector3());
            let crs: Vector3 = s_["crs"] || (s_["crs"]  = new Vector3());
            let pln: Plane = s_["pln"] || (s_["pln"]  = new Plane());
            let points:  Vector3[] = s_["points"] || (s_["points"] = []);
            let f_norm: Vector3 = s_["f_norm"] || (s_["f_norm"] = new Vector3());
            let sqEp = MMeshOp.SqEpsilon;

            f_norm = face.GetNorm(f_norm);
            GeometryHelper3.GetArbitraryAxis(f_norm, u, v); 

            for (let a = 0; a < Math.PI; a += MMeshOp.ang_delt)
            {
                let ca = Math.cos(a);
                let sa = Math.sin(a);

                pln_norm.SetScale(u, ca);
                pln_norm.ScaleAdd(sa, v);
                 
                pln.SetFromPointNormal(p, pln_norm); 
                points = MMeshOp.F_IsectPlane(face, pln, points);

                if (points.length == 0)
                    return FaceIntersectionTypeEnum.Outside;

                crs.SetCross(pln_norm, f_norm); 

                let fc = 0;
                let bc = 0; 
                for (let i = 0; i < points.length; i++)
                {
                    let iscp = points[i]; 
                    iscp.Subtract(p);

                    if (iscp.LengthSquareduared() < sqEp)
                        return FaceIntersectionTypeEnum.Boundary;

                    let t1 = Vector3.Dot(crs, iscp);
                    if (t1 < 0) bc++;
                    else if (t1 > 0) fc++; 
                } 

                if (fc % 2 != bc % 2) continue;

                if (fc % 2 == 1)
                    return FaceIntersectionTypeEnum.Inside;

                return FaceIntersectionTypeEnum.Outside; 
            }

            return FaceIntersectionTypeEnum.Outside;
        }
        private static F_IsectPlane(face: MFace, pln: Plane, res?:Vector3[]): Vector3[]
        {
            let dir: Vector3 = MMeshOp[".fip.dir"] || (MMeshOp[".fip.dir"] = new Vector3());

            res = res || [];
            res.length = 0; 
             
            for (let l_s of face.Loops)
            {
                let vs = l_s.GetLoopVs();
                for (let ci = 0; ci < vs.length; ci++)
                {
                    let pi = (ci - 1);
                    if (pi < 0) pi = vs.length - 1;

                    let ni = (ci + 1);
                    if (ni >= vs.length) ni = 0;

                    let pp = vs[pi].P;
                    let cp = vs[ci].P;
                    let np = vs[ni].P;

                    let t1 = pln.DotCoordinate(cp);
                    let t2 = pln.DotCoordinate(np);

                    if (t1 >= -MMeshOp.Epsilon && t1 <= MMeshOp.Epsilon)
                    { 
                        if (Math.abs(t2) < MMeshOp.Epsilon)
                            continue;
                         
                        res.push(cp.Clone());
                        continue;
                    }

                    if (t1 * t2 >= 0)
                        continue;

                    dir.SetSubtract(np, cp);
                    let t = pln.IntersectsLine(cp, dir);

                    if (t == null || t < 0 || t > 1)
                        continue;

                    let isectp = Vector3.ScaleAdd(cp, t, dir);

                    res.push( isectp );
                }
            }

            return res;
        }
       
        private static M_ApplyTransform(mesh: MMesh, xform: Matrix4)
        {
            if (xform != null)
            {
                for (let v of mesh.Vertics)
                {
                    v.P = Vector3.Transform(v.P, xform);
                } 
            }
            mesh.CacheVer ++;
        }
        private static M_Contains(mesh: MMesh, p: Vector3, res?: { on_face?: MFace }): U1.FaceIntersectionTypeEnum
        {
            let s_ = MMeshOp['.mc.'] || (MMeshOp['.mc.'] = {});
            let abbx: BoundingBox = s_.bbx1 || (s_.bbx1 = new BoundingBox());
            let offset = MMeshOp.EpVector3;

            abbx = mesh.GetBoundingBox(abbx);
            abbx.Min.Subtract(offset);
            abbx.Max.Add(offset);

            if (!abbx.ContainsPoint(p))
                return FaceIntersectionTypeEnum.Outside;
              
            let bdir   : Vector3 = s_.bdir || (s_.bdir = new Vector3()); 
            let f_isetp: Vector3 = s_.fp || (s_.fp = new Vector3());
            let b_isetp: Vector3 = s_.bp || (s_.bp = new Vector3());
            let tvec: Vector3 = s_.tvec || (s_.tvec = new Vector3());
             
            let rdvs = RandomVector3();
            let vs = mesh.Vertics;
            let fs = mesh.Faces;
             
            for (let i = 0; i < rdvs.length; i++)
            {
                let fdir = rdvs[i];
                let f_count = 0;
                let b_count = 0;

                for (let v of vs)
                {
                    let t = Vector3.Dot(fdir, tvec.SetSubtract(v.P, p));
                    if ( t > MMeshOp.Epsilon)
                    {
                        f_count++;
                    }
                    else if (t < -MMeshOp.Epsilon)
                    {
                        b_count++
                    }
                    else
                    {
                        break;
                    }
                }

                if (f_count == vs.length || b_count == vs.length) 
                    return FaceIntersectionTypeEnum.Outside;

                f_count = 0;
                b_count = 0;

                bdir.SetScale(fdir, -1);

                for (let f of fs)
                {
                    let fp = MMeshOp.F_IsectRay(f, p, fdir, f_isetp);
                    let bp = MMeshOp.F_IsectRay(f, p, bdir, b_isetp);

                    if (fp) f_count++;
                    if (bp) b_count++;

                    if ((fp && Vector3.Distance(fp, p) < MMeshOp.Epsilon) ||
                        (bp && Vector3.Distance(bp, p) < MMeshOp.Epsilon))
                    {
                        if (res) 
                            res.on_face = f; 

                        return FaceIntersectionTypeEnum.Boundary;
                    }
                }

                f_count = f_count % 2;
                b_count = b_count % 2;
                if (f_count != b_count) continue;

                return f_count == 0 ? FaceIntersectionTypeEnum.Outside : FaceIntersectionTypeEnum.Inside ;
            } 
        }
        private static M_BeginBoolean(ab: MMesh[])
        { 
            let last_sg = 0;
            let last_fg = 0;
            let last_mg = 0;

            let isA = true;

            for (let mesh of ab)
            {
                let fs = mesh.Faces as IMFaceOp[];
                let es = mesh.Edges as IMEdgOp[];
                let vs = mesh.Vertics as IMVertOp[];

                for (let v of vs)
                {
                    v._old_ = true; 
                }
                for (let e of es)
                {
                    delete e._face_;
                    delete e._floop_;
                    delete e._face_;
                }

                for (let f of fs)
                {
                    f._orgn_ = f;
                    delete f._del_; 
                    if (isA)
                    {
                        last_sg = Math.max(last_sg, f.SG + 1);
                        last_fg = Math.max(last_fg, f.FG + 1);
                        last_mg = Math.max(last_mg, f.MG + 1);
                    }
                    else
                    {
                        f.SG += last_sg;
                        f.FG += last_fg;
                        f.MG += last_mg;
                    }

                    let loops = f.Loops;
                    if (loops.length > 1)
                    {
                        let k = 2;
                    }

                    for (let loop of loops)
                    {
                        let cur: IMEdgOp = loop;
                        do
                        {
                            cur._face_ = f;
                            cur = cur.Next;
                        } while (cur != loop && cur != null);
                    }
                } 

                isA = false; 
            }
        }

        private static M_EndBoolean(mesh: MMesh)
        {
            let s_ = MMeshOp['.meb.'] || (MMeshOp['.meb.'] = {});
            let d0: Vector3 = s_.d0 || (s_.d0 = new Vector3());
            let d1: Vector3 = s_.d1 || (s_.d1 = new Vector3());

            mesh.RemoveUnused(); 
        }
        private static M_EndBoolean__(mesh: MMesh)
        {
            let s_ = MMeshOp['.meb.'] || (MMeshOp['.meb.'] = {});
            let d0: Vector3 = s_.d0 || (s_.d0 = new Vector3());
            let d1: Vector3 = s_.d1 || (s_.d1 = new Vector3());

            mesh.RemoveUnused();

            let es = mesh.Edges as IMEdgOp[];
            let fs = mesh.Faces as IMFaceOp[];

            let es_len = es.length;

            //Mark the edges to be removed; 
            for (let e of es)
            {
                let opp = e.Opp as IMEdgOp;
                if (e._del_ || e.Opp == null || e.Opp.Parent != mesh)
                    continue;

                let f1 = e._face_;
                let f2 = opp._face_;

                if (f1 === f2)
                {
                    e._del_ = true;
                    opp._del_ = true;
                }
            }

            let f_map: { [hnd: number]: IMFaceOp[] } = {};

            //Merge faces. 
            for (let f of fs)
            {
                let loops = f.Loops;
                let nloops: IMEdgOp[] = [];

                
                for (let i = 0; i < loops.length; i++)  
                {
                    let loop = loops[i];
                    let start: IMEdgOp = loop;
                    while (start != null && start._del_ && !start._floop_)
                    {
                        start = start.Next;
                        if (start === loop)
                            break;
                    }

                    if (start == null || start._del_ || start._floop_)
                        continue;

                    MMeshOp.E_ReLoop(start, es_len);
                    if (start.Next != null)
                        nloops.push(start);
                }

                f.Loops = nloops;
                if (nloops.length > 0)
                {
                    if (f_map[f._orgn_.HND] == null)
                    {
                        f_map[f._orgn_.HND] = [];
                    }
                    f_map[f._orgn_.HND].push(f);
                }
            }

            //Make holes of faces.
            for (let hdn in f_map)
            {
                let fs = f_map[hdn];
                for (let i = fs.length - 1; i >= 0; i--)
                {
                    let src = fs[i];
                    if (src.Loops == null || src.Loops.length == 0)
                        continue;

                    for (let j = i - 1; j >= 0; j--)
                    {
                        let tgt = fs[j];
                        if (tgt.Loops == null || tgt.Loops.length == 0)
                            continue;

                        if (MMeshOp.F_Contains(src, tgt.Loops[0].V.P) == FaceIntersectionTypeEnum.Inside)
                        {
                            let loops = src.Loops.slice();
                            loops.push(...tgt.Loops);

                            src.Loops = loops;
                            tgt.Loops = null;
                            break;
                        }
                        else if (MMeshOp.F_Contains(tgt, src.Loops[0].V.P) == FaceIntersectionTypeEnum.Inside)
                        {
                            let loops = tgt.Loops.slice();
                            loops.push(...src.Loops);

                            src.Loops = loops;
                            tgt.Loops = null;
                            break;
                        }
                    }
                }
            }

            mesh.RemoveUnused();
            es = mesh.Edges as IMEdgOp[];

             
            //Eliminate temporary vertics.
            for (let e of es)
            {
                delete e._face_;

                let v = e.Next.V as IMVertOp;

                if (v._old_)
                    continue;

                let ne = e.Next as IMEdgOp;
                let op = e.Opp as IMEdgOp;
                let nop = ne.Opp as IMEdgOp;

                let p0 = e.V.P;
                let p1 = ne.V.P;
                let p2 = ne.Next.V.P;

                d0.SetSubtract(p1, p0).Normalize();
                d1.SetSubtract(p2, p1).Normalize();
                let dt = Vector3.Dot(d0, d1);
                if (dt < 0.99) continue;

                if (e.Opp == null || ne.Opp == null)
                {
                    if (e.Opp != null || ne.Opp != null)
                        continue;

                    ne._del_ = true;
                }
                else if (nop.Next === op)
                {
                    ne._del_ = true;
                }
            }

            fs = mesh.Faces as IMFaceOp[];
            for (let f of fs)
            {
                let loops = f.Loops;
                let nloops: IMEdgOp[] = [];

                for (let i = 0; i < loops.length; i++)  
                {
                    let loop = loops[i];
                    let start: IMEdgOp = loop;
                    while (start != null && start._del_)
                    {
                        start = start.Next;
                        if (start === loop)
                            break;
                    }

                    MMeshOp.E_RemoveTmpVert(start);
                    nloops[i] = start;
                }

                f.Loops = nloops;
            }
           
            mesh.RemoveUnused();
        } 
        private static M_EndBoolean_(mesh: MMesh)
        {
            let s_ = MMeshOp['.meb.'] || (MMeshOp['.meb.'] = {});
            let d0: Vector3 = s_.d0 || (s_.d0 = new Vector3());
            let d1: Vector3 = s_.d1 || (s_.d1 = new Vector3());
            let norm: Vector3 = s_.norm || (s_.norm = new Vector3());

            mesh.RemoveUnused();

            let es = mesh.Edges as IMEdgOp[];
            let fs = mesh.Faces as IMFaceOp[];

            let es_len = es.length;

            //Mark the edges to be removed; 
            for (let e of es)
            {
                let opp = e.Opp as IMEdgOp;
                if (e._del_ || e.Opp == null || e.Opp.Parent != mesh)
                    continue;

                let f1 = e._face_;
                let f2 = opp._face_;
               
                if (f1 === f2)
                {
                    e._del_ = true;
                    opp._del_ = true;
                }
            }

            let f_loops_map: { [hnd: number]: { f: IMFaceOp, loops: IMEdgOp[] } }= {}; 

            for (let e of es)
            {
                if (e._del_ || e._floop_)
                    continue;

                MMeshOp.E_ReLoop(e, es_len);

                if (e.Next != null)
                {
                    if (f_loops_map[e._face_.HND] === undefined)
                        f_loops_map[e._face_.HND] = { f: e._face_, loops:[] };

                    f_loops_map[e._face_.HND].loops.push(e);
                } 
            }

            for (let f of fs)
            {
                if (f_loops_map[f.HND] === undefined)
                    f.Loops = null;
            }

            for (let hnd in f_loops_map)
            {
                let f_loop = f_loops_map[hnd];
                let face = f_loop.f;
                let loops = f_loop.loops;
                 
                if (loops.length > 1)
                {
                    norm = face.GetNorm(norm);
                    loops.sort((a_, b_) =>
                    {
                        let area0 = MMeshOp.E_GetLoopArea(a_, norm);
                        let area1 = MMeshOp.E_GetLoopArea(b_, norm);

                        return area0 == area1 ? 0 : (area0 > area1 ? -1 : 1);
                    });
                }

                face.Loops = loops;
            }
             
            mesh.RemoveUnused(); 
            es = mesh.Edges as IMEdgOp[];

            //Eliminate temporary vertics.
            for (let e of es)
            {
                delete e._face_; 

                let v = e.Next.V as IMVertOp;

                if (v._old_)
                    continue;

                let ne = e.Next as IMEdgOp;
                let op = e.Opp as IMEdgOp;
                let nop = ne.Opp as IMEdgOp;

                let p0 = e.V.P;
                let p1 = ne.V.P;
                let p2 = ne.Next.V.P; 

                d0.SetSubtract(p1, p0).Normalize();
                d1.SetSubtract(p2, p1).Normalize();
                let dt = Vector3.Dot(d0, d1);
                if (dt < 0.99) continue;

                if (e.Opp == null || ne.Opp == null)
                {
                    if (e.Opp != null || ne.Opp != null)
                        continue;

                    ne._del_ = true; 
                }
                else if (nop.Next === op)
                {
                    ne._del_ = true; 
                }  
            }

            fs = mesh.Faces as IMFaceOp[];
            for (let f of fs)
            {
                let loops = f.Loops;
                let nloops: IMEdgOp[] = [];

                for (let i = 0; i < loops.length; i++)  
                {
                    let loop = loops[i]; 
                    let start: IMEdgOp = loop;
                    while (start != null && start._del_)
                    {
                        start = start.Next;
                        if (start === loop)
                            break;
                    }  

                    MMeshOp.E_RemoveTmpVert(start);
                    nloops[i] = start; 
                }

                f.Loops = nloops;
            }

            mesh.RemoveUnused();
        }
        public static M_Sub(a: MMesh, b: MMesh): MMesh
        {
            let bbx0 = new BoundingBox();
            let abbx = new BoundingBox();
            let bbbx = new BoundingBox();
            
            a.GetBoundingBox(abbx);
            b.GetBoundingBox(bbbx);

            abbx.Min.Subtract(MMeshOp.EpVector3);
            abbx.Max.Add(MMeshOp.EpVector3);

            bbbx.Min.Subtract(MMeshOp.EpVector3);
            bbbx.Max.Add(MMeshOp.EpVector3);

            if (!abbx.IntersectsBoundingBox(bbbx))
            {
                return null;
            } 

            let a1 = a.Clone();
            let b1 = b.Clone();

            MMeshOp.M_BeginBoolean([a1, b1]);
            b1.Flip();


            let a1fs = a1.Faces.filter(o_ =>
            {
                o_.GetBBX(bbx0);
                return bbx0.IntersectsBoundingBox(bbbx);
            });
            let b1fs = b1.Faces.filter(o_ =>
            {
                o_.GetBBX(bbx0);
                return bbx0.IntersectsBoundingBox(abbx);
            });

            for (let bf of b.Faces)
            {
                bf.GetBBX(bbx0);
                if (!bbx0.IntersectsBoundingBox(abbx))
                    continue;

                //let afs = a1.Faces; 
                let fc = a1fs.length;
                for (let fi = 0; fi < fc; fi++)
                {
                    let af = a1fs[fi];
                    MMeshOp.F_SplitWithFace(af, bf, a1fs);
                }
            }  
            for (let af of a.Faces)
            {
                af.GetBBX(bbx0);
                if (!bbx0.IntersectsBoundingBox(bbbx))
                    continue;

                //let bfs = b1.Faces;
                let fc = b1fs.length;
                for (let fi = 0; fi < fc; fi++)
                {
                    let bf = b1fs[fi];
                    MMeshOp.F_SplitWithFace(bf, af, b1fs);
                }
            }

            let newfs: MFace[] = [];
            let newvs: MVert[] = [];
            let newes: MEdg[] = [];
             
            let innerp = new Vector3();
            let res: { on_face?: MFace } = {};
            let fnorm = new Vector3();

            for (let f of a1.Faces)
            {
                f.GetNorm(fnorm);
                 
                f.GetInnerPoint(innerp);
                 
                let isecttype = MMeshOp.M_Contains(b, innerp, res);
                 
                if (isecttype == FaceIntersectionTypeEnum.Inside)
                    continue;
                if (isecttype == FaceIntersectionTypeEnum.Boundary)
                {
                    //If the normals of the faces are the same directoin. ignore the face. 
                    if (Vector3.Dot(res.on_face.GetNorm(), fnorm) > 0.1)
                        continue;  
                }
                  
                newfs.push(f);
            } 
            for (let f of b1.Faces)
            {
                f.GetInnerPoint(innerp); 
                let isecttype = MMeshOp.M_Contains(a, innerp, res);

                if (isecttype != FaceIntersectionTypeEnum.Inside)
                    continue;  

                newfs.push(f);
            }

            let newmesh = new MMesh();
            let e_num = -1;
            let v_num = -1;
            let f_num = -1;

            for (let f of newfs)
            {
                if (f.GetArea() < MMeshOp.Min_FaceArea)
                    continue;

                f.Parent = newmesh;
                f.Num = ++f_num;

                for (let loop of f.Loops)
                {
                    for (let e of loop.GetLoop())
                    { 
                        e.Parent = newmesh;
                        e.Num = ++e_num;
                    }
                    for (let v of loop.GetLoopVs())
                    {
                        v.Num = ++v_num;
                        v.Parent = newmesh;
                    }
                }
            }
             
            MMeshOp.M_EndBoolean(newmesh);
            return newmesh;
        }
        public static M_Union(a: MMesh, b: MMesh): MMesh
        {
            let bbx0 = new BoundingBox();
            let abbx = new BoundingBox();
            let bbbx = new BoundingBox();

            a.GetBoundingBox(abbx);
            b.GetBoundingBox(bbbx);

            abbx.Min.Subtract(MMeshOp.EpVector3);
            abbx.Max.Add(MMeshOp.EpVector3);

            bbbx.Min.Subtract(MMeshOp.EpVector3);
            bbbx.Max.Add(MMeshOp.EpVector3);

            if (!abbx.IntersectsBoundingBox(bbbx))
            {
                return null;
            }

            let a1 = a.Clone();
            let b1 = b.Clone();

            MMeshOp.M_BeginBoolean([a1, b1]); 
             
            let a1fs = a1.Faces.filter(o_ =>
            {
                o_.GetBBX(bbx0);
                return bbx0.IntersectsBoundingBox(bbbx);
            });
            let b1fs = b1.Faces.filter(o_ =>
            {
                o_.GetBBX(bbx0);
                return bbx0.IntersectsBoundingBox(abbx);
            });

            for (let bf of b.Faces)
            {
                bf.GetBBX(bbx0);
                if (!bbx0.IntersectsBoundingBox(abbx))
                    continue;

                //let afs = a1.Faces; 
                let fc = a1fs.length;
                for (let fi = 0; fi < fc; fi++)
                {
                    let af = a1fs[fi];
                    MMeshOp.F_SplitWithFace(af, bf, a1fs);
                }
            }
            for (let af of a.Faces)
            {
                af.GetBBX(bbx0);
                if (!bbx0.IntersectsBoundingBox(bbbx))
                    continue;

                //let bfs = b1.Faces;
                let fc = b1fs.length;
                for (let fi = 0; fi < fc; fi++)
                {
                    let bf = b1fs[fi];
                    MMeshOp.F_SplitWithFace(bf, af, b1fs);
                }
            }

            let newfs: MFace[] = [];
            let newvs: MVert[] = [];
            let newes: MEdg[] = [];

            let innerp = new Vector3();
            let res: { on_face?: MFace } = {};
            let fnorm = new Vector3();

            for (let f of a1.Faces)
            {
                f.GetNorm(fnorm);
                f.GetInnerPoint(innerp);
                let isecttype = MMeshOp.M_Contains(b, innerp, res);

                if (isecttype == FaceIntersectionTypeEnum.Inside)
                    continue;

                if (isecttype == FaceIntersectionTypeEnum.Boundary)
                {
                    //If the normals of the faces are the opposite directoin. ignore the face. 
                    if (Vector3.Dot(res.on_face.GetNorm(), fnorm) < -0.1)
                        continue;
                } 

                newfs.push(f);
            }
            for (let f of b1.Faces)
            {
                f.GetInnerPoint(innerp);
                 
                let isecttype = MMeshOp.M_Contains(a, innerp, res);

                if (isecttype != FaceIntersectionTypeEnum.Outside)
                    continue;
                  
                newfs.push(f);
            }

            let newmesh = new MMesh();
            let e_num = -1;
            let v_num = -1;
            let f_num = -1;

            for (let f of newfs)
            {
                if (f.GetArea() < MMeshOp.Min_FaceArea)
                    continue;

                f.Parent = newmesh;
                f.Num = ++f_num;

                for (let loop of f.Loops)
                {
                    for (let e of loop.GetLoop())
                    {
                        e.Parent = newmesh;
                        e.Num = ++e_num;
                    }
                    for (let v of loop.GetLoopVs())
                    {
                        if (v.Parent != newmesh)
                        {
                            v.Num = ++v_num;
                            v.Parent = newmesh;
                        }
                    }
                }
            }

            MMeshOp.M_EndBoolean(newmesh);
            return newmesh;
        }
        public static M_Intersect(a: MMesh, b: MMesh): MMesh
        {
            let bbx0 = new BoundingBox();
            let abbx = new BoundingBox();
            let bbbx = new BoundingBox();

            a.GetBoundingBox(abbx);
            b.GetBoundingBox(bbbx);

            abbx.Min.Subtract(MMeshOp.EpVector3);
            abbx.Max.Add(MMeshOp.EpVector3);

            bbbx.Min.Subtract(MMeshOp.EpVector3);
            bbbx.Max.Add(MMeshOp.EpVector3);

            if (!abbx.IntersectsBoundingBox(bbbx))
            {
                return null;
            }

            let a1 = a.Clone();
            let b1 = b.Clone();

            MMeshOp.M_BeginBoolean([a1, b1]);

            let a1fs = a1.Faces.filter(o_ =>
            {
                o_.GetBBX(bbx0);
                return bbx0.IntersectsBoundingBox(bbbx);
            });
            let b1fs = b1.Faces.filter(o_ =>
            {
                o_.GetBBX(bbx0);
                return bbx0.IntersectsBoundingBox(abbx);
            });

            for (let bf of b.Faces)
            {
                bf.GetBBX(bbx0);
                if (!bbx0.IntersectsBoundingBox(abbx))
                    continue;

                //let afs = a1.Faces; 
                let fc = a1fs.length;
                for (let fi = 0; fi < fc; fi++)
                {
                    let af = a1fs[fi];
                    MMeshOp.F_SplitWithFace(af, bf, a1fs);
                }
            }
            for (let af of a.Faces)
            {
                af.GetBBX(bbx0);
                if (!bbx0.IntersectsBoundingBox(bbbx))
                    continue;

                //let bfs = b1.Faces;
                let fc = b1fs.length;
                for (let fi = 0; fi < fc; fi++)
                {
                    let bf = b1fs[fi];
                    MMeshOp.F_SplitWithFace(bf, af, b1fs);
                }
            }


            let newfs: MFace[] = [];
            let newvs: MVert[] = [];
            let newes: MEdg[] = [];

            let innerp = new Vector3();
            let res: { on_face?: MFace } = {};
            let fnorm = new Vector3();

            for (let f of a1.Faces)
            {
                f.GetNorm(fnorm);
                f.GetInnerPoint(innerp);
                let isecttype = MMeshOp.M_Contains(b, innerp, res);

                if (isecttype == FaceIntersectionTypeEnum.Outside)
                    continue;

                if (isecttype == FaceIntersectionTypeEnum.Boundary)
                {
                    //If the normals of the faces are the opposite directoin. ignore the face. 
                    if (Vector3.Dot(res.on_face.GetNorm(), fnorm) < -0.1)
                        continue;
                }

                newfs.push(f);
            }
            for (let f of b1.Faces)
            {
                f.GetInnerPoint(innerp);
                let isecttype = MMeshOp.M_Contains(a, innerp, res);

                if (isecttype != FaceIntersectionTypeEnum.Inside)
                    continue;
                 
                newfs.push(f);
            }

            let newmesh = new MMesh();
            let e_num = -1;
            let v_num = -1;
            let f_num = -1;

            for (let f of newfs)
            {
                if (f.GetArea() < MMeshOp.Min_FaceArea)
                    continue;

                f.Parent = newmesh;
                f.Num = ++f_num;

                for (let loop of f.Loops)
                {
                    for (let e of loop.GetLoop())
                    {
                        e.Parent = newmesh;
                        e.Num = ++e_num;
                    }
                    for (let v of loop.GetLoopVs())
                    {
                        v.Num = ++v_num;
                        v.Parent = newmesh;
                    }
                }
            }

            MMeshOp.M_EndBoolean(newmesh);
            return newmesh;
        }

        public static MD_Sub(amodel: MModel, bmodel: MModel): MModel
        {
            let bbx1 = amodel.GetWorldOBB();
            let bbx2 = bmodel.GetWorldOBB();

            if (!bbx1.IntersectsBoundingBox(bbx2))
                return null;
             
            let amesh = amodel.Mesh;
            let bmesh = bmodel.Mesh;
             
            amesh = amesh.Clone();
            bmesh = bmesh.Clone();

            MMeshOp.M_ApplyTransform(amesh, amodel.Transform);
            MMeshOp.M_ApplyTransform(bmesh, bmodel.Transform);
              
            let result = Meshes.MMeshOp.M_Sub(amesh, bmesh);
            if (result == null)
                return null;

            let invm = Matrix4.Invert(amodel.Transform);
            MMeshOp.M_ApplyTransform(result, invm);

            let rmodel = new Meshes.MModel();
            rmodel.Transform = amodel.Transform.Clone();
            rmodel.Append(result);
            rmodel.Mesh = result;

            rmodel.Mats = amodel.Mats;
            let lst_mg = 0;
            amesh.Faces.forEach(o_ => lst_mg = lst_mg < o_.MG ? o_.MG : lst_mg);
            lst_mg++;

            for (let muse of bmodel.Mats)
            {
                rmodel.SetMat(muse.MGrp + lst_mg, muse.Mat);
            }

            return rmodel;
        }
        public static MD_Union(amodel: MModel, bmodel: MModel): MModel
        {
            let bbx1 = amodel.GetWorldOBB();
            let bbx2 = bmodel.GetWorldOBB();

            if (!bbx1.IntersectsBoundingBox(bbx2))
                return null;

            let amesh = amodel.Mesh;
            let bmesh = bmodel.Mesh;

            amesh = amesh.Clone();
            bmesh = bmesh.Clone();

            MMeshOp.M_ApplyTransform(amesh, amodel.Transform);
            MMeshOp.M_ApplyTransform(bmesh, bmodel.Transform);
  
            let result = Meshes.MMeshOp.M_Union(amesh, bmesh);
            if (result == null)
                return null;

            let invm = Matrix4.Invert(amodel.Transform);
            MMeshOp.M_ApplyTransform(result, invm);

            let rmodel = new Meshes.MModel();
            rmodel.Transform = amodel.Transform.Clone();
            rmodel.Append(result);
            rmodel.Mesh = result;

            rmodel.Mats = amodel.Mats;
            let lst_mg = 0;
            amesh.Faces.forEach(o_ => lst_mg = lst_mg < o_.MG ? o_.MG : lst_mg);
            lst_mg++;

            for (let muse of bmodel.Mats)
            {
                rmodel.SetMat(muse.MGrp + lst_mg, muse.Mat);
            }

            return rmodel;
        }
        public static MD_Intersect(amodel: MModel, bmodel: MModel): MModel
        {
            let bbx1 = amodel.GetWorldOBB();
            let bbx2 = bmodel.GetWorldOBB();

            if (!bbx1.IntersectsBoundingBox(bbx2))
                return null;

            let amesh = amodel.Mesh;
            let bmesh = bmodel.Mesh;

            amesh = amesh.Clone();
            bmesh = bmesh.Clone();

            MMeshOp.M_ApplyTransform(amesh, amodel.Transform);
            MMeshOp.M_ApplyTransform(bmesh, bmodel.Transform);
  
            let result = Meshes.MMeshOp.M_Intersect(amesh, bmesh);
            if (result == null)
                return null;

            let invm = Matrix4.Invert(amodel.Transform);
            MMeshOp.M_ApplyTransform(result, invm);

            let rmodel = new Meshes.MModel();
            rmodel.Transform = amodel.Transform.Clone();
            rmodel.Append(result);
            rmodel.Mesh = result;

            rmodel.Mats = amodel.Mats;
            let lst_mg = 0;
            amesh.Faces.forEach(o_ => lst_mg = lst_mg < o_.MG ? o_.MG : lst_mg);
            lst_mg++;

            for (let muse of bmodel.Mats)
            {
                rmodel.SetMat(muse.MGrp + lst_mg, muse.Mat);
            }
            return rmodel;
        }
    }
}