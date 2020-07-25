var AppRoot: string;
var ProjNo: string;

namespace KBim.Views
{
    export class ScNavigatorThree extends U1.Views.ScEntity
    {
        static PARTS = {
            None: 0,
            South: 1,
            North: 2,
            West: 3,
            East: 4,
            Disc: 5
        };

        private static s_meshes: U1.MeshBufferGeometry[];
        private static s_lines: U1.LineBufferGeometry[];
        private static s_materials: U1.MeshMaterial[];

        private static s_viewportSize = 150;
        private static s_viewportMargin = 5;

        private static s_discColor = U1.Colors.Gray;
        private static s_boxColor = U1.Colors.Gray;
        private static s_boxAmbient = new U1.Color(30, 30, 30, 255);
        private static s_emissive = new U1.Color(50, 50, 50, 155);
        private static s_shininess = 300;

        private static def_colorThree = new THREE.Color(0xcccccc);
        private static over_colorThree = new THREE.Color(0x888888);
        private static def_linecolorThree = new THREE.Color(0xbbbbbb);
        private static over_linecolorThree = new THREE.Color(0x787878);

        private static s_camPosMap: { [index: number]: U1.Vector3 } = {};
        private m_isInitialized = false;

        private m_scneThree: THREE.Scene;
        private m_meshThrees: THREE.Mesh[];
        private m_lineThrees: THREE.LineSegments[];

        private m_camThree: THREE.OrthographicCamera;

        private m_camera = new U1.Views.ScCamera();
        private m_activeAttr = -1;
        private m_tmp_ray = new U1.Ray3();
        private m_materials: { [index: number]: U1.Views.ScMaterial } = {};
        constructor()
        {
            super();
            if (ScNavigatorThree.s_meshes === undefined)
            {

                var tv = new U1.Vector3();
                var tm = new U1.Matrix4();

                var discMesh = ScNavigatorThree.CreateDisc();
                var meshes: U1.MeshBufferGeometry[] = [];
                var lines: U1.LineBufferGeometry[] = [];
                var textures: string[] = [];
                var PARTS = ScNavigatorThree.PARTS;
                ScNavigatorThree.CreateBox(meshes, textures, lines);

                var m = U1.Matrix4.CreateTranslationFloats(-0.5, -0.5, -0.5).Multiply(U1.Matrix4.CreateScaleByFloats(1.2, 1.2, 1.2));

                for (var mesh of meshes)
                    mesh.Transform(m);

                for (var line of lines)
                    line.Transform(m);

                ScNavigatorThree.s_meshes = meshes;
                ScNavigatorThree.s_lines = lines;
                 
                var south = ScNavigatorThree.CreatePlane("NvSouth", PARTS.South);
                var west = ScNavigatorThree.CreatePlane("NvWest", PARTS.West);
                var north = ScNavigatorThree.CreatePlane("NvNorth", PARTS.North);
                var east = ScNavigatorThree.CreatePlane("NvEast", PARTS.East);

                
                meshes.push(west.Transform(tm.SetCreateTranslation(tv.Set(-1.5, 0, -0.5))));
                meshes.push(east.Transform(tm.SetCreateTranslation(tv.Set(1.5, 0, -0.5))));
                meshes.push(south.Transform(tm.SetCreateTranslation(tv.Set(0, -1.5, -0.5))));
                meshes.push(north.Transform(tm.SetCreateTranslation(tv.Set(0, 1.5, -0.5))));
                meshes.push(discMesh.Transform(tm.SetCreateTranslation(tv.Set(0, 0, -0.51))));

                textures.push("NvWest", "NvEast", "NvSouth", "NvNorth", "disc");
                //textures.push("NvBottom", "NvBottom", "NvBottom", "NvBottom", null);

                ScNavigatorThree.s_materials = textures.map(o_ =>
                {
                    var mt = new U1.MeshMaterial();
                    if (o_ === "disc")
                        mt.Tag = ScNavigatorThree.PARTS.Disc;
                    else
                    {
                        mt.DiffuseTexture = new U1.Texture();
                        mt.DiffuseTexture.Url = o_;
                    }
                    return mt;
                });
            }
        }

