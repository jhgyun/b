namespace KBim.Views
{ 
    export class ScTextThree extends U1.Views.ScText
    {
        private static unit_x = U1.Vector3.UnitX;
        private static _p0 = new U1.Vector3();
        private static _p1 = new U1.Vector3();
        private static _p2 = new U1.Vector3();
        private static _p3 = new U1.Vector3();
        private static _p4 = new U1.Vector3();
        private static _p5 = new U1.Vector3();
        private static _p6 = new U1.Vector3();
        private static _p7 = new U1.Vector3();

        protected OnDraw(context: U1.Views.DrawContext) {
            var view = this.Scene.View as View3DThree; 
            var contextX = context as DrawContextThree;
            var context2D = view.RenderingContext2D; 

            var wm = this.WorldTransform;

            var p0 = ScTextThree._p0;
            var p1 = ScTextThree._p1;
            var p2 = ScTextThree._p2;
            var p3 = ScTextThree._p3;
            var p4 = ScTextThree._p4;
            var p5 = ScTextThree._p5;
            var p6 = ScTextThree._p6;

            var min = this.BoundingBox.Min;
            var max = this.BoundingBox.Max;

            var lb = p0.Set(min.X, min.Y, 0).Transform(wm);
            var rb = p1.Set(max.X, min.Y, 0).Transform(wm);
            var rt = p2.Set(max.X, max.Y, 0).Transform(wm);
            var lt = p3.Set(min.X, max.Y, 0).Transform(wm);


            if (!context.IsScreenSpace) {
                context.WorldToScreen(lb, lb);
                context.WorldToScreen(rb, rb);
                context.WorldToScreen(rt, rt);
                context.WorldToScreen(lt, lt);
            }

            var right = p4.Set(rb.X - lb.X, rb.Y - lb.Y, 0);
            var ydir0 = p5.Set(-right.Y, right.X, 0);
            var ydir1 = p6.Set(lt.X - lb.X, lt.Y - lb.Y, 0);

            var loc = lb;
            if (U1.Vector3.Dot(ydir0, ydir1) > 0) {
                loc = lt;
            }

            var style = this.Style;

            if ( style.Background != null) {
                context2D.save();
                context2D.fillStyle = "rgba(100,100,100,255)";// style.BackgroundStr;

                context2D.beginPath();
                context2D.moveTo(lb.X, lb.Y);
                context2D.lineTo(rb.X, rb.Y);
                context2D.lineTo(rt.X, rt.Y);
                context2D.lineTo(lt.X, lt.Y);
                context2D.closePath();
                context2D.fill();
                context2D.restore();
            }

            context2D.save();  
            
            if (contextX.ShowTextBounding) {
                context2D.beginPath();
                context2D.moveTo(lb.X, lb.Y);
                context2D.lineTo(rb.X, rb.Y);
                context2D.lineTo(rt.X, rt.Y);
                context2D.lineTo(lt.X, lt.Y);
                context2D.closePath();

                context2D.stroke();
            }
            context2D.restore();

            context2D.save(); 
            context2D.fillStyle = style.FillStr;

            var h = U1.Vector3.Distance(lb, lt);
            h /= this.Lines.length;

            context2D.font = "10px";// "" + Math.round(h) + "px"; 
            right.Normalize();

            var a = U1.Vector3.Dot(ScTextThree.unit_x, right);
            a = Math.acos(a);

            if (right.Y < 0)
                a *= -1;

            h = h / 10; //기본폰트 크기 10px

            var lines = this.Lines;
            var lstart = ScTextThree._p7.CopyFrom(loc);
             
            context2D.translate(lstart.X, lstart.Y);
            context2D.rotate(a); 
            context2D.scale(h, h);
             
            var line_num = lines.length;
            for (var i = 0; i < line_num; i++) {
                context2D.fillText(lines[i], 0, 10 * i - 10 * (line_num - 1) - 1);
            } 
             
            context2D.restore(); 
        }
    }
}