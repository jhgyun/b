namespace KBim.Views
{
    export class ScPointThree extends U1.Views.ScPoint
    { 
        private static _p1 = new U1.Vector3();
        private static _p2 = new U1.Vector3();
        private static _p3 = new U1.Vector3(); 

        private svgEllipse: SVGEllipseElement;

        public get KView()
        {
            return this.Scene.View as KView;
        }

        protected OnUpdate(context: U1.Views.UpdateContext)
        {
            if (this.Ver === this.UpdateVer)
            {
                return;
            }

            this.UpdateVer = this.Ver;
        }
        protected OnDraw(context: U1.Views.DrawContext)
        {
            if (context.IsScreenSpace)
            {
                this.OnDrawScreen(context);
            }
        }

        protected OnDrawScreen(context: U1.Views.DrawContext)
        {
            if (this.svgEllipse == null)
            {
                var svgOverlay = this.KView.SvgOverlay;
                if (svgOverlay == null)
                    return;

                var svgNS = "http://www.w3.org/2000/svg";

                this.svgEllipse = document.createElementNS(svgNS, 'ellipse') as SVGEllipseElement;
                svgOverlay.appendChild(this.svgEllipse);
            }

            var ellipse = this.svgEllipse;

            var style = this.Style;
            ellipse.style.strokeWidth = style.StrokeThickness + "px";
            ellipse.style.strokeDasharray = style.StrokeDash != null ? style.StrokeDash.join(",") : "none";
            ellipse.style.fill = style.FillStr;
            ellipse.style.stroke = style.StrokeStr;
            ellipse.style.opacity = "" + style.Alpha;
             
            var wm = this.WorldTransform;
            var pos = this.Position;
            var radius = this.Radius;

            let cp = U1.Vector3.Transform(pos, wm, ScPointThree._p1);
            cp = context.WorldToScreen(cp, cp);

            ellipse.setAttribute("cx", cp.X.toString());
            ellipse.setAttribute("cy", cp.Y.toString());

            ellipse.setAttribute("rx", radius.toString());
            ellipse.setAttribute("ry", radius.toString());

        }
        protected OnClear()
        {
            if (this.svgEllipse != null)
            {
                var svgOverlay = this.KView.SvgOverlay;
                if (svgOverlay == null)
                    return;

                svgOverlay.removeChild(this.svgEllipse);
                this.svgEllipse = undefined;
            }
        }
    }
}