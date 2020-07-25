//import {
//	Scene,
//	Camera,
//	Material,
//	Color
//} from '../../../src/Three';

//import { Pass } from './Pass';

declare namespace THREE {
    export class RenderPass extends Pass {

        constructor(scene: THREE.Scene, camera: THREE.Camera, overrideMaterial?: THREE.Material, clearColor?: THREE.Color, clearAlpha?: number);
        scene: THREE.Scene;
        camera: THREE.Camera;
        overrideMaterial: THREE.Material;
        clearColor: THREE.Color;
        clearAlpha: number;
        clearDepth: boolean; 
    }
}
