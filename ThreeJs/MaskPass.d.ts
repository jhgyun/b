//import {
//	Scene,
//	Camera,
//} from '../../../src/Three';

//import { Pass } from './Pass';

declare namespace THREE {
    export class MaskPass extends Pass {

        constructor(scene: THREE.Scene, camera: THREE.Camera);
        scene: THREE.Scene;
        camera: THREE.Camera;
        inverse: boolean;

    }

    export class ClearMaskPass extends Pass {

        constructor();

    }
}
