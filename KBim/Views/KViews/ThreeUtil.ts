namespace KBim.Views
{
    export class ThreeUtil 
    {
        public static Color(color: U1.Color): THREE.Color
        {
            return new THREE.Color(color.R / 255, color.G / 255, color.B / 255);
        }
        public static getHex(color: U1.Color)
        {
            return (color.R) << 16 ^ (color.G) << 8 ^ (color.B) << 0;
        }

        public static FromVector2(vector2: THREE.Vector2, res?: U1.Vector2): U1.Vector2 {
            res = res || new U1.Vector2();
            return res.Set(vector2.x, vector2.y);
        }

        public static FromVector3(vector3: THREE.Vector3, res?: U1.Vector3): U1.Vector3 {
            res = res || new U1.Vector3();
            return res.Set(vector3.x, vector3.y, vector3.z);    
        }

        public static Vector2(vector2: U1.Vector2, res?: THREE.Vector2): THREE.Vector2
        {
            res = res || new THREE.Vector2();
            return res.set(vector2.X, vector2.Y);
        }

        public static Vector3(vector3: U1.Vector3, res?: THREE.Vector3 ): THREE.Vector3
        {
            res = res || new THREE.Vector3();
            return res.set(vector3.X, vector3.Y, vector3.Z);
        }
        public static Quaternion(quat: U1.Quaternion, res?: THREE.Quaternion): THREE.Quaternion
        {
            res = res || new THREE.Quaternion();

            return res.set(quat.X, quat.Y, quat.Z, quat.W);
        }

        public static Matrix4(m: U1.Matrix4, res?: THREE.Matrix4): THREE.Matrix4
        {
            res = res || new THREE.Matrix4();

            //res.set(
            //    m.M11, m.M12, m.M13, m.M14,
            //    m.M21, m.M22, m.M23, m.M24,
            //    m.M31, m.M32, m.M33, m.M34,
            //    m.M41, m.M42, m.M43, m.M44 
            //); 

            res.set(
                m.M11, m.M21, m.M31, m.M41,
                m.M12, m.M22, m.M32, m.M42,
                m.M13, m.M23, m.M33, m.M43,
                m.M14, m.M24, m.M34, m.M44
            ); 

            return res;
        }
        public static Texture(texture: U1.Views.ScTexture): THREE.Texture
        {
            if (texture == null)
                return null;
            if (texture instanceof ScTextureThree)
                return texture.TextureThree;
            return null;
        }

        public static ApplyTransform(obj3D: THREE.Object3D, matrix: U1.Matrix4)
        {
            var pos: THREE.Vector3 = ThreeUtil[".atf.v0"] || (ThreeUtil[".atf.v0"] =new THREE.Vector3());
            var qut: THREE.Quaternion = ThreeUtil[".atf.q0"] || (ThreeUtil[".atf.q0"] = new THREE.Quaternion());
            var scl: THREE.Vector3 = ThreeUtil[".atf.v1"] || (ThreeUtil[".atf.v1"] = new THREE.Vector3());
            var m: THREE.Matrix4 = ThreeUtil[".atf.m0"] || (ThreeUtil[".atf.m0"] = new THREE.Matrix4());

            ThreeUtil.Matrix4(matrix, m);
            m.decompose(pos, qut, scl); 
             
            obj3D.position.copy(pos);
            obj3D.quaternion.copy(qut);
            obj3D.scale.copy(scl);

            obj3D.updateMatrix();
        }
        public static ApplyPerspectiveCamera(cam3d: THREE.PerspectiveCamera, cam: U1.Views.ScCamera)
        {
            cam3d.position.x = cam.Position.X;
            cam3d.position.y = cam.Position.Y;
            cam3d.position.z = cam.Position.Z;

            cam3d.up.x = cam.Up.X;
            cam3d.up.y = cam.Up.Y;
            cam3d.up.z = cam.Up.Z;

            cam3d.near = cam.Near;
            cam3d.far = cam.Far;

            cam3d.lookAt(new THREE.Vector3(cam.LookAt.X, cam.LookAt.Y, cam.LookAt.Z));
            cam3d.aspect = cam.Aspect;
            cam3d.fov = cam.FOV / Math.PI * 180;

            cam3d.updateProjectionMatrix();
        }
        public static ApplyOrthographicCamera(camThree: THREE.OrthographicCamera, cam: U1.Views.ScCamera)
        { 
            camThree.position.x = cam.Position.X;
            camThree.position.y = cam.Position.Y;
            camThree.position.z = cam.Position.Z;

            camThree.up.x = cam.Up.X;
            camThree.up.y = cam.Up.Y;
            camThree.up.z = cam.Up.Z;

            camThree.lookAt(new THREE.Vector3(cam.LookAt.X, cam.LookAt.Y, cam.LookAt.Z));

            var h = cam.OrthoHeight;
            var w = cam.OrthoHeight * cam.Aspect;
            camThree.left = -w / 2;
            camThree.right = w / 2;
            camThree.top = h / 2;
            camThree.bottom = -h / 2;
            camThree.near = cam.Near;
            camThree.far = cam.Far;
              
            camThree.updateProjectionMatrix();
        }
        public static ApplyDirectionalLight(light3D: THREE.DirectionalLight, light: U1.Light)
        {
            light3D.position.set(-light.Direction.X, -light.Direction.Y, -light.Direction.Z);
            light3D.color.setRGB(light.Diffuse.R / 255.0, light.Diffuse.G / 255.0, light.Diffuse.B / 255.0);
            light3D.updateMatrix(); 
            //light3D.intensity = 0.5;
        }
        public static ApplyMeshBufferGeometry(geomThree: THREE.BufferGeometry, geometry: U1.MeshBufferGeometry)
        { 
            geomThree.setAttribute('position', new THREE.BufferAttribute(geometry.pos, 3));
            if (geometry.normal != null)
                geomThree.setAttribute('normal', new THREE.BufferAttribute(geometry.normal, 3));

            if (geometry.color != null && geometry.color.length > 0)
                geomThree.setAttribute('color', new THREE.BufferAttribute(geometry.color, 3));

            if (geometry.uv0 != null && geometry.uv0.length > 0)
                geomThree.setAttribute('uv', new THREE.BufferAttribute(geometry.uv0, 2));

            if (geometry.uv1 != null && geometry.uv1.length > 0)
                geomThree.setAttribute('uv1', new THREE.BufferAttribute(geometry.uv1, 2));
             
            if (geometry.indices != null)
                geomThree.setIndex(new THREE.BufferAttribute(geometry.indices, 1)); 

            geomThree.computeBoundingBox();
            geomThree.computeBoundingSphere(); 
        }
        public static ApplyLineBufferGeometry(geomThree: THREE.BufferGeometry, geometry: U1.LineBufferGeometry)
        {
            geomThree.setAttribute('position', new THREE.BufferAttribute(geometry.pos, 3));
            if (geometry.color != null && geometry.color.length > 0)
                geomThree.setAttribute('color', new THREE.BufferAttribute(geometry.color, 3));  

            if (geometry.indices != null)
                geomThree.setIndex(new THREE.BufferAttribute(geometry.indices, 1));
        }
        
    }
}