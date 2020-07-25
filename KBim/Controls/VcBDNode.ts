namespace KBim.Views
{
    export class VcBDNode extends U1.Views.VcControl
    {
        Position: U1.Vector3;
        Color: U1.Color;
        Text: string;
        svgG: SVGGElement;
        TextResoNm: string;
        TextIpAddr: string;

        Update(): void
        {
            //let scText: U1.Views.ScText = this.View.Scene.Overlay.AddEntity(U1.Views.ScText);
            //scText.Transform.SetCreateTranslation(this.Position);
            //scText.Text = this.Text;
            //scText.FontSize = 50;

            //let canvas = (this.View as ViewThree).Canvas;
            //let context = (this.View as ViewThree).RenderingContext2D;
            //context.font = "30px Arial";
            //context.fillText("Hello World", this.Position.X, this.Position.Y);

            var view = (this.View as View3DThree);
            if (this.svgG == null)
            {
                var svgns = "http://www.w3.org/2000/svg";
                this.svgG = document.createElementNS(svgns, 'g') as SVGGElement;

                var svgOverlay = (this.View as View3DThree).SvgOverlay;
                if (svgOverlay == null)
                    return;

                svgOverlay.appendChild(this.svgG);

                //var rect = document.createElementNS(svgns, 'rect') as SVGRectElement;
                //rect.style.strokeWidth = "2px";
                //rect.style.strokeDasharray = "5, 5";
                //rect.setAttribute("width", "100px");
                //rect.setAttribute("height", "100px");
                //rect.setAttribute("opacity", "0.01");
                //rect.style.fill = "white";
                //rect.addEventListener("click",
                //    (e_) =>
                //    {
                //        //alert(this.FID + "clicked");
                //    });

                //this.svgG.appendChild(rect);

                var text = document.createElementNS(svgns, 'text') as SVGTextElement;
                text.textContent = this.Text;
                text.setAttribute("x", "0" + "px");
                text.setAttribute("y", "0" + "px");
                text.setAttribute("text-anchor", "middle");

                this.svgG.appendChild(text);

                var textResoNm = document.createElementNS(svgns, 'text') as SVGTextElement;
                textResoNm.textContent = this.TextResoNm;
                textResoNm.setAttribute("x", "0" + "px");
                //textResoNm.setAttribute("y", 40000 / this.View.Scene.Camera.OrthoHeight + "px");
                textResoNm.setAttribute("y", 10000 / this.View.Scene.Camera.OrthoHeight + "px");
                textResoNm.setAttribute("text-anchor", "middle");

                this.svgG.appendChild(textResoNm);

                var textIpAddr = document.createElementNS(svgns, 'text') as SVGTextElement;
                ////textIpAddr.textContent = this.TextIpAddr;
                //textIpAddr.textContent = this.TextIpAddr.substring(0, 15);
                textIpAddr.textContent = this.TextIpAddr.substring(0, 31);
                textIpAddr.setAttribute("x", "0" + "px");
                //textIpAddr.setAttribute("y", 40000 / this.View.Scene.Camera.OrthoHeight * 2 + "px");
                textIpAddr.setAttribute("y", 10000 / this.View.Scene.Camera.OrthoHeight * 2 + "px");
                textIpAddr.setAttribute("text-anchor", "middle");

                this.svgG.appendChild(textIpAddr);
            }

            if (this.svgG.childNodes.length > 0)
            {
                let textChild = this.svgG.childNodes.item(0) as SVGTextElement;
                //textChild.setAttribute("font-size", 40000 / this.View.Scene.Camera.OrthoHeight + "");
                //textChild.setAttribute("font-size", 40000 / this.View.Scene.Camera.OrthoHeight + "");
                textChild.setAttribute("font-size", 10000 / this.View.Scene.Camera.OrthoHeight + "");

                let textChild1 = this.svgG.childNodes.item(1) as SVGTextElement;
                //textChild.setAttribute("font-size", 40000 / this.View.Scene.Camera.OrthoHeight + "");
                //textChild1.setAttribute("font-size", 40000 / this.View.Scene.Camera.OrthoHeight + "");
                //textChild1.setAttribute("y", 40000 / this.View.Scene.Camera.OrthoHeight + "px");
                textChild1.setAttribute("font-size", 10000 / this.View.Scene.Camera.OrthoHeight + "");
                textChild1.setAttribute("y", 10000 / this.View.Scene.Camera.OrthoHeight + "px");

                let textChild2 = this.svgG.childNodes.item(2) as SVGTextElement;
                //textChild.setAttribute("font-size", 40000 / this.View.Scene.Camera.OrthoHeight + "");
                //textChild2.setAttribute("font-size", 40000 / this.View.Scene.Camera.OrthoHeight + "");
                //textChild2.setAttribute("y", 40000 / this.View.Scene.Camera.OrthoHeight * 2 + "px");
                textChild2.setAttribute("font-size", 10000 / this.View.Scene.Camera.OrthoHeight + "");
                textChild2.setAttribute("y", 10000 / this.View.Scene.Camera.OrthoHeight * 2 + "px");
            }

            var sp = this.View.Scene.Camera.WorldToScreen(this.Position);
            this.svgG.setAttribute("transform", "matrix(1 0 0 1 " + (sp.X) + " " + (sp.Y) + ")");
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