namespace KBim.Views
{
    export enum SceneMode
    {
        Orthographic2D,
        Orthographic3D,
        Perspective2D,
        Perspective3D
    }

    export class SceneThree extends U1.Views.Scene
    {
        private _cam3d: THREE.PerspectiveCamera;
        private _cam2d: THREE.OrthographicCamera;
        private _renderer: THREE.WebGLRenderer;
        private _sceneWorld: THREE.Scene;
        private _sceneOverlay: THREE.Scene;
        private _composer: THREE.EffectComposer;
        private outlinePass: THREE.OutlinePass;
        private effectFXAA: THREE.ShaderPass;

        private _light1_world: THREE.DirectionalLight;
        private _light2_world: THREE.DirectionalLight;
        private _light3_world: THREE.DirectionalLight;

        private _light1_overlay: THREE.DirectionalLight;
        private _light2_overlay: THREE.DirectionalLight;
        private _light3_overlay: THREE.DirectionalLight;
        private _test_box: THREE.Mesh;

        private _frustum = new U1.BoundingFrustum();
        private static _temp_cavas: HTMLCanvasElement;
        private _customRenderers: {
            Render: (renderer: THREE.WebGLRenderer) => void
        }[] = [];

        private _sceneMode: SceneMode = SceneMode.Orthographic2D;

        public get CamPersp() {
            return this._cam3d;
        }
        public get CamOrtho() {
            return this._cam2d;
        }
        public get SceneMode(): SceneMode
        {
            return this._sceneMode;
        }
        public set SceneMode(value: SceneMode)
        {
            this._sceneMode = value;
            this.ChangeComposer();
        }
        public useSSAO = false;

        constructor(view: U1.Views.ViewBase)
        {
            super(view);

            this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
            this.Camera.OrthoHeight = 40;
            //this.Camera.Near;
            this.Camera.Far = 50000;

            this._sceneWorld = new THREE.Scene();
            this._sceneOverlay = new THREE.Scene();
            this._cam3d = new THREE.PerspectiveCamera(0, 1, 0, 1);
            this._cam2d = new THREE.OrthographicCamera(0, 1, 0, 1);

            var canvas = (this.View as View3DThree).Canvas;

            this._renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true
            });

            this._renderer.setClearColor(ThreeUtil.Color(this.ClearColor));

            this._light1_world = new THREE.DirectionalLight();
            this._light2_world = new THREE.DirectionalLight();
            this._light3_world = new THREE.DirectionalLight();

            this._light1_overlay = new THREE.DirectionalLight();
            this._light2_overlay = new THREE.DirectionalLight();
            this._light3_overlay = new THREE.DirectionalLight();

            this._sceneWorld.add(this._light1_world);
            this._sceneWorld.add(this._light2_world);
            this._sceneWorld.add(this._light3_world);

            //var light = new THREE.DirectionalLight(0xffffff);
            //light.position.set(0, 0, 1);
            //this._sceneWorld.add(light);

            this._sceneOverlay.add(this._light1_overlay);
            this._sceneOverlay.add(this._light2_overlay);
            this._sceneOverlay.add(this._light3_overlay);

