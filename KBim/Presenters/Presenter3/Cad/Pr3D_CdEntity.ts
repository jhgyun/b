namespace KBim {
    export class Pr3D_CdEntity extends U1.Views.UElementPresenter3D {

        protected ver = -1;
        protected updateVer = -1;
        protected _lineInfos: U1.Views.ScLineBatchItem[];
        protected _text3s: U1.Views.ScText[];
        protected _meshes: U1.Views.ScMeshBatchItem[];
        protected _overMeshes: U1.Views.ScMeshBatchItem[];
        protected _tooltip:  Views.VcTooltipBox;
        protected _z: number = -100;

        public get Entity(): CdEntity {
            return this.Element as CdEntity;
        }
       
        OnClear() {
            if (this._lineInfos != null) { 
                for (var ln of this._lineInfos)
                {
                    ln.Remove();
                }
            }

            if (this._text3s != null) {
                for (var tx3 of this._text3s) {
                    tx3.Dispose();
                }
            } 
            if (this._meshes != null) {
                for (var mi of this._meshes) {
                    mi.Remove();
                }
            }
            if (this._overMeshes != null) {
                for (var mi of this._overMeshes) {
                    mi.Remove();
                }
            }
            this._lineInfos = undefined;
            this._text3s = undefined;
            this._meshes = undefined;
            this._overMeshes = undefined;

            super.OnClear();

        }
         
        protected OnUpdate()
        {
            if (!this.Visible())
            {
                this.OnClear();
                return;
            }
            if ((this._lineInfos == null &&
                this._text3s == null && this._meshes == null) ||
                this.ver != this.updateVer) {
                this.OnClear();

                this.ShowEntity(this.Entity);
                this.updateVer = this.ver;
            }

            if (this.Entity instanceof CdPolyline2d)
            {
                if (this.Entity.ShowTooltip)
                {
                    this.ShowTooltop();
                }
                else
                {
                    this.HideTooltip();
                }

                var layer_name = this.Entity.LayerName;
                var prefix = layer_name.substr(0, layer_name.indexOf('_'));
                if (prefix == "01")
                {
                    this._z = -10;
                    this.FillPolygon(this.Entity, U1.Colors.LightBlue ); 
                }
                else if (prefix == "02")
                {
                    this._z = -5; 
                    this.FillPolygon(this.Entity, U1.Colors.LightGray );  
                }
                else if (prefix == "03")
                {
                    this._z = -3;

                    this.FillPolygon(this.Entity, U1.Colors.LightGreen );
                }
                else if (prefix == "04")
                {
                    this._z = -1; 
                    this.FillPolygon(this.Entity, U1.Colors.LightSalmon );
                }
            }
        }
        protected ShowEntity(geom: U1.UGeomElement): void { 

            if (geom instanceof CdEntity) {
                var pm = (this.DocumentPresesnter as Pr3D_Doc).ScaleM;

                this.ShowEntity1(pm, geom as CdEntity);
            }
        }

        protected ShowEntity1(wm: U1.Matrix4, entity: CdEntity) { 
            if (entity instanceof CdBlockReference)
            {
                var blockRef = entity as CdBlockReference;
                if (blockRef.Block == null || blockRef.Block.Entities == null)
                    return;

                wm = U1.Matrix4.Multiply(entity.Transform, wm);

                for (var ent of blockRef.Block.Entities)
                {
                    this.ShowEntity1(wm, ent);
                }
                return;
            }

            var geoms: U1.Geoms.GeEntity[] = [];
            entity.UpdateGeoms(geoms);

            for (var geom of geoms)
            {
                if (geom instanceof U1.Geoms.GeLine)
                {
                    this.ShowLine(wm, geom);
                }
                else if (geom instanceof U1.Geoms.GePolygon)
                {
                    this.ShowPolygon(wm, geom);
                }
                else if (geom instanceof U1.Geoms.GePolyline)
                {
                    this.ShowPolyline(wm, geom);
                }
                else if (geom instanceof U1.Geoms.GeText)
                {
                    this.ShowText(wm, geom);
                }
            }
        }
        protected ShowLine(wm: U1.Matrix4, geLine: U1.Geoms.GeLine) {
            var sceneThree = this.Scene as Views.SceneThree;

            var lineBatch: U1.Views.ScLineBatch = null;  
            lineBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScLineBatch, "CadEntities");  
            var item = lineBatch.AddItem();
            item.Path = [geLine.Start, geLine.End];
            item.Color = geLine.Color;
            item.Transform = wm; 
            if (this._lineInfos == null)
                this._lineInfos = []; 
            this._lineInfos.push(item);
        }

        protected ShowPolygon(wm: U1.Matrix4, gePolygon: U1.Geoms.GePolygon) {
           
            var lineBatch: U1.Views.ScLineBatch = null;
            lineBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScLineBatch, "CadEntities");
            var points = gePolygon.Points.map(o_ => new U1.Vector3(o_));
            points.push(points[0]);
             
            var item = lineBatch.AddItem();
            item.Path = points;
            item.Color = gePolygon.Color;
            item.Transform = wm;

            if (this._lineInfos == null)
                this._lineInfos = [];
            this._lineInfos.push(item);

            if (gePolygon instanceof U1.Geoms.GePolygonFill)
            {
                try {
                    var triangles = U1.Views.ScPolyLine.Tesselate(gePolygon.Points);
                    var geom = U1.MeshBufferGeometry.CreateFromTriangles(triangles);
                    var meshBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScMeshBatch, "CadEntitiesMesh");

                    var mi = meshBatch.AddItem();
                    mi.Geom = geom;
                    mi.Color = gePolygon.FillColor;
                    mi.Transform = wm;

                    if (this._meshes == null)
                        this._meshes = [];
                    this._meshes.push(mi);
                }
                catch (ex)
                { 
                }
              
            }
        }

        protected ShowPolyline(wm: U1.Matrix4, gePolyline: U1.Geoms.GePolyline) {
            var lineBatch: U1.Views.ScLineBatch = null;
            lineBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScLineBatch, "CadEntities");
            var points = gePolyline.Points.map(o_ => new U1.Vector3(o_));
            points.push(points[0]);  
            var points = gePolyline.Points.map(o_ => new U1.Vector3(o_)); 

            var item = lineBatch.AddItem();
            item.Path = points;
            item.Color = gePolyline.Color;
            item.Transform = wm;

            if (this._lineInfos == null)
                this._lineInfos = [];
            this._lineInfos.push(item);

            if (gePolyline instanceof U1.Geoms.GePolylineFill) {
                try {
                    var triangles = U1.Views.ScPolyLine.Tesselate(gePolyline.Points);
                    var geom = U1.MeshBufferGeometry.CreateFromTriangles(triangles);
                    var meshBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScMeshBatch, "CadEntitiesMesh");

                    var mi = meshBatch.AddItem();
                    mi.Geom = geom;
                    mi.Color = gePolyline.FillColor;
                    mi.Transform = wm;

                    if (this._meshes == null)
                        this._meshes = [];
                    this._meshes.push(mi);
                } catch (ex)
                {

                }
            }
        }
        protected ShowText(wm: U1.Matrix4, geText: U1.Geoms.GeText)
        { 
            wm = U1.Matrix4.CreateRotationZ(geText.Rotation)
                .Multiply(U1.Matrix4.CreateTranslation(geText.Position))
                .Multiply(wm); 

            var text3 = this.Scene.World.AddEntity(U1.Views.ScText);

            var style: U1.Views.ScTextStyle;
            text3.Style = style = new U1.Views.ScTextStyle();
            style.Fill = geText.Color; 
            text3.FontSize =  geText.FontSize;
            text3.Text = geText.Text;
            text3.Width = geText.Width;
            text3.Height = geText.Height;  
            text3.Transform = wm;

            if (this._text3s == null)
                this._text3s = [];
            this._text3s.push(text3); 
        }
        UpdateBoundingBox(): void {
            if (this._lineInfos != null) {
                var min = U1.Vector3.MaxValue;
                var max = U1.Vector3.MinValue;
                for (var lin of this._lineInfos)
                {
                    min.Minimize(U1.Vector3.Min1(lin.Path));
                    max.Maximize(U1.Vector3.Max1(lin.Path));
                }
                this._lbb = U1.BoundingBox.CreateFromPoints([min,max]);
            } 
        }
        public OnElementPropertyChanged(sender: U1.UElement, prop: string): void {
            if (prop == "ShowTooltip")
            {
                if (this.Element instanceof CdPolyline2d)
                {
                    if (this.Element.ShowTooltip)
                        this.ShowTooltop();
                    else
                        this.HideTooltip();
                }

                this.Invalid = true;
                this.View.Invalidate();
            } 
        }
        public CheckIntersect(isectContext: U1.ISectContext): U1.ISectInfo
        {
            var result: U1.ISectInfo = null;
            if (this._lineInfos != null) {
                for (let line of this._lineInfos) {
                    var isect = line.Intersect(isectContext);
                    if (isect != null && (result == null || isect.Distance < result.Distance)) {
                        isect.Source = this;

                        result = isect;
                    }
                }
            }
            if (this._meshes != null)
            {
                for (let mi of this._meshes)
                {
                    var isect = mi.Intersect(isectContext);
                    if (isect != null && (result == null || isect.Distance < result.Distance))
                    {
                        isect.Source = this;

                        result = isect;
                    }
                }
            }
            if (this._text3s != null) {
                for (let text of this._text3s) {
                    var isect = text.Intersect(isectContext);
                    if (isect != null && (result == null || isect.Distance < result.Distance)) {
                        isect.Source = this; 
                        result = isect;
                    }
                }
            }
            return result;
        }
        public CheckContains(context: U1.ContainContext): boolean {

            var contains: boolean  = null;
            var ckCross = context.AllowCross;

            if (this._lineInfos != null)
            {
                for (let lineinfo of this._lineInfos)
                {
                    var isect = lineinfo.Contains(context.SelectionPlanes, ckCross);
                    if (isect == true && ckCross)
                        return true;
                    if (isect == false && !ckCross)
                        return false;

                    contains = isect;
                }
            }

            if (this._meshes != null)
            {
                for (let mi of this._meshes)
                {
                    var isect = mi.Contains(context.SelectionPlanes, ckCross);
                    if (isect == true && ckCross)
                        return true;
                    if (isect == false && !ckCross)
                        return false;

                    contains = isect;
                }
            }

            if (contains != true && this._text3s != null) {
                for (let tex of this._text3s) {
                    var isect = tex.Contains(context.SelectionPlanes, ckCross);
                    if (isect == true && ckCross)
                        return true;
                    if (isect == false && !ckCross)
                        return false;

                    contains = isect;
                }
            }
            return contains != null ? contains : false;
        }

        protected OnSelected() {
            var hide = true;
            if (hide)
            {
                if (this._lineInfos != null)
                {
                    for (let li of this._lineInfos)
                    {
                        if (li["_oldColor"] == undefined)
                            li["_oldColor"] = li.Color;

                        li.Color = Pr3D_CdEntity.SelectStrokeColor;
                    }
                }
                if (this._text3s != null)
                {
                    for (let li of this._text3s)
                    {
                        if (li["_oldColor"] == undefined)
                            li["_oldColor"] = li.Style.Fill;

                        li.Style.Fill = Pr3D_CdEntity.SelectStrokeColor;
                    }
                }

                if (this.Element instanceof CdPolyline2d)
                {
                    this.FillPolygon(this.Element);
                    this.Element.ShowTooltip = true;
                }
            }
        }
        protected OnDeselected() {
            if (this._lineInfos != null) {
                for (var li of this._lineInfos) {
                    if (li["_oldColor"] != undefined)
                        li.Color = li["_oldColor"]; 
                }
            }
            if (this._text3s != null) {
                for (let li of this._text3s) {
                    if (li["_oldColor"] != undefined)
                        li.Style.Fill = li["_oldColor"];
                }
            }
            if (this.Element instanceof CdPolyline2d) {
                this.ClearPolygon(this.Element);
                this.Element.ShowTooltip = false;
            }
        }
        private FillPolygon(polygon: CdPolyline2d, fill_color: U1.Color = U1.Colors.Red): void
        {
            var wm = U1.Matrix4.Multiply(this.Transform, U1.Matrix4.CreateTranslation(new U1.Vector3(0, 0, this._z)));
            var triangles = U1.Views.ScPolyLine.Tesselate(polygon.Path3);
            var geom = U1.MeshBufferGeometry.CreateFromTriangles(triangles);
            var meshBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScMeshBatch, "CadEntitiesMesh_OV" + fill_color.toString());

            var mi = meshBatch.AddItem();
            mi.Geom = geom;
            mi.Color = fill_color ;
            mi.Transform = wm;

            if (this._meshes == null)
                this._meshes = [];
            this._meshes.push(mi);
        }
        private ClearPolygon(polygon: CdPolyline2d): void {
            if (this._meshes != null) {
                for (var mi of this._meshes) {
                    mi.Remove();
                }
            }
            this._meshes = undefined;
        }
        private ShowTooltop() {
            if (this._tooltip == null)
            {
                var bbx = this.Entity.BoundingBox;
                var cent = U1.Vector3.Add(bbx.Min, bbx.Max).Scale(0.5);

                this._tooltip = this.View.Controls.AddControl(Views.VcTooltipBox);
                this._tooltip.Position = cent;
                this._tooltip.FID = ""+this.Entity.ID;
                this._tooltip.Tooltip = "" + this.Entity.ID; 
            }
        }
        private HideTooltip() {
            if (this._tooltip != null)
            {
                this._tooltip.Dispose();
                this._tooltip = undefined;
            }
        }
    }
}