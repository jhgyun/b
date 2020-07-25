/// <reference path="../Presenter3/Pr3D_Doc.ts" />
namespace KBim
{
    export class Pr2D_Doc extends Pr3D_Doc
    { 
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
         
        public Pick(isectContext: U1.ISectContext): U1.Views.PickResult {
            let res_isect: U1.ISectInfo = null;
            let view = isectContext.View;
            let isectInfo: U1.ISectInfo = null;
            let raycaster = new THREE.Raycaster();
            raycaster.params.Line.threshold = 0.01;
            raycaster.params.Points.threshold = 0.01;

            let mouse = { x: 0, y: 0 };
            let sceneThree = (this.View.Scene as KBim.Views.SceneThree);
            
            let selNode: KmNode;
            mouse.x = (view.X / this.View.Width) * 2 - 1;
            mouse.y = -(view.Y / this.View.Height) * 2 + 1;

            raycaster.setFromCamera(mouse, sceneThree.CamOrtho);

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
            let kview = this.View as KBim.Views.KView;
            let visibleContext = KVisibleContext.get2D(kview, KVisibleContext._vc0);  

            for (let mdl of ViewPageContext.instance.Models.values()) {
                mdl.updateVisibe(visibleContext);
            }
        }
    }
}