            this._composer = new THREE.EffectComposer(this._renderer);
            //var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam3d);
            var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam2d);
            this._composer.addPass(renderPass);

            //this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam3d);
            this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam2d);
            this._composer.addPass(this.outlinePass);

            this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
            this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
            this.effectFXAA.renderToScreen = true;
            this._composer.addPass(this.effectFXAA); 
        }
        public get SceneWorld(): THREE.Scene
        {
            return this._sceneWorld;
        }
        public get SceneOverlay(): THREE.Scene
        {
            return this._sceneOverlay;
        }

        private ChangeComposer()
        {
            //this._composer = new THREE.EffectComposer(this._renderer);
            ////var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam3d);
            //var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam2d);
            //this._composer.addPass(renderPass);
            this._composer = new THREE.EffectComposer(this._renderer);
            switch (this.SceneMode)
            {
                case SceneMode.Orthographic2D:
                    {
                        var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam2d);
                        this._composer.addPass(renderPass);

                        this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                        this.Camera.OrthoHeight = 40;
                        break;
                    }
                case SceneMode.Orthographic3D:
                    {
                        var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam3d);
                        this._composer.addPass(renderPass);
                         
                        this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                        //this.Camera.OrthoHeight = 4000;
                        break;
                    }
                case SceneMode.Perspective2D:
                    {
                        var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam2d);
                        this._composer.addPass(renderPass);

                        this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                        this.Camera.OrthoHeight = 40; 
                        break;
                    }
                case SceneMode.Perspective3D:
                    {
                        var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam3d);
                        this._composer.addPass(renderPass);
                        if (this.useSSAO) {
                            var ssaoPass = new THREE.SSAOPass(this._sceneWorld, this._cam3d,
                                this.View.Width, this.View.Height);
                            ssaoPass.kernelRadius = 16;
                            this._composer.addPass(ssaoPass);
                        }
                        this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Perspective;
                        //this.Camera.OrthoHeight = 4000;
                        break;
                    }
                default:
                    {
                        var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam2d);
                        this._composer.addPass(renderPass);

                        this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                        this.Camera.OrthoHeight = 40;
                        break;
                    }
            }

            ////this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam3d);
            //this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam2d);
            //this._composer.addPass(this.outlinePass);
            switch (this.SceneMode)
            {
                case SceneMode.Orthographic2D:
                    {
                        this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam2d);
                        this._composer.addPass(this.outlinePass);
                        break;
                    }
                case SceneMode.Orthographic3D:
                    {
                        this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam3d);
                        this._composer.addPass(this.outlinePass);
                        break;
                    }
                case SceneMode.Perspective2D:
                    {
                        this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam2d);
                        this._composer.addPass(this.outlinePass);
                        break;
                    }
                case SceneMode.Perspective3D:
                    {
                        this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam3d);
                        this._composer.addPass(this.outlinePass);
                        break;
                    }
                default:
                    {
                        this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam2d);
                        this._composer.addPass(this.outlinePass);
                        break;
                    }
            }

            this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
            this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
            this.effectFXAA.renderToScreen = true;
            this._composer.addPass(this.effectFXAA);
        }

        public newEntity<T extends U1.Views.ScEntity>(ctor: { new(): T })
        {
            var c: any = ctor;
            var result: any;
            if (c === U1.Views.ScPoint) result = new ScPointThree();
            else if (c === U1.Views.ScPolyLine) result = new ScPolyLineThree();
            else if (c === U1.Views.ScPolygon) result = new ScPolygonThree();
            else if (c === U1.Views.ScText) result = new ScTextThree();
            else if (c === U1.Views.ScModel) result = new ScModelThree();
            else if (c === U1.Views.ScEllipse) result = new ScEllipseThree();
            else if (c === U1.Views.ScGrid) result = new ScGridThree();
            else if (c === U1.Views.ScLight) result = new ScLightTree();
            else if (c === U1.Views.ScLineBatch) result = new ScLineBatchThree();
            else if (c === U1.Views.ScText) result = new ScTextThree();
            else if (c === U1.Views.ScMeshBatch) result = new ScMeshBatchThree();

            else result = super.newEntity(ctor);

            return result as T;
        }
        public newResource<T extends U1.Views.ScResource>(ctor: { new(): T })
        {
            var c: any = ctor;
            var result: any;
            if (c === U1.Views.ScTexture) result = new ScTextureThree();
            else if (c === U1.Views.ScMaterial) result = new ScMaterialThree();
            else result = super.newResource(ctor);

            return result as T;
        }
        public get CustomRenderers()
        {
            return this._customRenderers;
        }
        private _updateContext: UpdateContextThree;
        protected CreateUpdateContext(): U1.Views.UpdateContext
        {
            var view2 = <View3DThree>this.View;
            if (this._updateContext == null)
            {
                this._updateContext = new UpdateContextThree(this);
                this._updateContext.Scene = this;
                this._updateContext.SceneWorld = this._sceneWorld;
                this._updateContext.SceneOverlay = this._sceneOverlay;
            }
            return this._updateContext;
        }
        private _drawContext: DrawContextThree;
        protected CreateDrawContext(): U1.Views.DrawContext
        {
            var view2 = this.View as View3DThree;
            if (this._drawContext == null)
            {
                this._drawContext = new DrawContextThree(this);
                this._drawContext.Scene = this;
                this._drawContext.WorldToScreen =
                    (wpos: U1.Vector3, result?: U1.Vector3) =>
                    {
                        return this.Camera.WorldToScreen(wpos, result);
                    };
            }

            this._drawContext.ViewMatrix = this.Camera.GetViewMatrix(this._drawContext.ViewMatrix);
            this._drawContext.ProjMatrix = this.Camera.GetProjMatrix(this._drawContext.ProjMatrix);
            this._drawContext.ViewProjMatrix.SetMultiply(this._drawContext.ViewMatrix, this._drawContext.ProjMatrix);

            return this._drawContext;
        }
        protected OnBeginUpdate()
        {
            if (this._test_box == null) {
                //var material = new THREE.MeshPhongMaterial({ color: new THREE.Color(1,0,0), side: THREE.DoubleSide }); 

                //this._test_box = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), material);
                //this._sceneWorld.add(this._test_box ); 
            }

          
        }
        protected OnEndUpdate()
        { 
            var cam = this.Camera;
            this.View.DocumentPresenter?.UpdateVisible();
            switch (this.SceneMode)
            {
                case SceneMode.Orthographic2D:
                    {
                        ThreeUtil.ApplyOrthographicCamera(this._cam2d, cam);
                        break;
                    }
                case SceneMode.Orthographic3D:
                    {
                        ThreeUtil.ApplyOrthographicCamera(this._cam2d, cam);
                        break;
                    }
                case SceneMode.Perspective2D:
                    {
                        //ThreeUtil.ApplyPerspectiveCamera(this._cam2d, cam);
                        break;
                    }
                case SceneMode.Perspective3D:
                    {
                        ThreeUtil.ApplyPerspectiveCamera(this._cam3d, cam);
                        break;
                    }
                default:
                    {
                        ThreeUtil.ApplyOrthographicCamera(this._cam2d, cam);
                        break;
                    }
            }
            var w = this.View.Width;
            var h = this.View.Height;

            ThreeUtil.ApplyDirectionalLight(this._light1_world, this.Light1);
            ThreeUtil.ApplyDirectionalLight(this._light2_world, this.Light2);
            ThreeUtil.ApplyDirectionalLight(this._light3_world, this.Light3);

            ThreeUtil.ApplyDirectionalLight(this._light1_overlay, this.Light1);
            ThreeUtil.ApplyDirectionalLight(this._light2_overlay, this.Light2);
            ThreeUtil.ApplyDirectionalLight(this._light3_overlay, this.Light3);

            this._renderer.setViewport(cam.ViewportX, cam.ViewportY, cam.ViewportWidth, cam.ViewportHeight);
            this._renderer.setScissor(cam.ViewportX, cam.ViewportY, cam.ViewportWidth, cam.ViewportHeight);

            this._renderer.setClearColor(ThreeUtil.Color(this.ClearColor));
            this._renderer.setSize(w, h);
            //this._composer.setSize(w, h);
            this._renderer.autoClear = true;

            switch (this.SceneMode)
            {
                case SceneMode.Orthographic2D:
                    {
                        this._renderer.render(this._sceneWorld, this._cam2d);
                        break;
                    }
                case SceneMode.Orthographic3D:
                    {
                        this._renderer.render(this._sceneWorld, this._cam2d);
                        break;
                    }
                case SceneMode.Perspective2D:
                    {
                        this._renderer.render(this._sceneWorld, this._cam2d);
                        break;
                    }
                case SceneMode.Perspective3D:
                    {
                        this._renderer.render(this._sceneWorld, this._cam3d);
                        break;
                    }
                default:
                    {
                        this._renderer.render(this._sceneWorld, this._cam2d);
                        break;
                    }
            }

            this._renderer.clearDepth();
            this._renderer.autoClear = false;
           
            switch (this.SceneMode)
            {
                case SceneMode.Orthographic2D:
                    {
                        this._renderer.render(this._sceneOverlay, this._cam2d);
                        break;
                    }
                case SceneMode.Orthographic3D:
                    {
                        this._renderer.render(this._sceneOverlay, this._cam2d);
                        break;
                    }
                case SceneMode.Perspective2D:
                    {
                        this._renderer.render(this._sceneOverlay, this._cam2d);
                        break;
                    }
                case SceneMode.Perspective3D:
                    {
                        this._renderer.render(this._sceneOverlay, this._cam3d); 
                        break;
                    }
                default:
                    {
                        this._renderer.render(this.SceneOverlay, this._cam2d);
                        break;
                    }
            }

            for (var ctmR of this.CustomRenderers)
            {
                ctmR.Render(this._renderer);
            }
        }

        public RemoveCustomRenderer(renderer: { Render: (renderer: THREE.WebGLRenderer) => void })
        {
            var idx = this.CustomRenderers.indexOf(renderer);
            if (idx >= 0)
            {
                this.CustomRenderers.splice(idx, 1);
            }
        }
        public AddCustomRenderer(renderer: { Render: (renderer: THREE.WebGLRenderer) => void })
        {
            var idx = this.CustomRenderers.indexOf(renderer);
            if (idx >= 0)
            {
                return;
            }
            this.CustomRenderers.push(renderer);
        }
    }
    export class UpdateContextThree extends U1.Views.UpdateContext
    {
        constructor(scene: SceneThree)
        {
            super();
        }

        public SceneWorld: THREE.Scene;
        public SceneOverlay: THREE.Scene;
        public ShowTextBounding = false;
        public Dispose()
        {
        }
    }
    export class DrawContextThree extends U1.Views.DrawContext
    {
        public TextSvg: SVGElement;
        public ShowTextBounding = false;

        constructor(scene: SceneThree)
        {
            super();

            this.ViewMatrix = new U1.Matrix4();
            this.ProjMatrix = new U1.Matrix4();
            this.ViewProjMatrix = new U1.Matrix4();
        }
        public Dispose()
        {
        }
    }
}
