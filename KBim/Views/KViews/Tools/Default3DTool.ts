namespace KBim.Views
{
    export class Default3DTool extends U1.Views.DefaultTool
    {
        constructor()
        {
            super(); 
        }

        OnMouseMove(ev: MouseEvent)
        {
            var tv0: U1.Vector2 = Default3DTool[".omm.v20"] || (Default3DTool[".omm.v20"] = new U1.Vector2());
            
            if (ev.buttons === 4)
            {
                tv0.SetSubtract(this.View.CurMv, this.View.OldMv);
                this.View.Orbit(tv0);
                return true;
            }

            return super.OnMouseMove(ev);
        }
    }
}