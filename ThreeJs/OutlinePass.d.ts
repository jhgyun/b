//import {
//	Vector2,
//	Scene,
//	Camera,
//	Object3D,
//	Color,
//	Matrix4,
//	MeshBasicMaterial,
//	MeshDepthMaterial,
//	ShaderMaterial,
//	WebGLRenderTarget,
//	Texture
//} from '../../../src/Three';

//import { Pass } from './Pass';

declare namespace THREE {
    export class OutlinePass extends Pass {

        constructor(resolution: THREE.Vector2, scene: THREE.Scene, camera: THREE.Camera, selectedObjects?: THREE.Object3D[]);
        renderScene: THREE.Scene;
        renderCamera: THREE.Camera;
        selectedObjects: THREE.Object3D[];
        visibleEdgeColor: THREE.Color;
        hiddenEdgeColor: THREE.Color;
        edgeGlow: number;
        usePatternTexture: boolean;
        edgeThickness: number;
        edgeStrength: number;
        downSampleRatio: number;
        pulsePeriod: number;
        resolution: THREE.Vector2;
        patternTexture: THREE.Texture;

        maskBufferMaterial: THREE.MeshBasicMaterial;
        renderTargetMaskBuffer: THREE.WebGLRenderTarget;
        depthMaterial: THREE.MeshDepthMaterial;
        prepareMaskMaterial: THREE.ShaderMaterial;
        renderTargetDepthBuffer: THREE.WebGLRenderTarget;
        renderTargetMaskDownSampleBuffer: THREE.WebGLRenderTarget;
        renderTargetBlurBuffer1: THREE.WebGLRenderTarget;
        renderTargetBlurBuffer2: THREE.WebGLRenderTarget;
        edgeDetectionMaterial: THREE.ShaderMaterial;
        renderTargetEdgeBuffer1: THREE.WebGLRenderTarget;
        renderTargetEdgeBuffer2: THREE.WebGLRenderTarget;
        separableBlurMaterial1: THREE.ShaderMaterial;
        separableBlurMaterial2: THREE.ShaderMaterial;
        overlayMaterial: THREE.ShaderMaterial;
        copyUniforms: object;
        materialCopy: THREE.ShaderMaterial;
        oldClearColor: THREE.Color;
        oldClearAlpha: number;
        fsQuad: object;
        tempPulseColor1: THREE.Color;
        tempPulseColor2: THREE.Color;
        textureMatrix: THREE.Matrix4;

        dispose(): void;
        changeVisibilityOfSelectedObjects(bVisible: boolean): void;
        changeVisibilityOfNonSelectedObjects(bVisible: boolean): void;
        updateTextureMatrix(): void;
        getPrepareMaskMaterial(): THREE.ShaderMaterial;
        getEdgeDetectionMaterial(): THREE.ShaderMaterial;
        getSeperableBlurMaterial(): THREE.ShaderMaterial;
        getOverlayMaterial(): THREE.ShaderMaterial; 
    }
}