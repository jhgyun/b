//import {
//	Material
//} from '../../../src/Three';

//import { Pass } from './Pass';

declare namespace THREE {
    export class ShaderPass extends Pass {

        constructor(shader: object, textureID?: string);
        textureID: string;
        uniforms: object;
        material: THREE.Material;
        fsQuad: object; 
    }
}
