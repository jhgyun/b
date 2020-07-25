namespace KBim.Views {
    export class VcTooltipBox extends U1.Views.VcControl {
        Position: U1.Vector3;
        Color: U1.Color;
        Tooltip: string;
        FID: string;
        svgG: SVGGElement;
        svgEllipse: SVGEllipseElement;

        Update(): void {
            var view = (this.View as View3DThree);
            if (this.svgG == null)
            {
                var svgns = "http://www.w3.org/2000/svg";
                this.svgG = document.createElementNS(svgns, 'g') as SVGGElement;

                var svgOverlay = (this.View as View3DThree).SvgOverlay;
                if (svgOverlay == null)
                    return;
                 
                svgOverlay.appendChild(this.svgG);  
                var rect = document.createElementNS(svgns, 'rect') as SVGRectElement;
                rect.style.strokeWidth = "2px";
                rect.style.strokeDasharray = "5,5";
                rect.setAttribute("width","100px");
                rect.setAttribute("height", "100px");
                rect.setAttribute("opacity", "0.5"); 
                rect.style.fill = "gray";
                rect.addEventListener("click",
                    (e_) => {
                        alert(this.FID + "clicked");
                    });

                this.svgG.appendChild(rect);

                var text = document.createElementNS(svgns, 'text') as SVGTextElement;
                text.textContent = this.Tooltip;
                text.setAttribute("x", "2px");
                text.setAttribute("y", "40px");
                this.svgG.appendChild(text);
            } 

            var sp = this.View.Scene.Camera.WorldToScreen(this.Position);
            this.svgG.setAttribute("transform", "matrix(1 0 0 1 " + sp.X + " " + sp.Y + ")"); 

        }
        Clear(): void {
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