        get ActiveAttr()
        {
            return this.m_activeAttr;
        }
        set ActiveAttr(value)
        {
            this.m_activeAttr = value;
        }
        get Camera(): U1.Views.ScCamera
        {
            return this.m_camera;
        }
        private static CreatePlane(texture: string, tag: number): U1.MeshBufferGeometry
        { 
            var pos = [
                -0.3, -0.3, 0,
                0.3, -0.3, 0,
                0.3, 0.3, 0,
                -0.3, 0.3, 0
            ];
            var nom = [
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
            ];
            var uv = [
                0, 1,
                1, 1,
                1, 0,
                0, 0,
            ];

            var indics = [
                0, 1, 2,
                0, 2, 3
            ];

            var result = new U1.MeshBufferGeometry();
            result.pos = new Float32Array(pos);
            result.normal = new Float32Array(nom);
            result.uv0 = new Float32Array(uv);
            result.indices = new Uint16Array(indics); 
            
            return result;
        }
        protected OnUpdate(context: U1.Views.UpdateContext)
        {
            if (!this.Visible)
            {
                return;
            }
            if (!this.m_isInitialized)
            {
                this.Initialize();
            }

            if (this.m_meshThrees == null)
                return;
             
            var PARTS = ScNavigatorThree.PARTS;
            var s_materials = ScNavigatorThree.s_materials;
            var ray = this.m_tmp_ray;
            this.Scene.Camera.GetDirection(ray.Direction);
            ray.Position.SetScale(ray.Direction, -10);

            var alpha = 1;// 0.6;
            var raydir = ray.Direction;
                       
            var dir = new U1.Vector3();
            for (var i = 0; i < s_materials.length; i++)
            {
                var dir = this.GetDirectionByAttr_1(i, dir);
                if (this.m_meshThrees[i].material  == null)
                    continue;
                 
                var mat = this.m_meshThrees[i].material as THREE.MeshBasicMaterial;

                if (s_materials[i].Tag == PARTS.Disc)
                {
                    continue;
                }

                var line = this.m_lineThrees[i];

                if (this.ActiveAttr == i)
                {
                    mat.opacity = alpha + 0.25;
                    mat.color = ScNavigatorThree.over_colorThree; 
                }
                else if (U1.Vector3.Dot(dir, raydir) > 0.9)
                {
                    mat.opacity = 1;
                    mat.color = ScNavigatorThree.over_colorThree;
                    if (line != null)
                       ( line.material as any).color = ScNavigatorThree.over_linecolorThree;//.visible = true;
                }
                else
                {
                    mat.opacity = alpha;
                    mat.color = ScNavigatorThree.def_colorThree; 
                    if (line != null)
                    {
                        (line.material as any).color = ScNavigatorThree.def_linecolorThree; 
                    }
                }
            }

            this.Scene.Camera.GetDirection(this.m_camera.Position).Scale(-4);// = -Scene.Camera.Direction * 4;
            this.m_camera.Up.CopyFrom(this.Scene.Camera.Up);// = Scene.Camera.Up; 
            this.m_camera.ViewportX = this.Scene.Camera.ViewportWidth - ScNavigatorThree.s_viewportSize - ScNavigatorThree.s_viewportMargin;
            this.m_camera.ViewportY = ScNavigatorThree.s_viewportMargin;

            super.OnUpdate(context);
        }
        private Initialize()
        {
            if (this.m_isInitialized)
                return;
            this.m_isInitialized = true;
            (this.Scene as SceneThree).AddCustomRenderer(this);

            var s_materials = ScNavigatorThree.s_materials; 
            this.m_scneThree = new THREE.Scene();
            this.m_meshThrees = [];
            this.m_lineThrees = [];

            var textureLoader = new THREE.TextureLoader();  
            var idx = 0;
            var onLoad = () =>
            {
                this.Invalidate();
            };

            for (var mesh of ScNavigatorThree.s_meshes)
            {
                var geom = new THREE.BufferGeometry();
                ThreeUtil.ApplyMeshBufferGeometry(geom, mesh);
                var meshThree = new THREE.Mesh();
                meshThree.geometry = geom; 

                var meshmaterial = s_materials[idx];
                var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
                if (meshmaterial.DiffuseTexture != null && meshmaterial.DiffuseTexture.Url != null)
                {
                    var textureLoader = new THREE.TextureLoader();
                    //material.map = textureLoader.load(AppRoot + 'images/' + meshmaterial.DiffuseTexture.Url + ".png", onLoad);
                    material.map = textureLoader.load('images/' + meshmaterial.DiffuseTexture.Url + ".png", onLoad);
                    material.map.flipY = false;
                    material.map.minFilter = THREE.LinearMipMapLinearFilter;
                    material.opacity = 0.8;
                    material.transparent = true;
                };
                meshThree.material = material;
                idx++;

                this.m_meshThrees.push(meshThree);
                this.m_scneThree.add(meshThree);
            }
             
            for (var line of ScNavigatorThree.s_lines)
            {
                var geom = new THREE.BufferGeometry();
                ThreeUtil.ApplyLineBufferGeometry(geom, line);
                let lineThree = new THREE.LineSegments();
                lineThree.geometry = geom;
                 
                let material = new THREE.LineBasicMaterial({ color: 0x000000 }); 
                lineThree.material = material; 

                this.m_lineThrees.push(lineThree);
                this.m_scneThree.add(lineThree);
            }

            var m_camera = this.m_camera = new U1.Views.ScCamera();
            m_camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
            m_camera.OrthoHeight = 5;
            m_camera.ViewportWidth = ScNavigatorThree.s_viewportSize;
            m_camera.ViewportHeight = ScNavigatorThree.s_viewportSize;
            m_camera.LookAt = U1.Vector3.Zero;

            this.m_isInitialized = true;
        }

