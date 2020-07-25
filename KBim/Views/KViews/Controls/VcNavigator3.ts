namespace KBim.Views
{
    export class VcNavigator3Three extends U1.Views.VcNavigator
    {
        private m_navThree: ScNavigatorThree;
        private m_isDraging: boolean;
        private get IsDraging(): boolean
        {
            return this.m_isDraging;
        }
        private set IsDraging(value: boolean)
        {
            this.m_isDraging = value;
            if (!value)
            {
                return;
            }
        }
        private m_rotPlane = new U1.Plane();

        protected OnUpdate()
        {
            if (this.m_navThree == null || this.m_navThree.IsDisposed)
            {
                this.m_navThree = this.Scene.Overlay.AddEntity(KBim.Views.ScNavigatorThree);
                this.m_navThree.IsPickable = false;
            }
        }

        Clear(): void
        {
            if (this.m_navThree != null)
            {
                this.m_navThree.Dispose();
                this.m_navThree = null;
            }

        }

        OnMouseDown(ev: MouseEvent)
        {
            this.View.ActiveControl = this;
            return true;
        }
        OnMouseUp(ev: MouseEvent)
        {
            if (!this.IsDraging)
            {
                var screen = this.View.CurDn;
                var isect = this.m_navThree.CheckIntersect_1(screen.X, screen.Y);
                if (isect != null)
                {
                    var xdir = new U1.Vector3();
                    var ydir = new U1.Vector3();
                    var zdir = new U1.Vector3();

                    if (this.m_navThree.GetDirectionByAttr(isect.Attr, xdir, ydir, zdir))
                    {
                        this.OnFitAxes(xdir, ydir, zdir);
                    }
                }
            }

            this.IsDraging = false;
            //ReleaseMouseCapture();
            //return true; 

            if (this.View.ActiveControl == this)
                this.View.ActiveControl = null;

            return true;
        }
        OnMouseMove(ev: MouseEvent)
        {
            var cache = VcNavigator3Three;
            var tv0: U1.Vector3 = cache[".omm.v0"] || (cache[".omm.v0"] = new U1.Vector3());
            var tv1: U1.Vector3 = cache[".omm.v1"] || (cache[".omm.v1"] = new U1.Vector3());
            var tv2: U1.Vector3 = cache[".omm.v2"] || (cache[".omm.v2"] = new U1.Vector3());
            var tv3: U1.Vector3 = cache[".omm.v3"] || (cache[".omm.v3"] = new U1.Vector3());
            var tv4: U1.Vector3 = cache[".omm.v4"] || (cache[".omm.v4"] = new U1.Vector3());
            var tv20: U1.Vector2 = cache[".omm.v20"] || (cache[".omm.v20"] = new U1.Vector2());
            var tv21: U1.Vector2 = cache[".omm.v21"] || (cache[".omm.v21"] = new U1.Vector2());

            if (ev.buttons == 1)
            {
                if (!this.IsDraging)
                {
                    if (U1.Vector2.Distance(this.View.CurMv, this.View.OldDn) > 4)
                    {
                        var out: { attr?: number, part?: number } = {};

                        var prv = this.m_navThree.GetSnapedPoint(this.View.CurMv, out);

                        if (out.part != ScNavigatorThree.PARTS.None)
                        {
                            this.m_rotPlane.SetFromPointNormal(prv, U1.Vector3.UnitZ);
                        }
                        else
                        {
                            this.m_rotPlane.SetZero();
                        }

                        this.IsDraging = true;
                    }
                }
                else
                {
                    var prvMv = this.View.OldMv;
                    var curMv = this.View.CurMv;
                    var xcam = this.m_navThree.Camera;

                    if (!this.m_rotPlane.IsZero)
                    {

                        var ray0 = xcam.CalPickingRay(prvMv.X, prvMv.Y);
                        var ray1 = xcam.CalPickingRay(curMv.X, curMv.Y);
                        var p0 = new U1.Vector3();
                        var p1 = new U1.Vector3();

                        this.m_rotPlane.IntersectsLine(ray0.Position, ray0.Direction, p0);
                        this.m_rotPlane.IntersectsLine(ray1.Position, ray1.Direction, p1);

                        if (p0 != p1)
                        {
                            var cent = new U1.Vector3(0, 0, p0.Z);

                            var v0 = tv0.SetSubtract(p0, cent).Normalize();
                            var v1 = tv1.SetSubtract(p1, cent).Normalize();

                            var axis = tv2.SetCross(v0, v1).Normalize();
                            var ang = Math.acos(U1.Vector3.Dot(v1, v0));

                            this.OnOrbit(axis, -ang);
                        }
                    }
                    else
                    {
                        var delt = tv20.SetSubtract(curMv, prvMv);
                        delt.Scale(0.01);
                        var len = delt.Length();
                        var up = U1.Vector3.Normalize(xcam.Up, tv0);
                        var rt = U1.Vector3.Normalize(xcam.GetRight(tv1));

                        if (Math.abs(delt.X) > Math.abs(delt.Y))
                        {
                            this.OnOrbit(U1.Vector3.UnitZ, -delt.X);
                        }
                        else
                        {
                            this.OnOrbit(rt, delt.Y);
                        }
                    }
                }

                this.View.Invalidate();
            }
            else
            {
                this.IsDraging = false;
            }

            return true;
        }
        private OnOrbit(axis: U1.Vector3, p: number)
        {
            var cache = VcNavigator3Three;
            var tv0: U1.Vector3 = cache[".orb.v0"] || (cache[".orb.v0"] = new U1.Vector3());
            var tv1: U1.Vector3 = cache[".orb.v1"] || (cache[".orb.v1"] = new U1.Vector3());

            var workplane = this.View.WorkingPlane;
            var campos = this.Scene.Camera.Position;
            var camdir = this.Scene.Camera.GetDirection(tv0);
            var cent = tv1;

            if (workplane.IntersectsLine(campos, camdir, cent) == null)
                cent = this.Scene.Camera.LookAt; 
            this.Scene.Camera.Rotate(cent, axis, p);
        }
        CheckIntersect(isectContext: U1.ISectContext)
        {
            if (this.m_navThree == null || !this.m_navThree.Visible)
                return null;

            var result = this.m_navThree.CheckIntersect(isectContext);
            if (result != null)
            {
                var isect = result;
                isect.Source = this;
                isect.Distance = 0; 
                result = isect;
            }
            else
            {
                
            }

            return result;

            //return super.CheckIntersect(isectContext);
        }

        private _timerToken: number;
        private OnFitAxes(x: U1.Vector3, y: U1.Vector3, z: U1.Vector3)
        {
            if (this._timerToken !== undefined)
                clearInterval(this._timerToken); 

            var cam = this.View.Scene.Camera;
            var campos = cam.Position;
            var camdir = cam.GetDirection();

            var workPlane = this.View.WorkingPlane;
            var View = this.View;
            var Scene = this.Scene;

            var isectPos = new U1.Vector3();
            var dist = View.WorkingPlane.IntersectsLine(campos, camdir, isectPos);

            var loc = cam.Position;
            var lookat = dist == null ? cam.LookAt : U1.Vector3.ScaleAdd(campos, dist, camdir);
            
            var cx = cam.GetRight();
            var cy = cam.Up;
            var cz = cam.GetDirection().Scale(-1);

            var srcXM = U1.Matrix4.Identity;
            srcXM.Right = cx;
            srcXM.Up = cy;
            srcXM.Backward = cz;

            var tgtXM = U1.Matrix4.Identity;
            tgtXM.Right = x;
            tgtXM.Up = y;
            tgtXM.Backward = z;

            var distance = U1.Vector3.Distance(lookat, cam.Position);

            var res = U1.Views.ScCamera.GetRotation(srcXM, tgtXM);

            var axis = res.axis;
            var angle = res.angle;
            var roll = res.roll;

            var xcam = cam.GetCamera();
            if (angle < 0.1 && roll < 0.1)
                return;

            xcam.LookAt = lookat;

            var finish = () =>
            { 
                this.Scene.Camera.LookAt = lookat;
                this.Scene.Camera.Position = U1.Vector3.ScaleAdd(lookat, distance, z);
                this.Scene.Camera.Up = y;

                this.m_navThree.SetChanged();
                View.Invalidate();
            };

            var Lerp = this.Lerp;
            var a = 0.0;
            var self = this;
            self._timerToken = setInterval(
                () =>
                {
                    if (a <= 1 - 0.0001)
                    {
                        a += (1 - a) * 0.2;
                        var mcam = xcam.Clone();
                        mcam.Roll(Lerp(0, roll, a));
                        mcam.Rotate(lookat, axis, Lerp(0, angle, a));

                        var tpos = U1.Vector3.ScaleAdd(mcam.LookAt, -distance, mcam.Direction); 
                        Scene.Camera.LookAt = mcam.LookAt;
                        Scene.Camera.Position = tpos;
                        Scene.Camera.Up = mcam.Up;
                        View.Invalidate(); 
                    }
                    else
                    {
                        clearInterval(self._timerToken);
                        self._timerToken = undefined;
                        finish() ;
                    }
                },
                30
            );
        }
        private Lerp(src: number, tgt: number, amount: number)
        {
            return src * (1 - amount) + tgt * (amount);
        }
    }
}