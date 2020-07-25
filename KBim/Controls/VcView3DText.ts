namespace KBim.Views
{
    export class VcView3DText extends U1.Views.VcControl
    {
        Position: U1.Vector3;
        Color: U1.Color;
        Text: string;
        svgG: SVGGElement;

        Update(): void
        {
            var view = (this.View as View3DThree);
            if (this.svgG == null)
            {
                var svgns = "http://www.w3.org/2000/svg";
                this.svgG = document.createElementNS(svgns, 'g') as SVGGElement;

                var svgOverlay = (this.View as View3DThree).SvgOverlay;
                if (svgOverlay == null)
                    return;

                svgOverlay.appendChild(this.svgG);

                var text = document.createElementNS(svgns, 'text') as SVGTextElement;
                text.textContent = this.Text;
                text.setAttribute("x", "0" + "px");
                text.setAttribute("y", "0" + "px");
                text.setAttribute("text-anchor", "middle");

                this.svgG.appendChild(text);
            }

            if (this.svgG.childNodes.length > 0)
            {
                let textChild = this.svgG.childNodes.item(0) as SVGTextElement;
                //textChild.setAttribute("font-size", 40000 / 300 / this.View.Scene.Camera.OrthoHeight + "");
                if (this.View.Scene.Camera.ProjectionMode == U1.ProjectionTypeEnum.Orthographic)
                {
                    textChild.setAttribute("font-size", 40000 / 420 / this.View.Scene.Camera.OrthoHeight + "");
                }
                else
                {
                    textChild.setAttribute("font-size", 40000 / 30 / this.View.Scene.Camera.OrthoHeight + "");
                }
            }

            var sp = this.View.Scene.Camera.WorldToScreen(this.Position);
            this.svgG.setAttribute("transform", "matrix(1 0 0 1 " + (sp.X) + " " + (sp.Y) + ")");

            this.View.Invalidate();
        }

        Clear(): void
        {
            if (this.svgG != null)
            {
                var svgOverlay = (this.View as View3DThree).SvgOverlay;
                if (svgOverlay == null)
                    return;

                svgOverlay.removeChild(this.svgG);
                this.svgG = undefined;
            }
        }
    }
}