        public CheckIntersect(isectContext: U1.ISectContext)
        {
            if (!this.Visible)
                return null; 
            return this.CheckIntersect_1(isectContext.View.X, isectContext.View.Y); 
        }
         
        public CheckIntersect_1(screen_x: number, screen_y: number)
        {
            if (!this.Visible)
                return null;
            var ray = this.m_camera.CalPickingRay(screen_x, screen_y, this.m_tmp_ray);

            var result: U1.ISectInfo;
            for (var i = 0; i < ScNavigatorThree.s_meshes.length; i++)
            {
                var meshgeom = ScNavigatorThree.s_meshes[i];
                var isect = meshgeom.Intersect(ray);
                if (isect == null)
                    continue;

                if (result == null || result.Distance > isect.Distance)
                {
                    isect.Source = this;
                    isect.Geometry = meshgeom;
                    isect.Attr = i;
                    result = isect;
                }
            };
            return result;
        } 
        public Render(renderer: THREE.WebGLRenderer)
        {
            if (this.m_camThree == null)
            {
                var left = this.m_camera.OrthoHeight * this.m_camera.Aspect;
                this.m_camThree = new THREE.OrthographicCamera(-10, 10, 10, -10); 
            }
             
            ThreeUtil.ApplyOrthographicCamera(this.m_camThree, this.m_camera);

            var view = this.Scene.View;
            var vieww = view.Width;
            var viewh = view.Height;

            var cam = this.m_camera;
            var left = cam.ViewportX;
            var bottom = viewh - cam.ViewportHeight - cam.ViewportY;
            var width = cam.ViewportWidth;
            var height = cam.ViewportHeight;

            renderer.autoClear = false; 
            renderer.setViewport(left, bottom, width, height); 
            renderer.clearDepth(); 
            renderer.render(this.m_scneThree, this.m_camThree);  
        }
        protected OnDisposing()
        {
            if (this.Scene != null)
            {
                (this.Scene as SceneThree).RemoveCustomRenderer(this);
            }

            if (this.m_scneThree != null)
            {
                if (this.m_lineThrees != null)
                {
                    for (var line of this.m_lineThrees)
                    {
                        line.geometry.dispose();
                        if (line.material instanceof THREE.Material)
                            (line.material as THREE.Material).dispose(); 
                        this.m_scneThree.remove(line);
                    }

                    this.m_lineThrees = null;
                } 
                if (this.m_meshThrees != null)
                {
                    for (let mesh of this.m_meshThrees)
                    {
                        mesh.geometry.dispose();
                        if (mesh.material instanceof THREE.Material)
                            (mesh.material as THREE.Material).dispose();  
                        this.m_scneThree.remove(mesh);
                    }

                    this.m_meshThrees = null;
                } 
                this.m_scneThree = null;
            }

            super.OnDisposing();
        }
        private static CreateBox(
            meshes: U1.MeshBufferGeometry[],
            textures: string[],
            lines: U1.LineBufferGeometry[]
        )
        {
            var camPtLocs = [-0.6, 0, 0.6];
            var boxPtLocs = [0, 0.18, 0.82, 1];
            var attr = 0;
            var s_camPosMap = ScNavigatorThree.s_camPosMap;

            for (var zi = 1; zi < 4; zi++)
            {
                for (var yi = 1; yi < 4; yi++)
                {
                    for (var xi = 1; xi < 4; xi++)
                    {
                        var ps = [
                            new U1.Vector3(boxPtLocs[xi - 1], boxPtLocs[yi - 1], boxPtLocs[zi - 1]),
                            new U1.Vector3(boxPtLocs[xi], boxPtLocs[yi - 1], boxPtLocs[zi - 1]),
                            new U1.Vector3(boxPtLocs[xi], boxPtLocs[yi], boxPtLocs[zi - 1]),
                            new U1.Vector3(boxPtLocs[xi - 1], boxPtLocs[yi], boxPtLocs[zi - 1]),

                            new U1.Vector3(boxPtLocs[xi - 1], boxPtLocs[yi - 1], boxPtLocs[zi]),
                            new U1.Vector3(boxPtLocs[xi], boxPtLocs[yi - 1], boxPtLocs[zi]),
                            new U1.Vector3(boxPtLocs[xi], boxPtLocs[yi], boxPtLocs[zi]),
                            new U1.Vector3(boxPtLocs[xi - 1], boxPtLocs[yi], boxPtLocs[zi])
                        ];

                        var fids: number[] = [];
                        if (yi == 1)
                            fids.push(0, 1, 5, 4); // front
                        if (yi == 3)
                            fids.push(2, 3, 7, 6); // back 

                        if (xi == 3)
                            fids.push(1, 2, 6, 5); // right 
                        if (xi == 1)
                            fids.push(3, 0, 4, 7); // left 

                        if (zi == 3)
                            fids.push(4, 5, 6, 7); // top 
                        if (zi == 1)
                            fids.push(3, 2, 1, 0); // bottom 

                        if (fids.length > 0)
                        {
                            var camPos = new U1.Vector3(camPtLocs[xi - 1], camPtLocs[yi - 1], camPtLocs[zi - 1]);
                            s_camPosMap[attr++] = camPos;

                            var texture: string = null;
                            if (xi == 2 && yi == 1 && zi == 2)
                                texture = "NvFront";
                            else if (xi == 2 && yi == 2 && zi == 3)
                                texture = "NvTop";
                            else if (xi == 3 && yi == 2 && zi == 2)
                                texture = "NvRight";
                            else if (xi == 2 && yi == 3 && zi == 2)
                                texture = "NvBack";
                            else if (xi == 1 && yi == 2 && zi == 2)
                                texture = "NvLeft";
                            else if (xi == 2 && yi == 2 && zi == 1)
                                texture = "NvBottom";

                            var mesh = ScNavigatorThree.CreateMesh(ps, fids, texture);
                            var line = ScNavigatorThree.CreteLine(ps, fids, U1.Colors.White);

                            meshes.push(mesh);
                            textures.push(texture);
                            lines.push(line);
                        }
                    }
                }
            }
        }
        public GetDirectionByAttr(attr: number, xDir: U1.Vector3, yDir: U1.Vector3, zDir: U1.Vector3): boolean
        {
            var ux: U1.Vector3 = ScNavigatorThree[".gdb.v0"] || (ScNavigatorThree[".gdb.v0"] = U1.Vector3.UnitX);
            var uy: U1.Vector3 = ScNavigatorThree[".gdb.v1"] || (ScNavigatorThree[".gdb.v1"] = U1.Vector3.UnitY);
            var uz: U1.Vector3 = ScNavigatorThree[".gdb.v2"] || (ScNavigatorThree[".gdb.v2"] = U1.Vector3.UnitZ);
            var pos: U1.Vector3 = ScNavigatorThree[".gdb.v3"] || (ScNavigatorThree[".gdb.v3"] = U1.Vector3.Zero);

            xDir.SetUnitX();
            yDir.SetUnitY();
            zDir.SetUnitZ();
            var PARTS = ScNavigatorThree.PARTS;
            var s_camPosMap = ScNavigatorThree.s_camPosMap;
            var s_boxMaterials = ScNavigatorThree.s_materials;

            if (attr < 0)
                return false;
             
            if (s_camPosMap[attr])
            {
                pos = s_camPosMap[attr];
            }
            else
            {
                var dir = s_boxMaterials[attr].Tag;
                switch (dir)
                {
                    case PARTS.South:
                        pos.SetUnitY().Scale(-1);// - Vector3.UnitY;
                        break;
                    case PARTS.North:
                        pos.SetUnitY();// = Vector3.UnitY;
                        break;
                    case PARTS.West:
                        pos.SetUnitX().Scale(-1);// = -Vector3.UnitX;
                        break;
                    case PARTS.East:
                        pos.SetUnitX();// = Vector3.UnitX;
                        break;
                    default:
                        break;
                }
            }

            if (!pos.IsZero)
            {
                zDir.CopyFrom(pos).Normalize();// = Vector3.Normalize(pos);
                yDir.SetUnitZ();// = Vector3.UnitZ;
                xDir.SetUnitX();// = Vector3.UnitX;

                var dt = U1.Vector3.Dot(zDir, uz);
                if (dt > 0.99 || dt < -0.99)
                {
                    yDir.SetUnitY();// = Vector3.UnitY;
                    if (dt < 0)
                        xDir.SetUnitX().Scale(-1);// = -Vector3.UnitX;
                }
                else
                {
                    xDir.SetCross(uz, zDir);
                    yDir.SetCross(zDir, xDir).Normalize(); //= Vector3.Normalize(Vector3.Cross(zDir, xDir));
                }
            }

            return true;
        }
        public GetDirectionByAttr_1(attr: number, result?: U1.Vector3): U1.Vector3
        {
            var PARTS = ScNavigatorThree.PARTS;
            var s_camPosMap = ScNavigatorThree.s_camPosMap;
            var s_materials = ScNavigatorThree.s_materials;

            var pos = result || U1.Vector3.UnitY;

            if (s_camPosMap[attr] != null)
            {
                pos.CopyFrom(s_camPosMap[attr]);
            }
            else
            {
                var dir = s_materials[attr].Tag;
                switch (dir)
                {
                    case PARTS.South:
                        pos.SetUnitY().Scale(-1);// - Vector3.UnitY;
                        break;
                    case PARTS.North:
                        pos.SetUnitY();// = Vector3.UnitY;
                        break;
                    case PARTS.West:
                        pos.SetUnitX().Scale(-1);// = -Vector3.UnitX;
                        break;
                    case PARTS.East:
                        pos.SetUnitX();// = Vector3.UnitX;
                        break;
                    default:
                        break;
                }
            }

            return pos.Scale(-1).Normalize();// Vector3.Normalize(-pos);
        }
        public GetSnapedPoint(screenPos: U1.Vector2, out: { attr?: number, part?: number }): U1.Vector3
        {
            out.attr = -1;
            out.part = ScNavigatorThree.PARTS.None;

            var isectInfo = this.CheckIntersect_1(screenPos.X, screenPos.Y); 
            if (isectInfo != null)
            {
                out.attr = isectInfo.Attr;
                out.part = ScNavigatorThree.s_materials[out.attr].Tag;
                return isectInfo.IsectPosition;
            }

            return null;
        }
        private static CreteLine(vs: U1.Vector3[], fids: number[], color: U1.Color): U1.LineBufferGeometry
        {
            var pos: number[] = [];
            var col: number[] = [];

            var ilist: number[] = [];
            vs.forEach(o_ =>
            {
                pos.push(o_.X); pos.push(o_.Y); pos.push(o_.Z);
                col.push(color.R / 255, color.G / 255, color.B / 255);
            });

            for (var i = 0; i < fids.length; i += 4)
            {
                var i0 = fids[i];
                var i1 = fids[i + 1];
                var i2 = fids[i + 2];
                var i3 = fids[i + 3];

                ilist.push(i0, i1, i1, i2, i2, i3, i3, i0);
            }

            var result = new U1.LineBufferGeometry();
            result.pos = new Float32Array(pos);
            result.color = new Float32Array(col);
            //result.indices = new Uint16Array(ilist);
            result.indices = new Uint16Array(ilist);

            return result;
        }
        private static CreateMesh(vs: U1.Vector3[], fids: number[], texture: string): U1.MeshBufferGeometry
        {
            var tv0 = new U1.Vector3();
            var tv1 = new U1.Vector3();
            var tv2 = new U1.Vector3();
            var tv3 = new U1.Vector3();

            var pos: number[] = [];
            var nom: number[] = [];
            var uv0: number[] = [];
            var ilist: number[] = [];
            var alist: number[] = [];
            var mlist: number[] = [];

            var uvs = [new U1.Vector2(0, 1), new U1.Vector2(1, 1), new U1.Vector2(1, 0), new U1.Vector2(0, 0)];

            for (var i = 0; i < fids.length; i += 4)
            {
                var f_0 = fids[i];
                var f_1 = fids[i + 1];
                var f_2 = fids[i + 2];
                var f_3 = fids[i + 3];

                var ps = [fids[i], fids[i + 1], fids[i + 2], fids[i + 3]];
                var p0 = vs[f_0];
                var p1 = vs[f_1];
                var p2 = vs[f_2];
                var p3 = vs[f_3];

                var n0 = tv2.SetCross(tv0.SetSubtract(p1, p0), tv1.SetSubtract(p2, p0)).Normalize();
                var lastvi = pos.length / 3 | 0;

                pos.push(p0.X, p0.Y, p0.Z); nom.push(n0.X, n0.Y, n0.Z); uv0.push(uvs[0].X, uvs[0].Y);
                pos.push(p1.X, p1.Y, p1.Z); nom.push(n0.X, n0.Y, n0.Z); uv0.push(uvs[1].X, uvs[1].Y);
                pos.push(p2.X, p2.Y, p2.Z); nom.push(n0.X, n0.Y, n0.Z); uv0.push(uvs[2].X, uvs[2].Y);
                pos.push(p3.X, p3.Y, p3.Z); nom.push(n0.X, n0.Y, n0.Z); uv0.push(uvs[3].X, uvs[3].Y);

                ilist.push(0 + lastvi, 1 + lastvi, 2 + lastvi);
                ilist.push(0 + lastvi, 2 + lastvi, 3 + lastvi);
            }

            var result = new U1.MeshBufferGeometry();
            result.pos = new Float32Array(pos);
            result.normal = new Float32Array(nom);
            result.indices = new Uint16Array(ilist);
            result.uv0 = new Float32Array(uv0);

            return result;
        }
        private static CreateDisc(): U1.MeshBufferGeometry
        {
            var tv0 = new U1.Vector3();
            var tv1 = new U1.Vector3();
            var tm0 = new U1.Matrix4();

            var pos: number[] = [];
            var norm: number[] = [];
            var indics: number[] = [];

            var side = 24;
            var delt = (Math.PI * 2 / side);

            for (var disc = 0; disc < 2; disc++)
            {
                for (var i = 0; i <= side; i++)
                {
                    var p0 = tv0.Set(1, 0, 0);
                    var p1 = tv1.Set(1.1, 0, 0);

                    if (disc == 1)
                    {
                        p0.X = 1.2;
                        p1.X = 1.5;
                    }

                    var rot = tm0.SetCreateRotationZ(delt * i);
                    p0.Transform(rot);
                    p1.Transform(rot);

                    var v0 = new U1.MeshVertex();
                    v0.Position.SetTransform(p0, rot);
                    v0.Normal.SetUnitZ();

                    var v1 = new U1.MeshVertex();
                    v1.Position.SetTransform(p1, rot);
                    v1.Normal.SetUnitZ();


                    pos.push(p0.X, p0.Y, p0.Z); norm.push(0, 0, 1);
                    pos.push(p1.X, p1.Y, p1.Z); norm.push(0, 0, 1);

                    if (i > 0)
                    {
                        var i0 = pos.length / 3 - 4;
                        var i1 = i0 + 1;
                        var i2 = i1 + 1;
                        var i3 = i2 + 1;

                        indics.push(i0, i3, i2);
                        indics.push(i0, i1, i3);
                    }
                }
            }

            var disc0 = new U1.MeshBufferGeometry();
            disc0.pos = new Float32Array(pos);
            //disc0.indices = new Uint16Array(indics);
            disc0.indices = new Uint16Array(indics);

            return disc0;
        }
    }
}