namespace KBim.Views
{
    export class ScPolygonThree extends U1.Views.ScPolygon
    {
        private static _p1 = new U1.Vector3();
        private static _p2 = new U1.Vector3();
        private static _p3 = new U1.Vector3();
        private static _empty_dash: number[] = [];
        private _scnPoints: U1.Vector3[] = [];

        private svgPolygon: SVGPolygonElement;

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
            if (this.svgPolygon == null)
            {
                var svgOverlay = this.KView.SvgOverlay;
                if (svgOverlay == null)
                    return;

                var svgNS = "http://www.w3.org/2000/svg";

                this.svgPolygon = document.createElementNS(svgNS, 'polygon') as SVGPolygonElement;
                svgOverlay.appendChild(this.svgPolygon);
            }

            var pgon = this.svgPolygon;

            var style = this.Style;
            pgon.style.strokeWidth = style.StrokeThickness  + "px";
            pgon.style.strokeDasharray = style.StrokeDash != null ? style.StrokeDash.join(",") : "none";
            pgon.style.fill = style.FillStr;
            pgon.style.stroke = style.StrokeStr; 
            pgon.style.opacity = "" + style.Alpha;

            var lps = this.Points;
            var sps = this._scnPoints;
            var wm = this.WorldTransform;

            var plen = sps.length = lps.length;
            for (var i = 0; i < plen; i++)
            {
                sps[i] = U1.Vector3.Transform(lps[i], wm, sps[i]);
                sps[i] = context.WorldToScreen(sps[i], sps[i]);
            }

            var ps_attr = sps.map(o_ => "" + Math.round(o_.X) + "," + Math.round(o_.Y)).join(',');  
            pgon.setAttribute("points", ps_attr);
        }
        protected OnClear()
        {
            if (this.svgPolygon != null)
            {
                var svgOverlay = this.KView.SvgOverlay;
                if (svgOverlay == null)
                    return;

                svgOverlay.removeChild(this.svgPolygon);
                this.svgPolygon = undefined;
            }
        }
    }
}