namespace KBim
{
    export class Pr3D_Doc extends U1.Views.UDocumentPresenter
    {
        protected _bbx: U1.BoundingBox = new U1.BoundingBox;
        protected _xform: U1.Matrix4 = U1.Matrix4.Identity;// Matrix4.CreateScale(new Vector3(0.1, 0.1, 0.001));
        public get ScaleM(): U1.Matrix4
        {
            return this._xform;
        } 
        
        protected CreatePresenter(elm_: U1.UElement): U1.Views.UElementPresenter
        {  
            if (elm_ instanceof U1.Meshes.MMtl)
            {
                return new Pr3D_MMat();
            }
            else if (elm_ instanceof U1.Meshes.MMesh)
            {
                return new Pr3D_MMesh();
            }
            else if (elm_ instanceof U1.Meshes.MTexture)
            {
                return new Pr3D_MTexture();
            }
            else if (elm_ instanceof CdEntity) {
                if (elm_.FindAncestor(CdBlock) != null)
                    return null;

                return new Pr3D_CdEntity();
            }   
            return null;
        }
        public GetWorldBounding(): U1.BoundingBox
        {
            var kview = this.View as Views.KView;
            this._bbx.Min.CopyFrom(kview.Min);
            this._bbx.Max.CopyFrom(kview.Max);

            return this._bbx;
        }

        public Pick(isectContext: U1.ISectContext): U1.Views.PickResult {
            let res_isect: U1.ISectInfo = null;
            let view = isectContext.View;
            let isectInfo: U1.ISectInfo = null;
            let raycaster = new THREE.Raycaster();
            let mouse = { x: 0, y: 0 };
            let sceneThree = (this.View.Scene as KBim.Views.SceneThree);
            raycaster.params.Line.threshold = 0.01;
            raycaster.params.Points.threshold = 0.01;

            let selNode: KmNode;
            mouse.x = (view.X / this.View.Width) * 2 - 1;
            mouse.y = -(view.Y / this.View.Height) * 2 + 1;

            if (sceneThree.SceneMode == Views.SceneMode.Orthographic3D) 
                raycaster.setFromCamera(mouse, sceneThree.CamOrtho);
            else
                raycaster.setFromCamera(mouse, sceneThree.CamPersp);
             

            for (let c = 0; c < 2; c++) {

                let objs = c == 0
                    ? sceneThree.SceneOverlay.children
                    : sceneThree.SceneWorld.children;

                var intersects = raycaster.intersectObjects(objs, true);

                for (var i = 0; i < intersects.length; i++) {
                    let isectThree = intersects[i];

                    isectInfo = new U1.ISectInfo();
                    isectInfo.IsectPosition = KBim.Views.ThreeUtil.FromVector3(isectThree.point);
                    isectInfo.Distance = intersects[i].distance;

                    let obj = isectThree.object;
                    if (obj.visible) {
                        selNode = ViewPageContext.instance.getNode(obj, this.View);
                        if (selNode != null)
                            break;
                    }
                }
                if (selNode != null)
                    break;
            }

            let result: U1.Views.PickResult = null;
            if (selNode != null)
            {
                let res_node = new Pr3D_SelNode();
                res_node.KDoc = this.Document as KDocument;
                res_node.SelectedNode = selNode;
                res_node.Element = selNode;

                result = new U1.Views.PickResult();
                result.ISect = res_isect;
                result.Presenter = res_node;
               
            }
            return result;
        }
        public UpdateVisible() {
            let visibleContext = new KVisibleContext();
            let cam = this.View.Scene.Camera;
            visibleContext.CamPos = cam.Position.Clone();
            visibleContext.CamDir = cam.GetDirection();
 
            for (let mdl of ViewPageContext.instance.Models.values()) {
                mdl.updateVisibe(visibleContext);
            }
        }
    }
}