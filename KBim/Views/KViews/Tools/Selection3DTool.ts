/// <reference path="../../../../U1.d.ts" />
namespace KBim.Views
{
    export class Selection3DTool extends U1.Views.SelectionTool
    {
        constructor()
        {
            super();
        }

        public OnMouseMove(e: MouseEvent)
        {
            var tv0: U1.Vector2 = Selection3DTool[".omm.v20"]
                || (Selection3DTool[".omm.v20"] = new U1.Vector2());

            if (e.buttons === 2) {
                tv0.SetSubtract(this.View.CurMv, this.View.OldMv);
                this.View.Mode = U1.Views.ViewModes.Orbitting;
                this.View.Orbit(tv0);
                return true;
            }
            else {
                if (this.View.Mode == U1.Views.ViewModes.Orbitting) {
                    this.View.Mode = U1.Views.ViewModes.None;
                }
            }

            return super.OnMouseMove(e);
        }
    }
} 