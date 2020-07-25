namespace KBim.Views
{
    export class VcXFormPt
    {
        
       static PARTS = {
            CENT:"CENT",
            LB: "LB",
            FB: "FB",
            RB: "RB",
            KB: "KB",
            CB: "CB",

            LT: "LT",
            FT: "FT",
            RT: "RT",
            KT: "KT",
            CT: "CT", 
            CTT: "CTT", 

            LFB: "LFB",
            RFB: "RFB",
            RKB: "RKB",
            LKB: "LKB",

            LFT: "LFT",
            RFT: "RFT",
            RKT: "RKT",
            LKT: "LKT",
            BTM: "BTM",
            TOP: "TOP",
            ROT_X: "ROT_X",
            ROT_Y: "ROT_Y",
            ROT_Z: "ROT_Z"
       };

        static OverColor = U1.Colors.Orange;
        Part: string;
        Pos: U1.Vector3;
        Dir: U1.Vector3;
        Color: U1.Color;
        Point: U1.Views.ScPoint;
        XForm: VcXFormThree;

        protected dragStart = U1.Vector3.Zero;
        protected dragCurr = U1.Vector3.Zero;

        constructor(xform: VcXFormThree, part: string)
        {
            this.Color = U1.Colors.White; 
            var Parts = VcXFormPt.PARTS;

            switch (part)
            {
                case Parts.LFB:
                    break;
                case Parts.RFB:
                    break;
                case Parts.RKB:
                    break;
                case Parts.LKB:
                    break;
                case Parts.LB:
                    this.Color = U1.Colors.Black;
                    break;
                case Parts.FB:
                    this.Color = U1.Colors.Black;
                    break;
                case Parts.RB:
                    this.Color = U1.Colors.Black;
                    break;
                case Parts.KB:
                    this.Color = U1.Colors.Black;
                    break;
                case Parts.CT: 
                    break;
                case Parts.CTT:
                    break;
            }

            this.XForm = xform;
            this.Part = part;
        }
        public CheckIntersect(isectContext: U1.ISectContext): U1.ISectInfo
        {
            if (this.Point == null)
                return null;

            let isect = this.Point.CheckIntersect(isectContext); 
            if (isect != null)
            { 
                return isect;
            }
            return null;
        }
        public Update()
        {
            let xform = this.XForm;
            let obb = xform.OBBCorners;

            if (xform.CanScale != true)
                return;

            if (this.Point == null)
            {
                this.Point = this.XForm.Scene.Screen.AddEntity(U1.Views.ScPoint);
                this.Point.Style.Alpha = 0.4;
                this.Point.Radius = 10;
                this.Point.Style.Fill = this.Color;
                this.Point.Style.Stroke = U1.Colors.Black;
                this.Point.Style.StrokeThickness = 1;
                this.Point.Tag = this;
            }

            let pos = this.Pos || obb[this.Part];

            this.Point.Position = pos;
            this.Point.Style.Fill = xform.ActivePt != this ? this.Color : VcXFormPt.OverColor;
            this.Point.SetChanged();
        }
        public Clear()
        {
            if (this.Point != null)
            {
                this.Point.Dispose();
                this.Point = undefined;
            }
        }
        public GetOpp(): U1.Vector3
        {
            var oppPart = "";
            var Parts = VcXFormPt.PARTS;

            switch (this.Part)
            {
                case Parts.LFB:
                    oppPart = Parts.RKB;
                    break;
                case Parts.RFB:
                    oppPart = Parts.LKB;
                    break;
                case Parts.RKB:
                    oppPart = Parts.LFB;
                    break;
                case Parts.LKB:
                    oppPart = Parts.RFB;
                    break;
                case Parts.LB:
                    oppPart = Parts.RB;
                    break;
                case Parts.FB:
                    oppPart = Parts.KB;
                    break;
                case Parts.RB:
                    oppPart = Parts.LB;
                    break;
                case Parts.KB:
                    oppPart = Parts.FB;
                    break;
                case Parts.CT:
                    oppPart = Parts.CB;
                    break;
                case Parts.CTT:
                    oppPart = Parts.CB;
                    break;
            }

            return this.XForm.OBBCorners[oppPart] as U1.Vector3;
        }
        public OnMouseLeave(ev: MouseEvent): boolean
        {
            return true;
        }
        public OnMouseMove(ev: MouseEvent): boolean
        {
            let xform = this.XForm;

            var view = xform.View;
            let corners = xform.OBBCorners;
            var pos = corners[this.Part];
            var opp = this.GetOpp();
            var dir = U1.Vector3.Subtract(pos, opp);

            var ray = view.GetRay(view.CurMv);
            var res = { s: 0, t: 0 };
            var dist = U1.Line3.SquardDistance1(pos, dir, ray.Position, ray.Direction, res);

            this.dragCurr.SetScaleAdd(pos, res.s, dir);

            if (xform.TM_Mode == U1.Views.VcXForm.TM_Modes.None)
            {
                this.dragStart.CopyFrom(this.dragCurr);
                xform.BeginScale();
            }

            xform.Scale(opp, this.dragStart, this.dragCurr);

            // xform.OBB.Transform( 
            //this.Pos = Vector3.ScaleAdd(pos, res.s, dir);
            
            return true;
        }
        public OnMouseUp(ev: MouseEvent): boolean
        {
            let xform = this.XForm;
            var view = xform.View;
            let corners = xform.OBBCorners;
            var pos = corners[this.Part];
            var opp = this.GetOpp();
            var dir = U1.Vector3.Subtract(pos, opp);

            var ray = view.GetRay(view.CurUp);
            var res = { s: 0, t: 0 };
            var dist = U1.Line3.SquardDistance1(pos, dir, ray.Position, ray.Direction, res);

            this.dragCurr.SetScaleAdd(pos, res.s, dir);

            if (this.XForm.TM_Mode == U1.Views.VcXForm.TM_Modes.Scale)
            {
                this.XForm.EndScale(opp, this.dragStart, this.dragCurr);
            }

            //this.Pos = undefined;
            return true;
        }
        
    }
    export class VcXFormPtRot extends VcXFormPt
    {
        private Plane = new U1.Plane();

        constructor(xform: VcXFormThree, part: string)
        {
            super(xform, part);

            this.Color = U1.Colors.Red;
        }

        public Update()
        {
            let xform = this.XForm;
            let pos = this.GetPos();

            if (xform.CanRotate != true)
                return;

            if (this.Point == null)
            {
                this.Point = this.XForm.Scene.Screen.AddEntity(U1.Views.ScPoint);
                this.Point.Style.Alpha = 0.4;
                this.Point.Radius = 10;
                this.Point.Style.Fill = this.Color;
                this.Point.Style.Stroke = U1.Colors.Black;
                this.Point.Style.StrokeThickness = 1;
                this.Point.Tag = this;
            }
             
            this.Point.Position = pos;
            this.Point.Style.Fill = xform.ActivePt != this ? this.Color : VcXFormPt.OverColor;
            this.Point.SetChanged();
        }

        private GetPos()
        {
            let xform = this.XForm;
            let corners = xform.OBBCorners;
            let pos: U1.Vector3;
            switch (this.Part)
            {
                case VcXFormPt.PARTS.ROT_Z:
                    pos = corners[VcXFormPt.PARTS.ROT_Z];
                    break;
                case VcXFormPt.PARTS.ROT_Y:
                    pos = corners[VcXFormPt.PARTS.ROT_Y];
                    break;
                case VcXFormPt.PARTS.ROT_X:
                    pos = corners[VcXFormPt.PARTS.ROT_X];
                    break;
            }
            return pos;
        }
        private GetAxis()
        {
            let xform = this.XForm;
            let corners = xform.OBBCorners;
            let axis: U1.Vector3;
            switch (this.Part)
            {
                case VcXFormPt.PARTS.ROT_Z:
                    axis = corners.ZAXIS;
                    break;
                case VcXFormPt.PARTS.ROT_Y:
                    axis = corners.YAXIS;
                    break;
                case VcXFormPt.PARTS.ROT_X:
                    axis = corners.XAXIS;
                    break;
            }
            return axis;
        }
        public OnMouseMove(ev: MouseEvent): boolean
        {
            let xform = this.XForm;

            var view = xform.View;
            let corners = xform.OBBCorners;

            var pos = this.GetPos(); 
            var cent = corners.CB;
            var rad = U1.Vector3.Distance(pos, cent);

            var norm = this.GetAxis(); 
            this.Plane.SetFromPointNormal(cent, norm);

            view.ViewToPlane(view.CurMv, this.Plane, this.dragCurr);
             
            if (xform.TM_Mode == U1.Views.VcXForm.TM_Modes.None)
            {
                this.dragStart.CopyFrom(this.dragCurr);
                xform.BeginRotate();
            }
             
            xform.Rotate(cent, norm, this.dragStart, this.dragCurr);  
            return true;
        }

        public OnMouseUp(ev: MouseEvent): boolean
        {
            let xform = this.XForm;
            var view = xform.View;
            var view = xform.View;
            let corners = xform.OBBCorners;

            var pos = this.GetPos();
            var cent = corners.CB;
            var rad = U1.Vector3.Distance(pos, cent);

            var norm = this.GetAxis();
            this.Plane.SetFromPointNormal(cent, norm);

            view.ViewToPlane(view.CurMv, this.Plane, this.dragCurr); 

            if (this.XForm.TM_Mode == U1.Views.VcXForm.TM_Modes.Rotate)
            {
                this.XForm.EndRotate(cent, norm, this.dragStart, this.dragCurr);  
            }
             
            return true;
        }
    }
    export class VcXFormMvUp extends VcXFormPt
    {
        constructor(xform: VcXFormThree, part: string)
        {
            super(xform, part);
        }
        public OnMouseMove(ev: MouseEvent): boolean
        {
            let xform = this.XForm;

            if (xform.CanRotate != true)
                return;

            var view = xform.View;
            let corners = xform.OBBCorners;
            var pos = corners[this.Part];
            var opp = this.GetOpp();
            var dir = U1.Vector3.Subtract(pos, opp);

            var ray = view.GetRay(view.CurMv);
            var res = { s: 0, t: 0 };
            var dist = U1.Line3.SquardDistance1(pos, dir, ray.Position, ray.Direction, res);

            this.dragCurr.SetScaleAdd(pos, res.s, dir);

            if (xform.TM_Mode == U1.Views.VcXForm.TM_Modes.None)
            {
                this.dragStart.CopyFrom(this.dragCurr);
                xform.BeginMove();
            }

            xform.Move(this.dragStart, this.dragCurr); 

            return true;
        }
        public OnMouseUp(ev: MouseEvent): boolean
        {
            let xform = this.XForm;
            var view = xform.View;
            let corners = xform.OBBCorners;
            var pos = corners[this.Part];
            var opp = this.GetOpp();
            var dir = U1.Vector3.Subtract(pos, opp);

            var ray = view.GetRay(view.CurUp);
            var res = { s: 0, t: 0 };
            var dist = U1.Line3.SquardDistance1(pos, dir, ray.Position, ray.Direction, res);

            this.dragCurr.SetScaleAdd(pos, res.s, dir);

            if (this.XForm.TM_Mode == U1.Views.VcXForm.TM_Modes.Move)
            {
                this.XForm.EndMove(this.dragStart, this.dragCurr);
            } 
            return true;
        }
    }
    export class VcXFormThree extends U1.Views.VcXForm
    {
        private m_bottom: U1.Views.ScPolygon;
        private m_zaxis: U1.Views.ScPolyLine;

        private m_sc_ps: { [index: string]: VcXFormPt } =
        {
            LFB: new VcXFormPt(this, VcXFormPt.PARTS.LFB),
            RFB: new VcXFormPt(this, VcXFormPt.PARTS.RFB ),
            RKB: new VcXFormPt(this, VcXFormPt.PARTS.RKB),
            LKB: new VcXFormPt(this, VcXFormPt.PARTS.LKB),
            LB: new VcXFormPt(this, VcXFormPt.PARTS.LB),
            FB: new VcXFormPt(this, VcXFormPt.PARTS.FB),
            RB: new VcXFormPt(this, VcXFormPt.PARTS.RB),
            KB: new VcXFormPt(this, VcXFormPt.PARTS.KB),
            KT: new VcXFormPt(this, VcXFormPt.PARTS.CT),
            ROT_Z: new VcXFormPtRot(this, VcXFormPt.PARTS.ROT_Z),
            ROT_X: new VcXFormPtRot(this, VcXFormPt.PARTS.ROT_X),
            ROT_Y: new VcXFormPtRot(this, VcXFormPt.PARTS.ROT_Y),
            MOV_Z: new VcXFormMvUp(this, VcXFormPt.PARTS.CTT) 
        };

        private static part_pts = {
            CENT: U1.Vector3.Zero,
            LB: U1.Vector3.Zero,
            FB: U1.Vector3.Zero,
            RB: U1.Vector3.Zero,
            KB: U1.Vector3.Zero,
            CB: U1.Vector3.Zero,

            LT: U1.Vector3.Zero,
            FT: U1.Vector3.Zero,
            RT: U1.Vector3.Zero, 
            CT: U1.Vector3.Zero,  
            KT: U1.Vector3.Zero, 
            CTT: U1.Vector3.Zero,

            LFB: U1.Vector3.Zero,
            RFB: U1.Vector3.Zero,
            RKB: U1.Vector3.Zero,
            LKB: U1.Vector3.Zero,

            LFT: U1.Vector3.Zero,
            RFT: U1.Vector3.Zero,
            RKT: U1.Vector3.Zero,
            LKT: U1.Vector3.Zero,
            BTM: new Array<U1.Vector3>(4),
            TOP: new Array<U1.Vector3>(4),
            FRT: new Array<U1.Vector3>(4),     // added
            ZLINE: new Array<U1.Vector3>(2),
            XAXIS: U1.Vector3.Zero,
            YAXIS: U1.Vector3.Zero,
            ZAXIS: U1.Vector3.Zero,

            ROT_X: U1.Vector3.Zero,
            ROT_Y: U1.Vector3.Zero,
            ROT_Z: U1.Vector3.Zero 
            
        };

        public OBBCorners = VcXFormThree.part_pts;

        private m_ps: U1.Vector3[] = [];
        private m_isect_pt: VcXFormPt;
        private m_oldColor: U1.Color;

        public get KView()
        {
            return this.View as KView;
        }
        public get ActivePt()
        {
            return this.m_isect_pt;
        }
        protected OnUpdate()
        {
            var bps = this.OBBCorners;

            var cam = this.View.Scene.Camera; 
            var obb = this.OBB;

            this.UpdateCorners();

            if (this.m_bottom == null)
            {
                this.m_bottom = this.View.Scene.Screen.AddEntity(U1.Views.ScPolygon);
                this.m_bottom.Style.Alpha = 0.4;
                this.m_bottom.Style.Fill = U1.Colors.Green;
                this.m_bottom.Style.Stroke = U1.Colors.DarkBlue;
                this.m_bottom.Style.StrokeThickness = 5;
                this.m_bottom.Style.StrokeDash = [3, 3];
            } 
            this.m_bottom.Points = bps.BTM; 
            this.m_bottom.SetChanged(); 

            for (let idx in this.m_sc_ps)
            {
                this.m_sc_ps[idx].Update();
            } 
        }

        private UpdateCorners()
        {
            var bps = this.OBBCorners;
            var obb = this.OBB;

            obb.LFB(bps.LFB);
            obb.RFB(bps.RFB);
            obb.RKB(bps.RKB);
            obb.LKB(bps.LKB);

            obb.LFT(bps.LFT);
            obb.RFT(bps.RFT);
            obb.RKT(bps.RKT);
            obb.LKT(bps.LKT);

            bps.LB.SetAdd(bps.LFB, bps.LKB).Scale(0.5);
            bps.FB.SetAdd(bps.LFB, bps.RFB).Scale(0.5);
            bps.RB.SetAdd(bps.RFB, bps.RKB).Scale(0.5);
            bps.KB.SetAdd(bps.RKB, bps.LKB).Scale(0.5);

            bps.LT.SetAdd(bps.LFT, bps.LKT).Scale(0.5);
            bps.FT.SetAdd(bps.LFT, bps.RFT).Scale(0.5);
            bps.RT.SetAdd(bps.RFT, bps.RKT).Scale(0.5);
            bps.KT.SetAdd(bps.RKT, bps.LKT).Scale(0.5);

            bps.LB.SetAdd(bps.LFB, bps.LKB).Scale(0.5);
            bps.FB.SetAdd(bps.LFB, bps.RFB).Scale(0.5);
            bps.RB.SetAdd(bps.RFB, bps.RKB).Scale(0.5);
            bps.KB.SetAdd(bps.RKB, bps.LKB).Scale(0.5);

            bps.CT.SetAdd(bps.LFT, bps.RKT).Scale(0.5); 

            bps.CB.SetAdd(bps.LFB, bps.RKB).Scale(0.5);
            bps.CENT.SetAdd(bps.LFB, bps.RKT).Scale(0.5);
             
            bps.CTT.SetScaleAdd(bps.CT, 1, U1.Vector3.Subtract(bps.CT, bps.CENT).Normalize())

            bps.BTM[0] = bps.LFB;
            bps.BTM[1] = bps.RFB;
            bps.BTM[2] = bps.RKB;
            bps.BTM[3] = bps.LKB;

            // added
            bps.FRT[0] = bps.LFB;
            bps.FRT[1] = bps.RFB;
            bps.FRT[2] = bps.RFT;
            bps.FRT[3] = bps.LFT;
            //

            bps.TOP[0] = bps.LFT;
            bps.TOP[1] = bps.RFT;
            bps.TOP[2] = bps.RKT;
            bps.TOP[3] = bps.LKT;

            bps.ZLINE[0] = bps.CB;
            bps.ZLINE[1] = bps.CT;

            bps.ZAXIS.SetSubtract(bps.CT, bps.CB).Normalize();
            bps.XAXIS.SetSubtract(bps.RB, bps.LB).Normalize();
            bps.YAXIS.SetSubtract(bps.KB, bps.FB).Normalize();

            bps.ROT_Z.SetScaleAdd(bps.RFB, 1, U1.Vector3.Subtract(bps.RFB, bps.CENT).Normalize());
            bps.ROT_X.SetScaleAdd(bps.FT, 1, U1.Vector3.Subtract(bps.FT, bps.CENT).Normalize());
            bps.ROT_Y.SetScaleAdd(bps.RT, 1, U1.Vector3.Subtract(bps.RT, bps.CENT).Normalize());
        }
        private AddPt(ptInfo: VcXFormPt)
        {
            var scp = this.View.Scene.Screen.AddEntity(U1.Views.ScPoint);
            scp.Style.Alpha = 0.4;
            scp.Radius = 10;
            scp.Style.Fill = ptInfo.Color;
            scp.Style.Stroke = U1.Colors.Black;
            scp.Style.StrokeThickness = 1;
            scp.Tag = ptInfo;

            return scp;
        }

        public CheckIntersect(isectContext: U1.ISectContext): U1.ISectInfo
        {
            this.m_isect_pt = undefined;

            if (this.m_sc_ps != null)
            {
                for (let idx in this.m_sc_ps)
                {
                    let sp = this.m_sc_ps[idx];
                    let isect = sp.CheckIntersect(isectContext);

                    if (isect != null)
                    {
                        this.m_isect_pt = sp;
                        return isect;
                    }
                }
            }
            return null;
        }
        public Clear()
        {
            if (this.m_bottom != null)
            {
                this.m_bottom.Dispose();
                this.m_bottom = undefined;
            }

            if (this.m_sc_ps != null)
            {
                for (let idx in this.m_sc_ps)
                {
                    let sp = this.m_sc_ps[idx];
                    sp.Clear();
                }

                this.m_sc_ps = undefined;
            }

            if (this.m_zaxis != null)
            {
                this.m_zaxis.Dispose();
                this.m_zaxis = undefined;
            }
        }

        public OnMouseEnter(ev: MouseEvent)
        {
            if (this.m_isect_pt != null)
            {
                
            }
            return false;
        }
        public OnMouseLeave(ev: MouseEvent)
        {
            if (this.m_isect_pt != null)
            {
                return  this.m_isect_pt.OnMouseLeave(ev);
            }
            return false;  
        }
        public OnMouseMove(ev: MouseEvent): boolean
        {
            if (this.m_isect_pt != null)
            {
                return this.m_isect_pt.OnMouseMove(ev);
            }
            return false; 
        }
        public OnMouseUp(ev: MouseEvent): boolean
        { 
            if (this.m_isect_pt != null)
            {
                let res = this.m_isect_pt.OnMouseUp(ev);

                this.m_isect_pt = undefined;
                return res;
            }
            return false;
        }
        public OnMouseDown(ev: MouseEvent): boolean
        {   
            return false;
        }
        public OnMouseWheel(ev: MouseWheelEvent): boolean
        {
            return false;
        }
    }
}