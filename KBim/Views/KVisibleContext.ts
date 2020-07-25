namespace KBim {
    export class KVisibleContext {
        CamPos: U1.Vector3;
        CamDir: U1.Vector3;
        view: Views.KView;
        HideDetailDist = 20; 
        DisposeDetailDist = 50; 
        HideLodDist = 100;  
        InvisiblePixelSize = 10;
        Is3D: boolean = true;
        WMin: U1.Vector3;
        WMax: U1.Vector3;
        WWidth: number;
        WHeight: number;
        WtoS: number;
        WRadOut: number;
        WRadIn: number;

        static _v20 = U1.Vector2.Zero;
        static _v21 = U1.Vector2.Zero;
        static _vc0 = new KVisibleContext();
        static _vc1 = new KVisibleContext();
        static _vc2 = new KVisibleContext();

        static get2D(view: KBim.Views.KView, result?: KVisibleContext): KVisibleContext {
            result = result ?? new KVisibleContext();

            let cam = view.Scene.Camera;

            let cent = cam.Position.Clone();
            result.CamPos = cent;
            result.CamDir = cam.GetDirection();
            result.Is3D = false;

            let h = cam.OrthoHeight;
            let w = cam.Aspect * h;

            result.WMin = U1.Vector3.Add(cent, new U1.Vector3(-w / 2, -h / 2, 0));
            result.WMax = U1.Vector3.Add(cent, new U1.Vector3(w / 2, h / 2, 1));
            result.WWidth = w;
            result.WHeight = h;
            result.WtoS = view.Height / h;
            result.WRadOut = Math.max(h / 2, w / 2);
            result.WRadIn = Math.min(h / 2, w / 2);

            return result;
        }
        check2D(node: KmNode, res?: { dist: number } ): number {
            let nodeCtx = node.node2Context;
            if (nodeCtx.isPrimeMesh) {
                return 1;
            }

            let invisible = false;
            let grad = node.geomRad * this.WtoS;
            if (grad < this.InvisiblePixelSize)
                invisible = true;

            let geCent = node.geomCent;
            let geRad = node.geomRad;

            if (invisible ||
                geCent.X - geRad > this.WMax.X ||
                geCent.Y - geRad > this.WMax.Y ||
                geCent.X + geRad < this.WMin.X ||
                geCent.Y + geRad < this.WMin.Y) {
                invisible = true;
            }

            let dist = U1.Vector2.Distance(
                this.CamPos.XY(KVisibleContext._v20),
                node.geomCent.XY(KVisibleContext._v21));

            dist -= (this.WRadOut + node.geomRad);
            if (res != null)
                res.dist = dist;

            if (dist > this.DisposeDetailDist) {
                return -1; //dispose
            }
            else if (invisible || dist > this.HideDetailDist) {
                return 0; // hide
            }
            else {
                return 1; // show
            }
        }
    }
}