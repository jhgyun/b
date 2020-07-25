namespace U1.VD
{
    export class DrawBoxTool extends U1.Views.DefaultTool
    {
        static w: number = 10;
        static h: number = 10;
        static l: number = 10;

        OnAttach(view: Views.ViewBase)
        {
        }
        OnDetach(view: Views.ViewBase)
        { 
        }

        OnMouseDown(ev: MouseEvent): boolean
        {
            if (IsLeftMouseDown(ev))
            {
                let pos = this.View.ScreenToWorkingPlane(this.View.CurDn);

                this.View.Document.BeginTransaction(); 

                //let box = VdActions.AddBox(DrawBoxTool.w, DrawBoxTool.h, DrawBoxTool.l);
                //box.Transform = Matrix4.CreateTranslation(pos);

                this.View.Document.EndTransaction();

                return true;
            }

            return true;
        }
        OnMouseUp(ev: MouseEvent): boolean
        {
            this.isPanning = false;

            if (IsLeftMouseUp(ev))
            {
                return true;
            }

            this.View.ActiveTool = null;
            return true;
        }
        
        GetOptions(): UPropertyBase[]
        {
            let options: UPropertyBase[] = [
                new UPropDouble({
                    GetValueFunc: () => DrawBoxTool.w,
                    SetValueFunc: (p_, v_) =>  DrawBoxTool.w = v_,
                    Label:"W"
                }),
                new UPropDouble({
                    GetValueFunc: () => DrawBoxTool.h,
                    SetValueFunc: (p_, v_) => DrawBoxTool.h = v_,
                    Label:"H"
                }),
                new UPropDouble({
                    GetValueFunc: () => DrawBoxTool.l,
                    SetValueFunc: (p_, v_) => DrawBoxTool.l = v_,
                    Label: "L"
                }),
            ];

            return options; 
        }
    }
}